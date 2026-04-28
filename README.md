# Clinic Management System

**Sistema de Gestão para Clínicas Veterinárias**

## Visão Geral

Plataforma completa de gestão para clínicas veterinárias com suporte a múltiplas unidades (workspaces), controle de acesso robusto e funcionalidades clínicas avançadas.

## Objetivos

- Gerenciar múltiplas clínicas veterinárias
- Controlar usuários com papéis e permissões granulares
- Organizar agendamentos de consultas
- Manter prontuários eletrônicos detalhados
- Facilitar prescrições e acompanhamento médico
- Registrar vacinações e procedimentos
- Gerar relatórios clínicos e financeiros

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Backend | NestJS + TypeScript + Node.js 18 |
| Banco de dados | PostgreSQL 14+ |
| Cache | Redis 7+ |
| Frontend Web | Next.js 14 + TailwindCSS |
| App Mobile | Flutter 3.19+ / Dart 3.3+ (Android e iOS) |
| Infraestrutura local | Docker Compose |

## Módulos

### 1. Módulo de Sistema e Gestão de Usuários
- Arquitetura multi-tenant baseada em workspaces
- Gestão de estabelecimentos (clínicas)
- Controle de usuários com 7 tipos de papéis
- Sistema robusto de permissões
- Autenticação com 2FA
- Auditoria completa

**Tipos de Usuários:**
1. Super Admin — acesso total ao sistema
2. Workspace Owner — proprietário da organização
3. Establishment Owner — proprietário da clínica
4. Workspace Admin — admin da organização
5. Establishment Admin — admin da clínica
6. Veterinário — profissional veterinário
7. Recepcionista — atendimento
8. Funcionário — staff geral

**Documentação**: [PRD-modulo-sistema-usuarios.md](docs/PRD-modulo-sistema-usuarios.md)

### 2. Módulo de Clínica Veterinária
- Gestão de responsáveis (tutores) e animais
- Agendamento de consultas
- Prontuários eletrônicos
- Prescrições de medicamentos
- Registro de vacinações
- Solicitação e registro de exames
- Procedimentos e cirurgias
- Relatórios clínicos e financeiros

**Documentação**: [PRD-modulo-clinica-veterinaria.md](docs/PRD-modulo-clinica-veterinaria.md)

---

## Arquitetura Multi-tenant

```
Workspace (organização)
  ├── Establishment 1 (clínica)
  │   ├── Users (Vet, Recepcionista, etc)
  │   ├── Appointments
  │   ├── Animals
  │   └── Medical Records
  └── Establishment 2 (clínica)
      ├── Users
      ├── Appointments
      ├── Animals
      └── Medical Records
```

## Segurança

- Autenticação 2FA (Email, SMS, Authenticator)
- Senhas criptografadas com bcrypt
- JWT tokens para autenticação (access 15min + refresh 7 dias)
- Tokens mobile armazenados via flutter_secure_storage
- Rate limiting via Redis
- Auditoria de todas as ações
- Isolamento completo de dados multi-tenant
- HTTPS/TLS obrigatório

## Roadmap

### Fase 1 (MVP) — Web
- Estrutura de dados e APIs
- Autenticação e permissões
- Gestão de workspaces e clínicas
- Operação clínica básica (tutor, animal, agenda, prontuário)
- Dashboard web

### Fase 2 — App Mobile + Consolidação
- App Flutter nativo (Android e iOS)
- 2FA avançado
- Relatórios
- Melhorias operacionais

### Fase 3 — Expansão
- Portal do cliente
- Notificações push
- Agenda online

### Fase 4 — Plataforma Avançada
- Integrações externas
- Analytics avançado
- Telemedicina
- IA

## Documentação

- [Tech Stack](docs/tech-stack.md)
- [Escopo do MVP](docs/mvp-scope.md)
- [Roadmap Geral](docs/roadmap-geral.md)
- [Requisitos Não Funcionais](docs/non-functional-requirements.md)
- [Arquitetura de Banco de Dados](docs/database-architecture.md)
- [Visão Geral de Módulos da API](docs/api-modules-overview.md)
- [User Stories](docs/user-stories.md)
- [PRD — Módulo de Sistema e Usuários](docs/PRD-modulo-sistema-usuarios.md)
- [PRD — Módulo de Clínica Veterinária](docs/PRD-modulo-clinica-veterinaria.md)

---

**v1.1** — 2026-04-28
