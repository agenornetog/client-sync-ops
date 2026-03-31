import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate webhook secret
    const webhookSecret = Deno.env.get("UAZAPI_WEBHOOK_SECRET");
    const incomingSecret = req.headers.get("x-webhook-secret");

    if (webhookSecret && incomingSecret !== webhookSecret) {
      console.error("Invalid webhook secret");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    console.log("Webhook received:", JSON.stringify(payload).slice(0, 500));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Log the webhook event
    const eventType = payload.event || payload.type || "unknown";

    // Determine workspace from instance
    let workspaceId: string | null = null;
    const instancePhone = payload.instance?.phone || payload.from || null;

    if (instancePhone) {
      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("workspace_id, id")
        .eq("phone_number", instancePhone)
        .eq("status", "connected")
        .maybeSingle();

      if (instance) {
        workspaceId = instance.workspace_id;
      }
    }

    // Store webhook event for debugging/audit
    if (workspaceId) {
      await supabase.from("webhook_events").insert({
        workspace_id: workspaceId,
        event_type: eventType,
        payload,
        status: "received",
      });
    }

    // Route by event type
    switch (eventType) {
      case "message":
      case "messages.upsert":
        await handleIncomingMessage(supabase, payload, workspaceId);
        break;

      case "message.update":
      case "messages.update":
        await handleMessageStatusUpdate(supabase, payload);
        break;

      case "connection.update":
        await handleConnectionUpdate(supabase, payload, instancePhone);
        break;

      case "qrcode":
      case "qr":
        await handleQrCode(supabase, payload, instancePhone);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    // Mark as processed
    if (workspaceId) {
      await supabase
        .from("webhook_events")
        .update({ status: "processed" })
        .eq("workspace_id", workspaceId)
        .eq("event_type", eventType)
        .eq("status", "received")
        .order("created_at", { ascending: false })
        .limit(1);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// ─── Message Handlers ───────────────────────────────────────

async function handleIncomingMessage(
  supabase: any,
  payload: any,
  workspaceId: string | null
) {
  if (!workspaceId) {
    console.error("No workspace found for incoming message");
    return;
  }

  const msg = payload.message || payload.data || payload;
  const contactPhone = normalizePhone(
    msg.from || msg.remoteJid || msg.key?.remoteJid || ""
  );
  const isGroup = contactPhone.endsWith("@g.us");
  const contactName =
    msg.pushName || msg.senderName || msg.notify || contactPhone;

  if (!contactPhone || contactPhone === "status@broadcast") return;

  // Idempotency: check external_id
  const externalId =
    msg.key?.id || msg.id?.id || msg.messageId || msg.id || null;
  if (externalId) {
    const { data: existing } = await supabase
      .from("messages")
      .select("id")
      .eq("external_id", externalId)
      .maybeSingle();

    if (existing) {
      console.log(`Message ${externalId} already processed, skipping`);
      return;
    }
  }

  // Find or create contact
  let contact = await findOrCreateContact(
    supabase,
    workspaceId,
    contactPhone,
    contactName
  );

  // Find or create conversation
  let conversation = await findOrCreateConversation(
    supabase,
    workspaceId,
    contact.id,
    isGroup,
    msg
  );

  // Determine message type and content
  const { messageType, content, mediaUrl } = extractMessageContent(msg);

  // Insert message
  await supabase.from("messages").insert({
    conversation_id: conversation.id,
    sender_type: "contact",
    sender_name: contactName,
    direction: "inbound",
    type: messageType,
    content,
    media_url: mediaUrl,
    status: "delivered",
    external_id: externalId,
    metadata: { raw_key: msg.key || null },
  });

  // Update conversation
  await supabase
    .from("conversations")
    .update({
      last_message_at: new Date().toISOString(),
      unread_count: (conversation.unread_count || 0) + 1,
      status:
        conversation.status === "closed" || conversation.status === "resolved"
          ? "open"
          : conversation.status,
    })
    .eq("id", conversation.id);

  // Update contact last_seen
  await supabase
    .from("contacts")
    .update({ last_seen: new Date().toISOString() })
    .eq("id", contact.id);
}

async function handleMessageStatusUpdate(supabase: any, payload: any) {
  const update = payload.data || payload;
  const externalId = update.key?.id || update.id || null;
  const statusMap: Record<number, string> = {
    0: "pending",
    1: "sent",
    2: "delivered",
    3: "read",
    4: "read",
  };

  if (!externalId) return;

  const newStatus =
    statusMap[update.status] || statusMap[update.update?.status] || null;
  if (!newStatus) return;

  await supabase
    .from("messages")
    .update({ status: newStatus })
    .eq("external_id", externalId);
}

async function handleConnectionUpdate(
  supabase: any,
  payload: any,
  phone: string | null
) {
  if (!phone) return;

  const state = payload.state || payload.data?.state || payload.status;
  const statusMap: Record<string, string> = {
    open: "connected",
    close: "disconnected",
    connecting: "connecting",
    connected: "connected",
    disconnected: "disconnected",
  };

  const newStatus = statusMap[state] || "disconnected";

  await supabase
    .from("whatsapp_instances")
    .update({
      status: newStatus,
      last_seen: newStatus === "connected" ? new Date().toISOString() : undefined,
    })
    .eq("phone_number", phone);
}

async function handleQrCode(
  supabase: any,
  payload: any,
  phone: string | null
) {
  if (!phone) return;

  const qrCode = payload.qrcode || payload.data?.qrcode || payload.qr || null;

  await supabase
    .from("whatsapp_instances")
    .update({ qr_code: qrCode, status: "qr_code" })
    .eq("phone_number", phone);
}

// ─── Helpers ────────────────────────────────────────────────

function normalizePhone(phone: string): string {
  return phone.replace("@s.whatsapp.net", "").replace("@g.us", "@g.us");
}

async function findOrCreateContact(
  supabase: any,
  workspaceId: string,
  phone: string,
  name: string
) {
  const cleanPhone = phone.replace("@g.us", "");

  const { data: existing } = await supabase
    .from("contacts")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("phone", cleanPhone)
    .maybeSingle();

  if (existing) return existing;

  const { data: created } = await supabase
    .from("contacts")
    .insert({
      workspace_id: workspaceId,
      name: name || cleanPhone,
      phone: cleanPhone,
      origin: "whatsapp",
    })
    .select()
    .single();

  return created;
}

async function findOrCreateConversation(
  supabase: any,
  workspaceId: string,
  contactId: string,
  isGroup: boolean,
  msg: any
) {
  // Find open/pending/attending conversation
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("contact_id", contactId)
    .in("status", ["open", "pending", "attending"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing;

  const { data: created } = await supabase
    .from("conversations")
    .insert({
      workspace_id: workspaceId,
      contact_id: contactId,
      channel: "whatsapp",
      type: isGroup ? "group" : "individual",
      status: "open",
      is_bot_active: true,
      last_message_at: new Date().toISOString(),
      group_name: isGroup ? msg.subject || msg.groupName || null : null,
    })
    .select()
    .single();

  return created;
}

function extractMessageContent(msg: any): {
  messageType: string;
  content: string;
  mediaUrl: string | null;
} {
  const message = msg.message || msg;

  if (message.conversation || message.extendedTextMessage) {
    return {
      messageType: "text",
      content:
        message.conversation ||
        message.extendedTextMessage?.text ||
        "",
      mediaUrl: null,
    };
  }

  if (message.imageMessage) {
    return {
      messageType: "image",
      content: message.imageMessage.caption || "📷 Imagem",
      mediaUrl: message.imageMessage.url || null,
    };
  }

  if (message.audioMessage) {
    return {
      messageType: "audio",
      content: "🎵 Áudio",
      mediaUrl: message.audioMessage.url || null,
    };
  }

  if (message.videoMessage) {
    return {
      messageType: "video",
      content: message.videoMessage.caption || "🎬 Vídeo",
      mediaUrl: message.videoMessage.url || null,
    };
  }

  if (message.documentMessage) {
    return {
      messageType: "document",
      content:
        message.documentMessage.fileName ||
        message.documentMessage.title ||
        "📄 Documento",
      mediaUrl: message.documentMessage.url || null,
    };
  }

  if (message.stickerMessage) {
    return {
      messageType: "sticker",
      content: "🏷️ Sticker",
      mediaUrl: message.stickerMessage.url || null,
    };
  }

  if (message.locationMessage) {
    return {
      messageType: "location",
      content: `📍 ${message.locationMessage.degreesLatitude}, ${message.locationMessage.degreesLongitude}`,
      mediaUrl: null,
    };
  }

  if (message.contactMessage || message.contactsArrayMessage) {
    return {
      messageType: "contact",
      content:
        message.contactMessage?.displayName ||
        "👤 Contato",
      mediaUrl: null,
    };
  }

  // Fallback
  return {
    messageType: "text",
    content: JSON.stringify(message).slice(0, 500),
    mediaUrl: null,
  };
}
