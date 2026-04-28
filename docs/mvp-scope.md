# Escopo do MVP

**Versão**: 1.0  
**Data**: 2026-04-28  
**Status**: Draft

---

## Objetivo do MVP

Entregar uma primeira versão funcional do sistema de gestão para clínicas veterinárias com foco em:

- estrutura multi-tenant por workspace;
- cadastro e gestão de clínicas;
- gestão de usuários e acessos;
- operação clínica básica;
- base sólida para evolução dos próximos módulos.

O MVP deve permitir que uma clínica ou grupo de clínicas comece a operar o sistema com segurança, rastreabilidade e organização mínima necessária.

---

## O que entra no MVP

### 1. Módulo de Sistema e Usuários
- criação de workspace;
- obrigatoriedade de cadastro da primeira clínica;
- cadastro e gestão de estabelecimentos;
- cadastro, convite e gestão de usuários;
- papéis padrão do sistema;
- permissões básicas por papel;
- autenticação por email e senha;
- controle de sessão;
- auditoria básica.

### 2. Módulo de Clínica Veterinária
- cadastro de responsáveis/tutores;
- cadastro de animais;
- agendamento de consultas;
- listagem e atualização de agenda;
- criação de prontuário básico;
- registro de atendimento clínico;
- histórico por animal;
- registro de vacinação;
- registro de prescrição;
- cadastro básico de serviços.

### 3. Painéis e Operação
- dashboard administrativo básico;
- dashboard operacional da clínica;
- listagens com filtros essenciais;
- busca por animal, tutor e usuário.

### 4. Base Técnica
- banco PostgreSQL;
- backend NestJS/Node.js;
- frontend Next.js **responsivo** (compatível com navegadores mobile — Android e iOS);
- autenticação JWT;
- documentação inicial;
- logs básicos;
- docker compose local.

---

## O que não entra no MVP

### Funcionalidades adiadas
- portal do cliente/tutor;
- app mobile nativo (Android/iOS) — a aplicação web será responsiva e acessível via navegador mobile no MVP;
- telemedicina;
- integração automática com CRMV;
- pagamento online;
- chat em tempo real;
- BI avançado;
- IA para apoio clínico;
- integrações com laboratório;
- multi-idioma completo;
- assinatura eletrônica avançada;
- automação de campanhas/CRM.

### Segurança avançada fora do MVP
- SSO corporativo;
- autenticação por hardware key;
- política avançada por IP;
- gestão avançada de dispositivos.

---

## Perfis contemplados no MVP

- Super Admin
- Workspace Owner
- Establishment Owner
- Administrativo
- Recepcionista
- Veterinário
- Funcionário/Auxiliar

---

## Requisitos mínimos de entrega

### Gestão
- usuário consegue criar workspace;
- workspace só opera com clínica cadastrada;
- owner consegue convidar usuários;
- usuários possuem permissões coerentes com o papel.

### Clínica
- recepcionista consegue cadastrar tutor e animal;
- recepcionista consegue agendar consulta;
- veterinário consegue registrar atendimento;
- histórico clínico do animal fica disponível.

### Segurança
- login funcional;
- senhas criptografadas;
- sessões válidas;
- auditoria de ações críticas.

---

## Critérios para considerar o MVP pronto

- onboarding de workspace funcionando;
- gestão básica de usuários funcionando;
- gestão de clínica funcionando;
- fluxo de agendamento ao atendimento funcionando;
- dados isolados por workspace;
- documentação essencial disponível;
- ambiente local sobe com facilidade.

---

## Fora do escopo técnico inicial

- arquitetura de microserviços;
- alta disponibilidade multi-região;
- event sourcing;
- multi-banco por tenant.

A recomendação é iniciar com um monólito modular bem estruturado.

---

**Versão**: 1.0  
**Última atualização**: 2026-04-28
