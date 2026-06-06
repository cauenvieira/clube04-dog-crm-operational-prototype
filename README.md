# CRM Clube04 — Protótipo Operacional

Protótipo navegável para validar a operação real da Jornada do Lead do **Clube04 Mogi das Cruzes** antes da implementação definitiva no CRM real.

## Importante

Este projeto continua sendo um **mock local**, sem backend real. A diferença desta versão é que o mock passa a simular regras operacionais mais próximas do sistema real:

- dados em `localStorage`;
- login local mockado;
- papéis e permissões simuladas;
- configurações operacionais editáveis;
- Mesa Operacional orientada por próxima ação;
- auditoria local;
- separação entre status do lead, próxima ação e resultado da interação.

Não use este repositório como arquitetura final. Ele serve para validar UX, nomenclatura e regra operacional antes de importar a referência para o CRM real.

## Acessos locais

Senha padrão: `123456`.

- `admin@clube04.local` — Administrador
- `lider@clube04.local` — Líder
- `atendente@clube04.local` — Atendente

## Foco funcional

Fase atual:

- Operação;
- Login local;
- Configurações;
- Usuários e permissões;
- Auditoria;
- Teste manual da Jornada do Lead.

Fora do foco atual:

- Dashboard;
- IA;
- Campanhas avançadas;
- WhatsApp real;
- Integrações reais.

## Scripts

```bash
npm install
npm run dev
npm run build
```
