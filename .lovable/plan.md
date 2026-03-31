

# Plano: Redeploy seed-data + Gerenciamento de Instâncias WhatsApp

## Contexto
1. A Edge Function `seed-data` já foi corrigida no código (usa `getUser()`) mas os logs mostram que o deploy antigo com `getClaims` ainda está rodando — precisa redeploy.
2. A página Canais (`/canais`) usa mock data. Precisa conectar ao Supabase e permitir CRUD de instâncias.

---

## Etapa 1 — Redeploy da Edge Function `seed-data`

O código já está correto. Apenas forçar o redeploy usando a ferramenta de deploy de Edge Functions para que a versão corrigida entre em produção.

---

## Etapa 2 — Página de Gerenciamento de Instâncias WhatsApp

### 2a. Hook `useInstances`
Criar `src/hooks/useInstances.ts`:
- Busca instâncias da tabela `whatsapp_instances` filtradas pelo workspace do usuário (RLS cuida disso)
- CRUD completo: criar, editar, excluir instâncias
- Real-time subscription para atualizações de status

### 2b. Refatorar `src/pages/Channels.tsx`
Remover import de `mockInstances` e conectar ao hook real:
- **Listagem**: Cards com status real (connected/disconnected/connecting/qr_code)
- **Criar instância**: Dialog/Sheet com formulário (nome, telefone, API URL, API Token)
- **Editar instância**: Dialog para atualizar configurações
- **Excluir instância**: Confirmação via AlertDialog
- **QR Code**: Exibir `qr_code` da instância quando status = `qr_code`
- **Reconectar**: Botão que chama a UAZAPI para reconectar (via Edge Function futura)
- **Empty state**: Quando não há instâncias, exibir CTA para criar a primeira

### 2c. Componente de formulário
Criar `src/components/channels/InstanceFormDialog.tsx`:
- Campos: nome, telefone, API URL, API Token
- Validação básica
- Modo criar/editar

---

## Arquivos modificados/criados

| Arquivo | Ação |
|---------|------|
| `src/hooks/useInstances.ts` | Criar — hook com CRUD + real-time |
| `src/components/channels/InstanceFormDialog.tsx` | Criar — dialog de formulário |
| `src/pages/Channels.tsx` | Refatorar — dados reais, CRUD, empty state |
| `supabase/functions/seed-data/index.ts` | Redeploy (sem alteração de código) |

---

## Detalhes técnicos
- RLS já configurada na tabela `whatsapp_instances` com filtro por workspace
- Campos sensíveis (`api_token`) exibidos com máscara (••••) e botão para revelar
- O seed-data já insere 2 instâncias de exemplo, então após o redeploy e execução do seed, a página terá dados reais

