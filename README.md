# Clinic Management System

**Sistema de Gestão para Clínicas Veterinárias**

## 📋 Visão Geral

Plataforma completa de gestão para clínicas veterinárias com suporte a múltiplas unidades (workspaces), controle de acesso robusto e funcionalidades clínicas avançadas.

## 🎯 Objetivos

- Gerenciar múltiplas clínicas veterinárias
- Controlar usuários com papéis e permissões granulares
- Organizar agendamentos de consultas
- Manter prontuários eletrônicos detalhados
- Facilitar prescrições e acompanhamento médico
- Registrar vacinações e procedimentos
- Gerar relatórios clínicos e financeiros

## 📦 Módulos

### 1. Módulo de Sistema e Gestão de Usuários 🔐
- Arquitetura multi-tenant baseada em workspaces
- Gestão de estabelecimentos (clínicas)
- Controle de usuários com 7 tipos de papéis
- Sistema robusto de permissões
- Autenticação com 2FA
- Auditoria completa

**Tipos de Usuários:**
1. Super Admin - Acesso total ao sistema
2. Workspace Owner - Proprietário da organização
3. Establishment Owner - Proprietário da clínica
4. Workspace Admin - Admin da organização
5. Establishment Admin - Admin da clínica
6. Veterinário - Profissional veterinário
7. Recepcionista - Atendimento
8. Funcionário - Staff geral

**Documentação**: [PRD-modulo-sistema-usuarios.md](docs/PRD-modulo-sistema-usuarios.md)

### 2. Módulo de Clínica Veterinária 🏥
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

## 🏗️ Arquitetura Multi-tenant

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

## 🔒 Segurança

- Autenticação 2FA (Email, SMS, Authenticator)
- Senhas criptografadas com bcrypt
- JWT tokens para autenticação
- Rate limiting
- Auditoria de todas as ações
- Isolamento completo de dados multi-tenant
- HTTPS/TLS obrigatório

## 📈 Roadmap

### Fase 1 (MVP)
- Estrutura de dados
- APIs básicas
- Autenticação
- Dashboard simples

### Fase 2
- Todas as APIs
- 2FA avançado
- Relatórios
- Mobile app

### Fase 3
- Integrações externas
- Analytics avançado
- Portal do cliente

### Fase 4
- IA e machine learning
- Telemedicina
- Marketplace de serviços

## 📚 Documentação

- [PRD - Módulo de Sistema e Usuários](docs/PRD-modulo-sistema-usuarios.md)
- [PRD - Módulo de Clínica Veterinária](docs/PRD-modulo-clinica-veterinaria.md)

## 🚀 Como Começar

1. Leia os PRDs completos
2. Crie as issues de desenvolvimento
3. Configure o ambiente
4. Inicie o desenvolvimento

## 📞 Contato

Para dúvidas sobre o projeto, entre em contato com o time de produto.

---

**v1.0** - 2026-04-28
