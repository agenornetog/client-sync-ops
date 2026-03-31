import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = user.id;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Create workspace
    const wsId = crypto.randomUUID();
    await admin.from("workspaces").insert({
      id: wsId,
      name: "AtendePro Demo",
      slug: `atendepro-${Date.now().toString(36)}`,
      timezone: "America/Sao_Paulo",
    });

    // 2. Link profile
    await admin.from("profiles").update({ workspace_id: wsId, name: "Agenor Neto" }).eq("id", userId);

    // 3. Admin role
    await admin.from("user_roles").upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

    // 4. Agent profile
    await admin.from("agent_profiles").upsert(
      { user_id: userId, display_name: "Agenor Neto", max_concurrent_chats: 10, is_available: true },
      { onConflict: "user_id" }
    );

    // 5. Tags
    const tags = [
      { workspace_id: wsId, name: "Urgente", color: "#EF4444", usage_count: 23 },
      { workspace_id: wsId, name: "VIP", color: "#F59E0B", usage_count: 12 },
      { workspace_id: wsId, name: "Suporte", color: "#3B82F6", usage_count: 45 },
      { workspace_id: wsId, name: "Vendas", color: "#10B981", usage_count: 31 },
      { workspace_id: wsId, name: "Financeiro", color: "#8B5CF6", usage_count: 17 },
      { workspace_id: wsId, name: "Reclamação", color: "#EC4899", usage_count: 8 },
      { workspace_id: wsId, name: "Novo Lead", color: "#06B6D4", usage_count: 38 },
      { workspace_id: wsId, name: "Retorno", color: "#84CC16", usage_count: 14 },
    ];
    const { data: tagRows } = await admin.from("tags").insert(tags).select();

    // 6. Queues
    const queues = [
      { workspace_id: wsId, name: "Suporte Geral", description: "Atendimento geral ao cliente", color: "#3B82F6" },
      { workspace_id: wsId, name: "Vendas", description: "Equipe comercial", color: "#10B981" },
      { workspace_id: wsId, name: "Financeiro", description: "Cobranças e pagamentos", color: "#8B5CF6" },
    ];
    const { data: queueRows } = await admin.from("queues").insert(queues).select();

    // 7. WhatsApp instances
    await admin.from("whatsapp_instances").insert([
      { workspace_id: wsId, name: "Atendimento Principal", phone_number: "+5511999000001", status: "connected", api_url: "https://api.uazapi.com", last_seen: new Date().toISOString() },
      { workspace_id: wsId, name: "Vendas", phone_number: "+5511999000002", status: "disconnected", api_url: "https://api.uazapi.com" },
    ]);

    // 8. Contacts
    const contacts = [
      { workspace_id: wsId, name: "Maria Oliveira", phone: "+5511999887766", email: "maria@email.com", notes: "Cliente desde 2023. Prefere atendimento rápido.", origin: "whatsapp" },
      { workspace_id: wsId, name: "João Santos", phone: "+5521988776655", email: "joao.santos@empresa.com", notes: "Empresa: TechBR Soluções", origin: "whatsapp" },
      { workspace_id: wsId, name: "Fernanda Lima", phone: "+5531977665544", origin: "whatsapp" },
      { workspace_id: wsId, name: "Ricardo Almeida", phone: "+5511966554433", email: "ricardo@gmail.com", origin: "manual" },
      { workspace_id: wsId, name: "Patrícia Souza", phone: "+5548955443322", origin: "whatsapp" },
      { workspace_id: wsId, name: "Bruno Ferreira", phone: "+5519944332211", email: "bruno.f@hotmail.com", origin: "whatsapp" },
      { workspace_id: wsId, name: "Camila Rodrigues", phone: "+5541933221100", origin: "import" },
      { workspace_id: wsId, name: "Diego Martins", phone: "+5585922110099", origin: "whatsapp" },
      { workspace_id: wsId, name: "Larissa Nunes", phone: "+5527911009988", email: "larissa@startup.io", origin: "api" },
      { workspace_id: wsId, name: "Pedro Costa", phone: "+5561900112233", origin: "whatsapp" },
    ];
    const { data: contactRows } = await admin.from("contacts").insert(contacts).select();

    if (!contactRows || !tagRows || !queueRows) {
      return new Response(JSON.stringify({ error: "Failed to create seed data" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 9. Contact tags
    const contactTagLinks = [
      { contact_id: contactRows[0].id, tag_id: tagRows[1].id }, // Maria - VIP
      { contact_id: contactRows[0].id, tag_id: tagRows[3].id }, // Maria - Vendas
      { contact_id: contactRows[1].id, tag_id: tagRows[2].id }, // João - Suporte
      { contact_id: contactRows[2].id, tag_id: tagRows[0].id }, // Fernanda - Urgente
      { contact_id: contactRows[2].id, tag_id: tagRows[5].id }, // Fernanda - Reclamação
      { contact_id: contactRows[3].id, tag_id: tagRows[6].id }, // Ricardo - Novo Lead
      { contact_id: contactRows[4].id, tag_id: tagRows[3].id }, // Patrícia - Vendas
      { contact_id: contactRows[5].id, tag_id: tagRows[4].id }, // Bruno - Financeiro
      { contact_id: contactRows[6].id, tag_id: tagRows[2].id }, // Camila - Suporte
      { contact_id: contactRows[7].id, tag_id: tagRows[1].id }, // Diego - VIP
      { contact_id: contactRows[8].id, tag_id: tagRows[6].id }, // Larissa - Novo Lead
    ];
    await admin.from("contact_tags").insert(contactTagLinks);

    // 10. Conversations
    const now = new Date();
    const conversations = [
      { workspace_id: wsId, contact_id: contactRows[0].id, channel: "whatsapp", type: "individual", status: "attending", assigned_agent_id: userId, queue_id: queueRows[1].id, is_bot_active: false, is_favorited: true, unread_count: 2, last_message_at: new Date(now.getTime() - 30 * 60000).toISOString() },
      { workspace_id: wsId, contact_id: contactRows[1].id, channel: "whatsapp", type: "individual", status: "open", is_bot_active: true, unread_count: 5, last_message_at: new Date(now.getTime() - 10 * 60000).toISOString() },
      { workspace_id: wsId, contact_id: contactRows[2].id, channel: "whatsapp", type: "individual", status: "pending", assigned_agent_id: userId, is_bot_active: false, unread_count: 1, last_message_at: new Date(now.getTime() - 120 * 60000).toISOString() },
      { workspace_id: wsId, contact_id: contactRows[3].id, channel: "whatsapp", type: "individual", status: "resolved", assigned_agent_id: userId, is_bot_active: false, unread_count: 0, last_message_at: new Date(now.getTime() - 1440 * 60000).toISOString(), resolved_at: new Date(now.getTime() - 1440 * 60000).toISOString() },
      { workspace_id: wsId, contact_id: contactRows[4].id, channel: "whatsapp", type: "individual", status: "attending", assigned_agent_id: userId, queue_id: queueRows[1].id, is_bot_active: false, is_favorited: true, unread_count: 0, last_message_at: new Date(now.getTime() - 60 * 60000).toISOString() },
      { workspace_id: wsId, contact_id: contactRows[5].id, channel: "whatsapp", type: "individual", status: "open", is_bot_active: false, unread_count: 3, last_message_at: new Date(now.getTime() - 180 * 60000).toISOString() },
      { workspace_id: wsId, contact_id: contactRows[8].id, channel: "whatsapp", type: "individual", status: "open", is_bot_active: true, unread_count: 4, last_message_at: new Date(now.getTime() - 5 * 60000).toISOString() },
    ];
    const { data: convRows } = await admin.from("conversations").insert(conversations).select();

    if (!convRows) {
      return new Response(JSON.stringify({ error: "Failed to create conversations" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 11. Conversation tags
    const convTagLinks = [
      { conversation_id: convRows[0].id, tag_id: tagRows[1].id },
      { conversation_id: convRows[0].id, tag_id: tagRows[3].id },
      { conversation_id: convRows[1].id, tag_id: tagRows[2].id },
      { conversation_id: convRows[2].id, tag_id: tagRows[0].id },
      { conversation_id: convRows[2].id, tag_id: tagRows[5].id },
      { conversation_id: convRows[3].id, tag_id: tagRows[6].id },
      { conversation_id: convRows[5].id, tag_id: tagRows[4].id },
      { conversation_id: convRows[6].id, tag_id: tagRows[3].id },
      { conversation_id: convRows[6].id, tag_id: tagRows[6].id },
    ];
    await admin.from("conversation_tags").insert(convTagLinks);

    // 12. Messages
    const allMessages = [
      // Conv 1 - Maria (vendas)
      { conversation_id: convRows[0].id, sender_type: "bot", direction: "outbound", type: "text", content: "Olá! 👋 Bem-vindo(a) ao AtendePro. Como posso ajudar?\n\n1️⃣ Vendas\n2️⃣ Suporte\n3️⃣ Financeiro\n4️⃣ Outros", status: "read", created_at: new Date(now.getTime() - 4320 * 60000).toISOString() },
      { conversation_id: convRows[0].id, sender_type: "contact", direction: "inbound", type: "text", content: "1", status: "read", created_at: new Date(now.getTime() - 4319 * 60000).toISOString() },
      { conversation_id: convRows[0].id, sender_type: "system", direction: "outbound", type: "system", content: "Conversa transferida para a fila Vendas", status: "read", created_at: new Date(now.getTime() - 4318 * 60000).toISOString() },
      { conversation_id: convRows[0].id, sender_type: "agent", sender_id: userId, sender_name: "Agenor Neto", direction: "outbound", type: "text", content: "Olá, Maria! Eu sou o Agenor, da equipe de vendas. Tudo bem? Em que posso te ajudar?", status: "read", created_at: new Date(now.getTime() - 4315 * 60000).toISOString() },
      { conversation_id: convRows[0].id, sender_type: "contact", direction: "inbound", type: "text", content: "Oi! Tudo sim. Estou procurando uma solução de atendimento para minha loja. Vocês atendem pequenas empresas?", status: "read", created_at: new Date(now.getTime() - 4313 * 60000).toISOString() },
      { conversation_id: convRows[0].id, sender_type: "agent", sender_id: userId, sender_name: "Agenor Neto", direction: "outbound", type: "text", content: "Com certeza, Maria! Temos planos a partir de R$ 97/mês perfeitos para operações menores. Quantos atendentes vocês têm hoje?", status: "read", created_at: new Date(now.getTime() - 4310 * 60000).toISOString() },
      { conversation_id: convRows[0].id, sender_type: "contact", direction: "inbound", type: "text", content: "Somos 3 pessoas que atendem os clientes. Hoje usamos só o WhatsApp pessoal, tá uma bagunça 😅", status: "read", created_at: new Date(now.getTime() - 4308 * 60000).toISOString() },
      { conversation_id: convRows[0].id, sender_type: "agent", sender_id: userId, sender_name: "Agenor Neto", direction: "outbound", type: "text", content: "Entendo perfeitamente! Com o AtendePro vocês centralizam tudo. Vou preparar uma proposta personalizada!", status: "read", created_at: new Date(now.getTime() - 4305 * 60000).toISOString() },
      { conversation_id: convRows[0].id, sender_type: "contact", direction: "inbound", type: "text", content: "Oi, gostaria de saber sobre o plano empresarial. Vocês têm desconto para startups?", status: "delivered", created_at: new Date(now.getTime() - 30 * 60000).toISOString() },

      // Conv 2 - João (suporte bot)
      { conversation_id: convRows[1].id, sender_type: "bot", direction: "outbound", type: "text", content: "Olá! 👋 Bem-vindo(a) ao suporte. Como posso ajudar?\n\n1️⃣ Problema técnico\n2️⃣ Dúvida sobre o serviço\n3️⃣ Falar com atendente", status: "read", created_at: new Date(now.getTime() - 15 * 60000).toISOString() },
      { conversation_id: convRows[1].id, sender_type: "contact", direction: "inbound", type: "text", content: "1", status: "read", created_at: new Date(now.getTime() - 14 * 60000).toISOString() },
      { conversation_id: convRows[1].id, sender_type: "bot", direction: "outbound", type: "text", content: "Entendi que você está com um problema técnico. Pode descrever o que está acontecendo?", status: "read", created_at: new Date(now.getTime() - 13 * 60000).toISOString() },
      { conversation_id: convRows[1].id, sender_type: "contact", direction: "inbound", type: "text", content: "Estou com problema no login. Já tentei redefinir a senha duas vezes e não funciona.", status: "delivered", created_at: new Date(now.getTime() - 10 * 60000).toISOString() },

      // Conv 3 - Fernanda (pendente/urgente)
      { conversation_id: convRows[2].id, sender_type: "contact", direction: "inbound", type: "text", content: "Boa tarde, preciso falar sobre meu pedido", status: "read", created_at: new Date(now.getTime() - 1500 * 60000).toISOString() },
      { conversation_id: convRows[2].id, sender_type: "agent", sender_id: userId, sender_name: "Agenor Neto", direction: "outbound", type: "text", content: "Olá Fernanda, pode me informar o número do pedido?", status: "read", created_at: new Date(now.getTime() - 1495 * 60000).toISOString() },
      { conversation_id: convRows[2].id, sender_type: "contact", direction: "inbound", type: "text", content: "Pedido #4521. Estava previsto para chegar segunda-feira e até agora nada.", status: "read", created_at: new Date(now.getTime() - 1493 * 60000).toISOString() },
      { conversation_id: convRows[2].id, sender_type: "contact", direction: "inbound", type: "text", content: "Preciso de uma solução urgente. Meu pedido #4521 está atrasado há 5 dias!", status: "delivered", created_at: new Date(now.getTime() - 120 * 60000).toISOString() },

      // Conv 4 - Ricardo (resolvida)
      { conversation_id: convRows[3].id, sender_type: "contact", direction: "inbound", type: "text", content: "Olá, gostaria de saber mais sobre os planos", status: "read", created_at: new Date(now.getTime() - 2880 * 60000).toISOString() },
      { conversation_id: convRows[3].id, sender_type: "agent", sender_id: userId, sender_name: "Agenor Neto", direction: "outbound", type: "text", content: "Perfeito, Ricardo! Fico feliz em ajudar. Qualquer dúvida, estamos à disposição. 😊", status: "read", created_at: new Date(now.getTime() - 1440 * 60000).toISOString() },

      // Conv 5 - Patrícia (em atendimento)
      { conversation_id: convRows[4].id, sender_type: "contact", direction: "inbound", type: "text", content: "Oi, quero renovar meu contrato", status: "read", created_at: new Date(now.getTime() - 480 * 60000).toISOString() },
      { conversation_id: convRows[4].id, sender_type: "agent", sender_id: userId, sender_name: "Agenor Neto", direction: "outbound", type: "text", content: "Patrícia, vou enviar a proposta atualizada até o final do dia. Combinado?", status: "read", created_at: new Date(now.getTime() - 60 * 60000).toISOString() },

      // Conv 6 - Bruno (financeiro)
      { conversation_id: convRows[5].id, sender_type: "contact", direction: "inbound", type: "text", content: "Bom dia! Preciso do boleto atualizado da fatura de março. Podem enviar?", status: "delivered", created_at: new Date(now.getTime() - 180 * 60000).toISOString() },

      // Conv 7 - Larissa (novo lead com bot)
      { conversation_id: convRows[6].id, sender_type: "bot", direction: "outbound", type: "text", content: "Olá! 👋 Bem-vindo(a) ao AtendePro. Como posso ajudar?\n\n1️⃣ Vendas\n2️⃣ Suporte\n3️⃣ Financeiro", status: "read", created_at: new Date(now.getTime() - 8 * 60000).toISOString() },
      { conversation_id: convRows[6].id, sender_type: "contact", direction: "inbound", type: "text", content: "Oi! Vi o anúncio de vocês no Instagram. Quero saber mais sobre a plataforma.", status: "delivered", created_at: new Date(now.getTime() - 5 * 60000).toISOString() },
    ];
    await admin.from("messages").insert(allMessages);

    // 13. Internal notes
    await admin.from("internal_notes").insert([
      { conversation_id: convRows[0].id, user_id: userId, user_name: "Agenor Neto", content: "Cliente interessada no plano empresarial. Preparar proposta com desconto de 15% para startups." },
      { conversation_id: convRows[2].id, user_id: userId, user_name: "Agenor Neto", content: "Pedido #4521 com problema na transportadora. Aberto chamado #789 na logística." },
    ]);

    // 14. Quick replies
    await admin.from("quick_replies").insert([
      { workspace_id: wsId, title: "Saudação", shortcut: "/ola", content: "Olá, {{nome_cliente}}! Tudo bem? Eu sou {{atendente}} da {{empresa}}. Como posso ajudar?", category: "Geral", variables: ["nome_cliente", "atendente", "empresa"] },
      { workspace_id: wsId, title: "Aguarde", shortcut: "/aguarde", content: "{{nome_cliente}}, vou verificar isso para você. Um momento, por favor! 🔍", category: "Geral", variables: ["nome_cliente"] },
      { workspace_id: wsId, title: "Encerramento", shortcut: "/tchau", content: "Foi um prazer ajudar, {{nome_cliente}}! Se precisar de mais alguma coisa, estamos à disposição. Tenha um ótimo dia! 😊", category: "Geral", variables: ["nome_cliente"] },
      { workspace_id: wsId, title: "Horário de atendimento", shortcut: "/horario", content: "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Fora desse período, deixe sua mensagem que retornaremos assim que possível!", category: "Informações", variables: [] },
      { workspace_id: wsId, title: "Pix", shortcut: "/pix", content: "Para pagamento via Pix, utilize a chave: pagamentos@atendepro.com. Após o pagamento, envie o comprovante aqui mesmo! 💰", category: "Financeiro", variables: [] },
    ]);

    // 15. Business hours
    const days = [0, 1, 2, 3, 4, 5, 6];
    await admin.from("business_hours").insert(
      days.map(d => ({
        workspace_id: wsId,
        day_of_week: d,
        is_open: d >= 1 && d <= 5,
        open_time: "08:00",
        close_time: "18:00",
      }))
    );

    return new Response(JSON.stringify({ 
      success: true, 
      workspace_id: wsId,
      contacts: contactRows.length,
      conversations: convRows.length,
      tags: tagRows.length,
    }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("Seed error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
