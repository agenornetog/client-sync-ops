import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SendTextPayload {
  type: "text";
  conversation_id: string;
  content: string;
}

interface SendImagePayload {
  type: "image";
  conversation_id: string;
  image_url: string;
  caption?: string;
}

interface SendDocumentPayload {
  type: "document";
  conversation_id: string;
  document_url: string;
  filename: string;
  caption?: string;
}

interface SendInteractivePayload {
  type: "interactive";
  conversation_id: string;
  body: string;
  buttons?: { id: string; title: string }[];
  list?: { title: string; sections: { title: string; rows: { id: string; title: string; description?: string }[] }[] };
  footer?: string;
}

type SendPayload = SendTextPayload | SendImagePayload | SendDocumentPayload | SendInteractivePayload;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    const userId = user.id;

    // Service client for DB writes
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const payload: SendPayload = await req.json();

    if (!payload.conversation_id || !payload.type) {
      return jsonResponse({ error: "conversation_id and type are required" }, 400);
    }

    // Get conversation with contact
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("*, contacts(*), whatsapp_instances(*)")
      .eq("id", payload.conversation_id)
      .single();

    if (convError || !conversation) {
      return jsonResponse({ error: "Conversation not found" }, 404);
    }

    const contact = conversation.contacts;
    const phone = contact.phone;

    // Get instance API config
    let apiUrl = Deno.env.get("UAZAPI_API_URL")!;
    let apiToken = Deno.env.get("UAZAPI_API_TOKEN")!;

    // Override with instance-specific config if available
    if (conversation.whatsapp_instances?.api_url) {
      apiUrl = conversation.whatsapp_instances.api_url;
    }
    if (conversation.whatsapp_instances?.api_token) {
      apiToken = conversation.whatsapp_instances.api_token;
    }

    // Build UAZAPI request
    let uazapiPayload: any;
    let endpoint: string;
    let messageContent: string;
    let messageType: string;
    let mediaUrl: string | null = null;

    switch (payload.type) {
      case "text":
        endpoint = `${apiUrl}/sendText`;
        uazapiPayload = { phone, message: payload.content };
        messageContent = payload.content;
        messageType = "text";
        break;

      case "image":
        endpoint = `${apiUrl}/sendImage`;
        uazapiPayload = {
          phone,
          image: payload.image_url,
          caption: payload.caption || "",
        };
        messageContent = payload.caption || "📷 Imagem";
        messageType = "image";
        mediaUrl = payload.image_url;
        break;

      case "document":
        endpoint = `${apiUrl}/sendDocument`;
        uazapiPayload = {
          phone,
          document: payload.document_url,
          fileName: payload.filename,
          caption: payload.caption || "",
        };
        messageContent = payload.caption || `📄 ${payload.filename}`;
        messageType = "document";
        mediaUrl = payload.document_url;
        break;

      case "interactive":
        // Try interactive first, fallback to numbered text
        const interactiveResult = await sendInteractiveWithFallback(
          apiUrl,
          apiToken,
          phone,
          payload
        );
        endpoint = interactiveResult.endpoint;
        uazapiPayload = interactiveResult.payload;
        messageContent = interactiveResult.content;
        messageType = interactiveResult.usedFallback ? "text" : "interactive";
        break;

      default:
        return jsonResponse({ error: `Unsupported message type: ${(payload as any).type}` }, 400);
    }

    // Send to UAZAPI (skip if interactive already sent)
    let externalId: string | null = null;

    if (payload.type !== "interactive") {
      const uazapiResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify(uazapiPayload),
      });

      const uazapiResult = await uazapiResponse.json();

      if (!uazapiResponse.ok) {
        console.error("UAZAPI error:", JSON.stringify(uazapiResult));

        // Log failed attempt
        await serviceClient.from("audit_logs").insert({
          workspace_id: conversation.workspace_id,
          user_id: userId,
          user_name: "",
          action: "send_message_failed",
          entity_type: "message",
          entity_id: payload.conversation_id,
          details: { error: uazapiResult, type: payload.type },
        });

        return jsonResponse({ error: "Failed to send message via UAZAPI", details: uazapiResult }, 502);
      }

      externalId = uazapiResult.key?.id || uazapiResult.id || uazapiResult.messageId || null;
    }

    // Get sender name
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .maybeSingle();

    // Save message to DB
    const { data: savedMessage, error: msgError } = await serviceClient
      .from("messages")
      .insert({
        conversation_id: payload.conversation_id,
        sender_type: "agent",
        sender_id: userId,
        sender_name: profile?.name || "Agente",
        direction: "outbound",
        type: messageType,
        content: messageContent,
        media_url: mediaUrl,
        status: "sent",
        external_id: externalId,
      })
      .select()
      .single();

    // Update conversation
    await serviceClient
      .from("conversations")
      .update({
        last_message_at: new Date().toISOString(),
        status: conversation.status === "open" ? "attending" : conversation.status,
        assigned_agent_id: conversation.assigned_agent_id || userId,
      })
      .eq("id", payload.conversation_id);

    // Audit log
    await serviceClient.from("audit_logs").insert({
      workspace_id: conversation.workspace_id,
      user_id: userId,
      user_name: profile?.name || "",
      action: "send_message",
      entity_type: "message",
      entity_id: savedMessage?.id || payload.conversation_id,
      details: { type: payload.type, to: phone },
    });

    return jsonResponse({ success: true, message: savedMessage });
  } catch (error) {
    console.error("Send message error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});

// ─── Interactive Messages with Fallback ─────────────────────

async function sendInteractiveWithFallback(
  apiUrl: string,
  apiToken: string,
  phone: string,
  payload: SendInteractivePayload
): Promise<{ endpoint: string; payload: any; content: string; usedFallback: boolean }> {
  // Build interactive payload
  let interactivePayload: any = null;
  let fallbackText = payload.body + "\n";

  if (payload.buttons && payload.buttons.length > 0) {
    // Button message (max 3 buttons in WhatsApp)
    interactivePayload = {
      phone,
      title: "",
      message: payload.body,
      footer: payload.footer || "",
      buttons: payload.buttons.map((b) => ({
        id: b.id,
        text: b.title,
      })),
    };

    // Fallback: numbered options
    payload.buttons.forEach((b, i) => {
      fallbackText += `\n${i + 1}. ${b.title}`;
    });
    if (payload.footer) fallbackText += `\n\n_${payload.footer}_`;
  } else if (payload.list) {
    // List message
    interactivePayload = {
      phone,
      title: payload.list.title,
      message: payload.body,
      footer: payload.footer || "",
      sections: payload.list.sections,
    };

    // Fallback: numbered sections
    let counter = 1;
    payload.list.sections.forEach((section) => {
      fallbackText += `\n*${section.title}*`;
      section.rows.forEach((row) => {
        fallbackText += `\n${counter}. ${row.title}`;
        if (row.description) fallbackText += ` - ${row.description}`;
        counter++;
      });
    });
    if (payload.footer) fallbackText += `\n\n_${payload.footer}_`;
  }

  // Try interactive first
  if (interactivePayload) {
    try {
      const endpoint = payload.buttons
        ? `${apiUrl}/sendButton`
        : `${apiUrl}/sendList`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify(interactivePayload),
      });

      if (response.ok) {
        return {
          endpoint,
          payload: interactivePayload,
          content: payload.body,
          usedFallback: false,
        };
      }

      console.warn("Interactive message failed, using text fallback");
    } catch (e) {
      console.warn("Interactive send error, falling back to text:", e);
    }
  }

  // Fallback to plain text with numbered options
  const textPayload = { phone, message: fallbackText.trim() };

  const response = await fetch(`${apiUrl}/sendText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(textPayload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Text fallback also failed: ${JSON.stringify(err)}`);
  }

  return {
    endpoint: `${apiUrl}/sendText`,
    payload: textPayload,
    content: fallbackText.trim(),
    usedFallback: true,
  };
}

// ─── Helpers ────────────────────────────────────────────────

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
