# Visão Geral dos Módulos de API

**Versão**: 1.0  
**Data**: 2026-04-28  
**Status**: Draft

---

## Objetivo

Mapear os principais domínios de API do sistema para orientar implementação backend, organização por módulos e futura documentação OpenAPI.

---

## Princípios

- organização modular por domínio;
- isolamento por workspace;
- segurança por autenticação e permissão;
- rastreabilidade por auditoria;
- clareza entre contexto administrativo e clínico.

---

## 1. Auth Module

### Responsabilidades
- login;
- refresh token;
- logout;
- recuperação de senha;
- sessão;
- 2FA.

### Exemplos de endpoints
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/2fa/enable`
- `POST /auth/2fa/verify`

---

## 2. Users Module

### Responsabilidades
- cadastro de usuários;
- consulta de usuários;
- atualização de perfil;
- ativação/inativação;
- associação a papéis.

### Exemplos de endpoints
- `GET /users`
- `POST /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `PATCH /users/:id/status`

---

## 3. Workspace Module

### Responsabilidades
- criação e gestão de workspace;
- configurações do workspace;
- visão administrativa do tenant.

### Exemplos de endpoints
- `GET /workspaces`
- `POST /workspaces`
- `GET /workspaces/:id`
- `PATCH /workspaces/:id`
- `GET /workspaces/:id/settings`
- `PATCH /workspaces/:id/settings`

---

## 4. Establishments Module

### Responsabilidades
- cadastro e gestão de clínicas;
- vínculo com workspace;
- ativação e inativação;
- configurações operacionais da clínica.

### Exemplos de endpoints
- `GET /establishments`
- `POST /establishments`
- `GET /establishments/:id`
- `PATCH /establishments/:id`
- `PATCH /establishments/:id/status`

---

## 5. Roles and Permissions Module

### Responsabilidades
- listar papéis;
- criar papéis customizados;
- editar permissões;
- atribuir papéis.

### Exemplos de endpoints
- `GET /roles`
- `POST /roles`
- `GET /roles/:id`
- `PATCH /roles/:id`
- `GET /permissions`

---

## 6. Invitations Module

### Responsabilidades
- gerar convite;
- reenviar convite;
- aceitar convite;
- expirar convite.

### Exemplos de endpoints
- `GET /invitations`
- `POST /invitations`
- `POST /invitations/:id/resend`
- `POST /invitations/accept`

---

## 7. Audit Module

### Responsabilidades
- consulta de logs;
- exportação;
- rastreabilidade administrativa.

### Exemplos de endpoints
- `GET /audit/logs`
- `GET /audit/logs/:id`
- `GET /audit/export`

---

## 8. Owners Module

### Responsabilidades
- cadastro de tutores/responsáveis;
- consulta e atualização;
- associação com animais.

### Exemplos de endpoints
- `GET /owners`
- `POST /owners`
- `GET /owners/:id`
- `PATCH /owners/:id`

---

## 9. Animals Module

### Responsabilidades
- cadastro de animais;
- histórico do paciente;
- status do animal;
- vínculo com tutor e clínica.

### Exemplos de endpoints
- `GET /animals`
- `POST /animals`
- `GET /animals/:id`
- `PATCH /animals/:id`
- `GET /animals/:id/history`

---

## 10. Appointments Module

### Responsabilidades
- agenda;
- criação de consulta;
- remarcação;
- cancelamento;
- status de atendimento.

### Exemplos de endpoints
- `GET /appointments`
- `POST /appointments`
- `GET /appointments/:id`
- `PATCH /appointments/:id`
- `PATCH /appointments/:id/status`

---

## 11. Medical Records Module

### Responsabilidades
- prontuários;
- histórico clínico;
- evolução;
- anexos.

### Exemplos de endpoints
- `GET /medical-records`
- `POST /medical-records`
- `GET /medical-records/:id`
- `PATCH /medical-records/:id`

---

## 12. Prescriptions Module

### Responsabilidades
- emissão de prescrição;
- consulta;
- vínculo com prontuário e animal.

### Exemplos de endpoints
- `GET /prescriptions`
- `POST /prescriptions`
- `GET /prescriptions/:id`

---

## 13. Vaccinations Module

### Responsabilidades
- registro vacinal;
- histórico de vacinação;
- próximas doses.

### Exemplos de endpoints
- `GET /vaccinations`
- `POST /vaccinations`
- `GET /vaccinations/:id`

---

## 14. Exams Module

### Responsabilidades
- solicitação de exames;
- registro de resultados;
- acompanhamento de status.

### Exemplos de endpoints
- `GET /exams`
- `POST /exams`
- `GET /exams/:id`
- `PATCH /exams/:id`

---

## 15. Procedures Module

### Responsabilidades
- registro de procedimentos;
- cirurgias;
- pós-operatório.

### Exemplos de endpoints
- `GET /procedures`
- `POST /procedures`
- `GET /procedures/:id`
- `PATCH /procedures/:id`

---

## 16. Services Module

### Responsabilidades
- cadastro de serviços;
- precificação básica;
- associação ao agendamento.

### Exemplos de endpoints
- `GET /services`
- `POST /services`
- `GET /services/:id`
- `PATCH /services/:id`

---

## Regras Gerais de API

1. Toda API autenticada deve respeitar o contexto do usuário.
2. Toda API multi-tenant deve respeitar o `workspace_id`.
3. APIs clínicas também devem respeitar o `establishment_id`, quando aplicável.
4. Ações críticas devem gerar auditoria.
5. Endpoints devem suportar paginação em listagens.
6. Filtros devem ser consistentes entre módulos.
7. Erros devem seguir padrão unificado de resposta.

---

## Próximo Passo Recomendado

Transformar este documento em:
- backlog técnico de endpoints;
- documentação OpenAPI/Swagger;
- contratos DTO;
- definição de guards e policies por módulo.

---

**Versão**: 1.0  
**Última atualização**: 2026-04-28
