# Roadmap Geral do Produto

**Versão**: 1.1
**Data**: 2026-04-28
**Status**: Draft

---

## Objetivo

Organizar a evolução do Clinic Management System em fases, priorizando a construção da base operacional, segurança, escalabilidade e experiência do usuário.

---

## Visão por Fases

### Fase 1 — MVP Operacional
Objetivo: colocar o sistema em uso com os recursos essenciais via web.

#### Entregas
- criação de workspace;
- criação obrigatória da primeira clínica;
- gestão de estabelecimentos;
- gestão de usuários;
- papéis e permissões básicas;
- autenticação com email e senha;
- sessões;
- auditoria básica;
- cadastro de tutor;
- cadastro de animal;
- agendamento de consultas;
- prontuário básico;
- vacinação;
- prescrição;
- dashboard básico.

#### Stack desta fase
- Backend: NestJS + PostgreSQL + Redis
- Frontend: Next.js + TailwindCSS

#### Resultado esperado
Uma clínica já consegue operar o sistema de forma básica e segura pelo navegador.

---

### Fase 2 — Consolidação Operacional + App Mobile
Objetivo: aumentar confiabilidade, controle e produtividade, e lançar o app mobile nativo.

#### Entregas
- **app mobile Flutter** (Android e iOS) com funcionalidades core:
  - autenticação e sessão;
  - dashboard operacional;
  - agenda e agendamentos;
  - consulta de prontuários e histórico;
  - cadastro de tutor e animal;
  - registro de atendimento clínico;
  - vacinação e prescrição;
- 2FA completo;
- filtros avançados;
- gestão de convites aprimorada;
- controle mais robusto de permissões;
- histórico detalhado por animal;
- relatórios operacionais;
- controle de exames;
- controle de procedimentos;
- melhorias de UX;
- observabilidade e logs mais completos.

#### Stack adicional desta fase
- Mobile: Flutter 3.19+ / Dart 3.3+ (Clean Architecture + BLoC + GoRouter)

#### Resultado esperado
O sistema se torna mais consistente para operação contínua, disponível também via app mobile.

---

### Fase 3 — Expansão de Produto
Objetivo: ampliar a proposta de valor para clientes e gestão.

#### Entregas
- portal do tutor (web + mobile);
- notificações push (mobile via FCM);
- agenda online para tutores;
- dashboards gerenciais;
- relatórios avançados;
- melhorias financeiras;
- integrações iniciais;
- gestão multiunidade mais sofisticada.

#### Resultado esperado
O produto passa a atender necessidades mais amplas de relacionamento, gestão e escala.

---

### Fase 4 — Plataforma Avançada
Objetivo: transformar o sistema em uma plataforma completa.

#### Entregas
- integrações externas robustas;
- telemedicina;
- recursos de IA;
- compliance avançado;
- automações complexas;
- APIs públicas;
- recursos enterprise.

#### Resultado esperado
O sistema se posiciona como plataforma madura para operação complexa e expansão.

---

## Dependências Entre Módulos

### Base obrigatória
1. sistema e usuários
2. estabelecimentos
3. autenticação e sessão
4. permissões
5. auditoria

### Dependem da base
- clínica veterinária
- agenda
- prontuário
- exames
- vacinação
- prescrições
- relatórios
- portal do tutor
- app mobile (consome a mesma API REST)

---

## Priorização Estratégica

### Prioridade Alta
- onboarding
- gestão de usuários
- gestão de estabelecimentos
- agenda
- prontuário
- tutor e animal

### Prioridade Média
- vacinação
- prescrição
- relatórios básicos
- auditoria expandida
- app mobile (Fase 2)

### Prioridade Baixa
- integrações externas
- telemedicina
- IA
- marketplace

---

## Riscos de Produto

- tentar entregar muitos módulos no MVP;
- não definir claramente o que entra e o que fica fora;
- misturar requisitos administrativos com clínicos sem separação;
- não garantir isolamento entre workspaces;
- não estruturar corretamente permissões;
- projetar a API sem considerar consumo mobile desde o início.

---

## Indicadores por Fase

### Fase 1
- tempo de onboarding;
- número de clínicas criadas;
- número de usuários ativos;
- número de agendamentos realizados;
- número de prontuários registrados.

### Fase 2
- adoção do app mobile;
- redução de erros operacionais;
- aumento de adoção interna;
- percentual de usuários com 2FA;
- tempo médio de atendimento.

### Fase 3
- retenção de clientes;
- uso do portal do tutor;
- taxa de comparecimento;
- uso de relatórios gerenciais.

### Fase 4
- receita por cliente;
- número de integrações ativas;
- uso de funcionalidades avançadas.

---

## Observação Final

O roadmap deve ser revisado continuamente com base em:
- feedback dos usuários;
- capacidade técnica do time;
- necessidades reais das clínicas;
- dados de uso do produto.

---

**Versão**: 1.1
**Última atualização**: 2026-04-28
