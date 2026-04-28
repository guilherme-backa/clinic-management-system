# PRD - Módulo de Configuração e Gestão do Sistema e Usuários

**Versão**: 1.0  
**Data**: 2026-04-28  
**Status**: Em Desenvolvimento

---

## 📌 Visão Geral

Este módulo é a base do sistema de gestão para clínicas veterinárias. Ele define a arquitetura multi-tenant por **workspace**, a gestão de **estabelecimentos/clínicas**, o controle de **usuários**, **papéis**, **permissões**, **convites**, **sessões** e **auditoria**.

A regra central do produto é:

- Cada **workspace** deve possuir **ao menos um estabelecimento/clínica cadastrado**.
- Os dados devem ser isolados por workspace.
- O acesso deve ser controlado por papéis e permissões granulares.

Este módulo habilita os demais módulos do sistema, incluindo o módulo de clínica veterinária.

---

## 🎯 Objetivos

1. Implementar arquitetura multi-tenant baseada em workspace.
2. Permitir que um workspace tenha uma ou mais clínicas/estabelecimentos.
3. Garantir que todo workspace tenha ao menos uma clínica ativa cadastrada.
4. Implementar gestão de usuários com múltiplos tipos de acesso.
5. Permitir configuração de papéis e permissões granulares.
6. Garantir segurança de autenticação, sessão e auditoria.
7. Suportar onboarding de novos workspaces e clínicas.
8. Preparar a base para os módulos operacionais da clínica.

---

## 👥 Tipos de Usuário

O sistema deve suportar inicialmente os seguintes tipos de acesso:

1. **Super Admin**
   - Acesso global à plataforma.
   - Pode administrar qualquer workspace.
   - Pode visualizar métricas globais e realizar suporte operacional.

2. **Workspace Owner**
   - Dono da organização/workspace.
   - Pode criar e administrar estabelecimentos dentro do workspace.
   - Pode convidar e gerenciar usuários do workspace.

3. **Establishment Owner**
   - Dono de um estabelecimento/clínica.
   - Pode administrar configurações da clínica e usuários vinculados à clínica.

4. **Administrativo / Admin**
   - Gestão administrativa do workspace ou clínica.
   - Pode operar configurações e usuários conforme permissões.

5. **Recepcionista**
   - Acesso operacional à clínica.
   - Atua em cadastro, agenda e atendimento administrativo.

6. **Veterinário**
   - Atua no atendimento clínico.
   - Acesso a agenda, prontuários e recursos clínicos conforme permissões.

7. **Funcionário / Auxiliar**
   - Acesso operacional de apoio.
   - Atua em funções administrativas ou assistenciais com escopo limitado.

---

## 🧱 Conceitos de Negócio

### Workspace
Unidade organizacional principal do sistema. Representa o agrupamento de uma ou mais clínicas sob uma mesma administração.

### Estabelecimento / Clínica
Unidade operacional vinculada a um workspace. Onde as operações do dia a dia acontecem.

### Usuário
Pessoa com acesso ao sistema. Pode atuar em um ou mais workspaces e um ou mais estabelecimentos, dependendo das permissões.

### Papel (Role)
Conjunto de permissões associadas a uma função.

### Permissão
Ação autorizada sobre determinado recurso do sistema.

---

## 📊 Estrutura de Dados

### 1. Workspace
```text
Workspace {
  id: UUID
  name: string
  slug: string
  description: text
  owner_id: UUID
  logo_url: string
  website: string
  status: ACTIVE | INACTIVE | SUSPENDED
  plan: FREE | BASIC | PROFESSIONAL | ENTERPRISE
  settings: json
  max_establishments: integer
  current_establishments: integer
  max_users: integer
  current_users: integer
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp | null
}
```

### 2. Establishment
```text
Establishment {
  id: UUID
  workspace_id: UUID
  name: string
  slug: string
  phone: string
  email: string
  website: string
  cnpj: string
  razao_social: string
  status: ACTIVE | INACTIVE | CLOSED
  opening_date: date
  operating_hours: json
  settings: json
  address: json
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp | null
}
```

### 3. User
```text
User {
  id: UUID
  email: string
  email_verified: boolean
  email_verified_at: timestamp | null
  first_name: string
  last_name: string
  cpf: string
  phone: string
  birthdate: date
  password_hash: string
  two_factor_enabled: boolean
  two_factor_method: EMAIL | SMS | AUTHENTICATOR | NONE
  two_factor_secret: string | null
  status: ACTIVE | INACTIVE | SUSPENDED | DELETED
  last_login_at: timestamp | null
  last_login_ip: string | null
  professional_license_number: string | null
  specialties: string[]
  settings: json
  avatar_url: string | null
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp | null
}
```

### 4. WorkspaceUser
```text
WorkspaceUser {
  id: UUID
  workspace_id: UUID
  user_id: UUID
  role_id: UUID
  status: ACTIVE | INACTIVE | SUSPENDED
  invited_at: timestamp
  accepted_at: timestamp | null
  additional_permissions: string[]
  denied_permissions: string[]
  created_at: timestamp
  updated_at: timestamp
}
```

### 5. EstablishmentUser
```text
EstablishmentUser {
  id: UUID
  establishment_id: UUID
  workspace_user_id: UUID
  user_id: UUID
  role_id: UUID
  status: ACTIVE | INACTIVE | SUSPENDED
  invited_at: timestamp
  accepted_at: timestamp | null
  additional_permissions: string[]
  denied_permissions: string[]
  assigned_by_id: UUID
  assigned_at: timestamp
  created_at: timestamp
  updated_at: timestamp
}
```

### 6. Role
```text
Role {
  id: UUID
  workspace_id: UUID | null
  name: string
  slug: string
  description: text
  type: SYSTEM | CUSTOM
  permissions: string[]
  is_system_role: boolean
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

### 7. Invitation
```text
Invitation {
  id: UUID
  token: string
  email: string
  workspace_id: UUID
  establishment_id: UUID | null
  role_id: UUID
  status: PENDING | ACCEPTED | EXPIRED | DECLINED
  invited_by_id: UUID
  accepted_by_id: UUID | null
  created_at: timestamp
  expires_at: timestamp
  accepted_at: timestamp | null
}
```

### 8. Session
```text
Session {
  id: UUID
  user_id: UUID
  workspace_id: UUID
  access_token: string
  refresh_token: string
  token_expires_at: timestamp
  ip_address: string
  user_agent: text
  device_info: json
  status: ACTIVE | EXPIRED | REVOKED
  created_at: timestamp
  last_activity_at: timestamp
  expires_at: timestamp
  revoked_at: timestamp | null
}
```

### 9. AuditLog
```text
AuditLog {
  id: UUID
  workspace_id: UUID
  establishment_id: UUID | null
  user_id: UUID
  action: string
  resource_type: string
  resource_id: UUID | null
  changes_before: json
  changes_after: json
  description: text
  ip_address: string
  user_agent: text
  severity: INFO | WARNING | ERROR | CRITICAL
  created_at: timestamp
}
```

---

## 🔄 Fluxos Principais

### Fluxo 1: Criação de Novo Workspace
1. Usuário acessa a plataforma.
2. Informa nome, email e senha.
3. O sistema cria o usuário base.
4. O sistema cria o workspace.
5. O sistema cria o vínculo do usuário como Workspace Owner.
6. O sistema exige o cadastro do primeiro estabelecimento.
7. O workspace só fica operacional após existir pelo menos uma clínica cadastrada.

### Fluxo 2: Cadastro do Primeiro Estabelecimento
1. Após criar o workspace, o usuário é direcionado para cadastrar a primeira clínica.
2. Informa nome, CNPJ, telefone, email, endereço e horários.
3. O sistema valida os campos obrigatórios.
4. O estabelecimento é criado e vinculado ao workspace.
5. O sistema marca o workspace como apto para operação.

### Fluxo 3: Convite de Usuário
1. Admin ou Owner informa email e papel.
2. O sistema gera um token de convite.
3. O convite é enviado por email.
4. Usuário aceita e cria conta ou vincula conta existente.
5. O vínculo com workspace e/ou estabelecimento é criado.

### Fluxo 4: Gestão de Usuários
1. Admin acessa a listagem de usuários.
2. Pode filtrar por nome, email, status, papel ou estabelecimento.
3. Pode ativar, suspender, editar papel ou remover vínculo.
4. Todas as ações são auditadas.

### Fluxo 5: Gestão de Papéis e Permissões
1. Owner/Admin acessa a área de papéis.
2. Pode usar papéis padrão do sistema.
3. Pode criar papéis customizados.
4. Pode associar permissões adicionais ou negar permissões específicas.

### Fluxo 6: Login
1. Usuário informa email e senha.
2. O sistema valida credenciais.
3. Se houver 2FA, o sistema solicita o segundo fator.
4. O sistema emite access token e refresh token.
5. Sessão é registrada.

### Fluxo 7: Recuperação de Senha
1. Usuário solicita recuperação.
2. Sistema envia link ou código.
3. Usuário redefine senha.
4. Sessões anteriores podem ser invalidadas.

### Fluxo 8: Auditoria
1. O sistema registra ações críticas.
2. Admin acessa relatórios de auditoria.
3. Pode filtrar por usuário, ação, recurso e período.

---

## 🔐 Permissões

### Workspace
- `workspace.create`
- `workspace.read`
- `workspace.update`
- `workspace.delete`
- `workspace.settings.view`
- `workspace.settings.update`
- `workspace.billing.view`
- `workspace.billing.manage`

### Establishment
- `establishment.create`
- `establishment.read`
- `establishment.update`
- `establishment.delete`
- `establishment.settings.view`
- `establishment.settings.update`

### Users
- `users.create`
- `users.read`
- `users.update`
- `users.delete`
- `users.activate`
- `users.suspend`
- `users.manage_roles`
- `users.manage_2fa`

### Roles
- `roles.create`
- `roles.read`
- `roles.update`
- `roles.delete`
- `roles.assign`

### Audit
- `audit.view`
- `audit.export`

---

## 🪜 Regras de Negócio

1. Todo workspace deve possuir ao menos um estabelecimento.
2. Não deve ser permitido uso operacional sem clínica cadastrada.
3. Usuários devem pertencer a um workspace antes de serem vinculados a um estabelecimento.
4. Convites devem expirar.
5. Ações críticas devem ser auditadas.
6. O Super Admin não pertence operacionalmente ao workspace, mas pode administrá-lo.
7. Um usuário pode atuar em múltiplos estabelecimentos, respeitando permissões.
8. Papéis do sistema podem ser imutáveis ou parcialmente editáveis conforme regra.

---

## 📱 Telas Principais

### 1. Onboarding de Workspace
- Criar conta
- Criar workspace
- Cadastrar primeira clínica

### 2. Dashboard Administrativo
- Resumo do workspace
- Quantidade de clínicas
- Quantidade de usuários
- Convites pendentes
- Alertas do sistema

### 3. Gestão de Estabelecimentos
- Lista de clínicas
- Criar clínica
- Editar clínica
- Ativar/Inativar clínica

### 4. Gestão de Usuários
- Lista de usuários
- Convites
- Perfis e permissões
- Vínculo por clínica

### 5. Segurança
- Login
- Recuperação de senha
- 2FA
- Sessões ativas

### 6. Auditoria
- Logs
- Filtros
- Exportação

---

## 📈 Métricas e KPIs

### Operacionais
- Total de workspaces
- Total de clínicas por workspace
- Total de usuários por workspace
- Convites pendentes
- Usuários ativos/inativos

### Segurança
- Taxa de falha de login
- Usuários com 2FA ativado
- Sessões ativas
- Tentativas bloqueadas

### Auditoria
- Ações críticas por período
- Alterações de papéis
- Suspensões de usuários
- Criação de clínicas

---

## 🗺️ Roadmap

### Fase 1 (MVP)
- Estrutura de dados
- Workspace
- Estabelecimentos
- Usuários
- Papéis e permissões
- Login e sessão
- Auditoria básica

### Fase 2
- Convites avançados
- 2FA completo
- Gestão de sessões
- Logs avançados

### Fase 3
- SSO
- Gestão avançada de planos
- Permissões customizadas mais sofisticadas

### Fase 4
- Compliance avançado
- Segurança corporativa
- Administração avançada multi-workspace

---

## ✅ Critérios de Aceitação

- [ ] É possível criar workspace e primeira clínica no onboarding.
- [ ] Workspace sem clínica não pode operar normalmente.
- [ ] Usuários podem ser convidados e vinculados corretamente.
- [ ] Papéis e permissões funcionam conforme esperado.
- [ ] Login com sessão e 2FA funciona corretamente.
- [ ] Logs de auditoria são registrados para ações críticas.
- [ ] Isolamento de dados por workspace está garantido.

---

## 🔎 Revisão do Repositório

Após revisão funcional do conteúdo já criado, os seguintes artefatos estão presentes ou previstos:

### Já existentes
- README.md
- docs/PRD-modulo-clinica-veterinaria.md
- docs/database-architecture.md
- docs/tech-stack.md
- .gitignore

### Adicionado agora
- docs/PRD-modulo-sistema-usuarios.md

### Recomendações adicionais
Também é recomendável adicionar, em seguida:

1. `docs/roadmap-geral.md`
   - consolidando roadmap de produto por fases
2. `docs/mvp-scope.md`
   - definindo o que entra e o que fica fora do MVP
3. `docs/user-stories.md`
   - histórias de usuário por perfil
4. `docs/non-functional-requirements.md`
   - performance, segurança, disponibilidade, LGPD, auditoria
5. `docs/api-modules-overview.md`
   - visão macro dos módulos de API

---

**Versão**: 1.0  
**Última atualização**: 2026-04-28  
**Status**: Em Desenvolvimento
