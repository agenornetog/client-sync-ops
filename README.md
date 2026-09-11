# **ConvoFlow Suite**

Atue como um Product Designer sênior, Staff Software Engineer e Arquiteto de SaaS.

Quero que você projete e implemente um SaaS de atendimento ao cliente com foco principal em WhatsApp, com arquitetura preparada para múltiplos canais no futuro, mas com MVP centrado em WhatsApp.

O produto deve ser completo, profissional, escalável, multi-tenant e com aparência moderna de software SaaS real. Não crie uma landing page genérica. Crie um sistema operacional de atendimento.

OBJETIVO DO PRODUTO

Criar uma plataforma onde empresas consigam:

- conectar números/instâncias do WhatsApp

- receber e responder mensagens de clientes

- organizar atendimentos por status, tags, filas e responsáveis

- automatizar parte do atendimento com bot e fluxos

- transferir para humano quando necessário

- usar respostas rápidas

- gerenciar contatos e histórico

- acompanhar métricas básicas da operação

- operar também grupos do WhatsApp quando necessário

ESCOPO DO MVP

Construa as seguintes áreas:

1. AUTENTICAÇÃO E SAAS

- login

- cadastro

- recuperação de senha

- multi-tenant por workspace/empresa

- perfis e permissões: admin, supervisor, atendente

- onboarding inicial da conta

2. DASHBOARD

- cartões com métricas principais

- conversas abertas

- não lidas

- pendentes

- resolvidas hoje

- atendimentos por agente

- tempo médio de primeira resposta

- volume por período

- status das instâncias do WhatsApp

3. MÓDULO DE ATENDIMENTO

- inbox principal estilo CRM/chat

- lista de conversas na lateral

- área central com histórico da conversa

- painel lateral com dados do contato

- filtros por:

  - status

  - atendente

  - tag

  - não lidas

  - canal

  - grupo ou individual

- ações da conversa:

  - responder

  - anexar

  - marcar como lida

  - adicionar/remover tags

  - atribuir responsável

  - transferir atendimento

  - encerrar/reabrir

  - adicionar nota interna

  - favoritar

- busca global por nome, número e conteúdo recente

- timeline do cliente

4. CONTATOS / CLIENTES

- cadastro e edição

- nome

- telefone

- email

- observações

- campos personalizados

- tags

- histórico de conversas

- atendente responsável

- origem do lead

- visão 360 do cliente

5. CANAIS

- no MVP, exibir WhatsApp como canal principal

- arquitetura pronta para adicionar Instagram, Telegram, Webchat e Email no futuro

- interface não deve depender de múltiplos canais para funcionar bem no MVP

6. WHATSAPP / INTEGRAÇÃO UAZAPI

Crie a integração considerando:

- gerenciamento de instâncias

- estados de conexão da instância

- conexão e reconexão

- recebimento de mensagens via webhook/eventos

- envio de mensagens

- suporte a mensagens simples

- suporte a mensagens interativas quando disponível

- suporte a grupos

- rastreabilidade de mensagens por identificadores externos

- armazenamento seguro de tokens

- logs técnicos de integração

Requisitos de integração:

- separar camada de integração da camada de negócio

- criar serviços/adapters para UAZAPI

- criar tratamento de falhas, retries e logs

- criar fila/event processing para webhooks

- garantir idempotência no recebimento de eventos

- manter sincronização de status de mensagens e chats

- sempre prever fallback para texto simples caso recurso interativo falhe

7. BOT E AUTOMAÇÃO

- bot de boas-vindas

- mensagem fora do horário comercial

- roteamento por opção

- handoff para humano

- regras por palavra-chave

- regras por tag

- regras por fila

- possibilidade de pausar o bot quando humano assumir

- histórico de execução das automações

8. CONFIGURAÇÃO DE FLUXO DE ATENDIMENTO

Crie um construtor de fluxo simples, funcional e fácil de evoluir.

Etapas suportadas:

- enviar mensagem

- esperar resposta

- condição por texto/opção

- adicionar tag

- remover tag

- atribuir fila

- atribuir atendente

- criar atraso

- encerrar fluxo

- transferir para humano

- webhook/action futura

O builder pode ser inicialmente em formato linear ou node-based simples, desde que seja limpo e utilizável.

9. TAGS

- CRUD de tags

- cor da tag

- contador de uso

- aplicação em massa

- filtro por tag no inbox e contatos

10. RESPOSTAS RÁPIDAS

- CRUD de respostas rápidas

- atalhos tipo /comando

- categorias

- busca instantânea no composer

- variáveis dinâmicas como nome do cliente

- suporte a templates internos

11. GRUPOS DO WHATSAPP

- listar grupos conectados

- abrir conversa de grupo

- visualizar participantes quando disponível

- enviar mensagens para grupo

- identificar visualmente quando a conversa é grupo

- filtros próprios para grupos

- não trate gestão avançada de comunidades como prioridade do MVP, mas deixe a estrutura pronta

12. CONFIGURAÇÕES

- dados da empresa

- horários de atendimento

- filas

- usuários

- permissões

- webhooks

- integrações

- auditoria básica

- preferências do inbox

13. RELATÓRIOS BÁSICOS

- volume por dia

- atendimentos por atendente

- tempo médio de resposta

- tempo médio de resolução

- tags mais usadas

- origem dos contatos

- taxa de conversas encerradas

UX/UI

Quero uma interface extremamente bem resolvida, inspirada em padrões modernos de apps encontrados no Mobbin, especialmente:

- inbox com ótima hierarquia visual

- chat detail muito limpo

- uso de cards, chips, status dots, filtros e busca

- dashboard claro e escaneável

- empty states elegantes

- loading states profissionais

- navegação moderna de SaaS

- design system consistente

- visual premium, minimalista e funcional

Diretrizes de UX:

- desktop first, mas responsivo

- sidebar esquerda para módulos

- painel de conversas + chat + painel contextual

- atalhos de teclado no inbox

- foco em velocidade operacional

- reduzir cliques

- estados visuais claros para:

  - online/offline

  - pendente

  - em atendimento

  - resolvido

  - não lido

- criar microcopys reais de produto, não lorem ipsum

- criar experiência parecida com software de operação real

IMPORTANTE SOBRE ESTILO

- não copie layouts específicos

- use apenas referências de linguagem visual e padrões de UX

- estética moderna, limpa e com alto nível de acabamento

- componentes reutilizáveis

- acessibilidade básica

- contraste adequado

- feedback visual claro

STACK TÉCNICA

Escolha uma stack moderna, produtiva e adequada para SaaS.

Preferência:

- Next.js

- TypeScript

- Tailwind

- shadcn/ui ou design system equivalente

- banco relacional com modelagem robusta

- auth pronta para multi-tenant

- ORM bem estruturado

- websocket ou atualização em tempo real para inbox

- filas para webhooks e automações

- API layer limpa

- arquitetura por módulos/domínio

Se a plataforma tiver limitações, adapte a stack, mas mantenha:

- arquitetura escalável

- separação entre frontend, backend e integração

- boas práticas

- código limpo

- nomenclatura profissional

MODELAGEM DE DADOS

Projete entidades como:

- Workspace

- User

- Role

- AgentProfile

- Channel

- WhatsAppInstance

- Contact

- Conversation

- ConversationParticipant

- Message

- MessageStatus

- MessageAttachment

- Tag

- ContactTag

- ConversationTag

- QuickReply

- Flow

- FlowNode

- FlowExecution

- Queue

- Assignment

- InternalNote

- BusinessHours

- WebhookEvent

- AuditLog

- ReportSnapshot

INTEGRAÇÃO COM UAZAPI

Considere no projeto:

- autenticação por token da instância

- área administrativa para configurar credenciais

- monitoramento dos estados de conexão da instância

- recebimento de eventos de mensagens

- envio de texto

- envio interativo quando suportado

- uso de tracking para correlacionar mensagens

- suporte a placeholders dinâmicos

- suporte a grupos

- fallback para texto simples quando interação nativa não for confiável

- logs detalhados para debugging

- tratamento de limite, instabilidade e reconexão

REGRAS DE NEGÓCIO

- quando o bot assumir, marcar conversa como automatizada

- quando humano responder, pausar automação

- supervisor pode reatribuir conversas

- admin pode gerenciar instâncias e usuários

- tags podem disparar automações futuras

- respostas rápidas podem aceitar variáveis

- grupos devem ser diferenciados de conversas 1:1

- mensagens recebidas por webhook não podem duplicar registros

- sistema deve manter rastreabilidade ponta a ponta

TELAS QUE DEVEM EXISTIR

- Login

- Cadastro

- Onboarding

- Dashboard

- Inbox

- Detalhe da conversa

- Contatos

- Detalhe do contato

- Tags

- Respostas rápidas

- Fluxos

- Conexões/Instâncias WhatsApp

- Grupos

- Relatórios

- Configurações gerais

- Usuários e permissões

- Horário de atendimento

- Logs/Webhooks

ENTREGÁVEIS

Quero que você entregue:

1. estrutura do produto

2. arquitetura técnica

3. sitemap/telas

4. modelagem de banco

5. componentes principais

6. fluxos do usuário

7. implementação inicial das páginas

8. dados mock realistas

9. documentação de setup

10. observações sobre escalabilidade

11. pontos futuros de evolução

MODO DE EXECUÇÃO

- tome decisões inteligentes sem ficar travando por dúvidas pequenas

- use nomes de variáveis, componentes e tabelas profissionais

- escreva código de produção, não protótipo frágil

- não simplifique o sistema para “apenas um chat”

- entregue base pronta para evolução real

- priorize clareza, organização e experiência de uso

- quando houver mais de uma opção, escolha a mais robusta para SaaS operacional

COMECE AGORA

1. definindo a arquitetura

2. listando os módulos

3. desenhando a modelagem de dados

4. criando as principais telas

5. implementando o MVP funcional com foco no inbox e integração WhatsApp

Regras extras:
- Sempre que criar recurso interativo de WhatsApp, implemente fallback automático para texto numerado.
- Toda ação importante deve gerar log/auditoria.
- Toda integração externa deve ficar isolada em services/adapters.
- O inbox deve ser o coração do sistema.
- O sistema deve parecer um produto SaaS premium pronto para vender.
- Evite excesso de elementos visuais; prefira clareza operacional.
- Gere seed inicial com conversas, tags, agentes, clientes e fluxos para demonstrar o produto.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://client-sync-ops.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5b98d727-ae02-46e8-ab4a-1bdaa0b5eebd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
