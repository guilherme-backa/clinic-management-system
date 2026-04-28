# PRD - Módulo de Clínica Veterinária

**Versão**: 1.1 | **Data**: 2026-04-28 | **Status**: Em Desenvolvimento

---

## 📌 Visão Geral

Este módulo é responsável pelas operações principais de uma clínica veterinária, incluindo gestão de pacientes (animais), agendamentos de consultas, prontuários eletrônicos, histórico médico e acompanhamento de saúde. É construído sobre a base do módulo de Sistema e Usuários.

---

## 🎯 Objetivos

1. Fornecer ferramentas completas para gestão de pacientes animais
2. Facilitar o agendamento e gestão de consultas
3. Permitir criação e manutenção de prontuários eletrônicos detalhados
4. Registrar histórico médico completo de cada animal
5. Otimizar a eficiência operacional da clínica
6. Melhorar a experiência do cliente (dono do animal)

---

## 📊 Estrutura de Dados

### 1. Owner (Responsável/Tutor do Animal)
```
Owner {
  id: UUID (PK)
  establishment_id: UUID (FK)
  user_id: UUID (FK - pode ser nulo se cliente não tiver conta)
  first_name: String
  last_name: String
  email: String (único por establishment_id)
  cpf: String (único)
  phone: String (obrigatório)
  phone_secondary: String
  address: Address
  birthdate: Date
  gender: MALE | FEMALE | OTHER
  document_type: CPF | CNPJ | PASSPORT
  document_number: String
  marital_status: SINGLE | MARRIED | DIVORCED | WIDOWED
  profession: String
  preferred_contact: EMAIL | PHONE | SMS | WHATSAPP
  notification_preference: EMAIL | SMS | PUSH | NONE
  status: ACTIVE | INACTIVE
  notes: Text
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp (soft delete)
}
```

### 2. Animal (Paciente)
```
Animal {
  id: UUID (PK)
  establishment_id: UUID (FK)
  owner_id: UUID (FK)
  name: String (obrigatório)
  species: String (Cão, Gato, Pássaro, Coelho, etc)
  breed: String
  color: String
  size: SMALL | MEDIUM | LARGE | EXTRA_LARGE
  birthdate: Date
  age_months: Integer (calculado)
  weight_kg: Decimal
  microchip_id: String (único no banco; o microchip é físico e deve ser globalmente único — unicidade enforçada sem escopo de establishment)
  registration_number: String
  gender: MALE | FEMALE
  castrated: Boolean
  castration_date: Date
  blood_type: String
  allergies: String[]
  chronic_diseases: String[]
  medications: String[]
  vaccination_status: String[]
  status: ACTIVE | INACTIVE | DECEASED
  photo_url: String
  notes: Text
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp (soft delete)
}
```

### 3. Appointment (Consulta/Agendamento)
```
Appointment {
  id: UUID (PK)
  establishment_id: UUID (FK)
  animal_id: UUID (FK)
  owner_id: UUID (FK)
  veterinarian_id: UUID (FK - User)
  scheduled_at: DateTime (obrigatório - data e hora unificadas; armazenar em UTC)
  duration_minutes: Integer (default: 30)
  appointment_type: CONSULTATION | VACCINATION | SURGERY | GROOMING | BOARDING | OTHERS
  status: SCHEDULED | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED | NO_SHOW
  cancellation_reason: String
  cancelled_by_id: UUID (FK - User)
  cancelled_at: Timestamp
  reminder_sent: Boolean
  reminder_sent_at: Timestamp
  reminder_method: EMAIL | SMS | WHATSAPP | PHONE | NONE
  notes: Text
  payment_status: UNPAID | PARTIALLY_PAID | PAID | WAIVED
  treatment_room_id: UUID (FK - Room, nullable)
  treatment_room: String (nome da sala - redundância para legibilidade)
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp (soft delete)
}
```

### 4. MedicalRecord (Prontuário/Atendimento)
```
MedicalRecord {
  id: UUID (PK)
  establishment_id: UUID (FK)
  appointment_id: UUID (FK)
  animal_id: UUID (FK)
  veterinarian_id: UUID (FK - User)
  visit_date: DateTime (obrigatório)
  chief_complaint: Text (obrigatório - queixa principal)
  history: Text (histórico do problema)
  physical_examination: Text
  weight_kg: Decimal
  temperature_celsius: Decimal
  heart_rate_bpm: Integer
  respiratory_rate: Integer
  diagnosis: String[] (texto livre no MVP; sem padronização CID — limitação que impacta relatórios de "doenças mais frequentes", previsto para revisão na Fase 2)
  differential_diagnosis: String[]
  findings: Text
  treatment_plan: Text
  prescriptions: Prescription[]
  follow_up_date: Date
  follow_up_notes: Text
  outcome: String
  complications: String
  attachments: String[] (URLs)
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp (soft delete)
}
```

### 5. Prescription (Prescrição Médica)
```
Prescription {
  id: UUID (PK)
  medical_record_id: UUID (FK - nullable quando prescrição avulsa)
  animal_id: UUID (FK)
  veterinarian_id: UUID (FK - User, obrigatório)
  medication_name: String (obrigatório)
  dosage: String (ex: "500mg")
  unit: String (mg, ml, g, etc)
  frequency: String (ex: "2x ao dia")
  duration_days: Integer
  route: ORAL | INTRAVENOUS | INTRAMUSCULAR | TOPICAL | INHALATION | RECTAL
  instructions: Text
  quantity_prescribed: Integer
  quantity_dispensed: Integer
  medicine_presentation: String (comprimido, solução, injeção, etc)
  prescribed_date: DateTime
  valid_until: DateTime
  refills_allowed: Integer
  refills_used: Integer
  pharmacy_dispensed: String
  dispensed_at: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
}
```

### 6. Vaccination (Vacinação)
```
Vaccination {
  id: UUID (PK)
  establishment_id: UUID (FK)
  animal_id: UUID (FK)
  vaccine_name: String (obrigatório)
  vaccine_code: String
  vaccinated_date: Date (obrigatório)
  veterinarian_id: UUID (FK - User)
  batch_number: String
  expiration_date: Date
  route: INTRAMUSCULAR | SUBCUTANEOUS | INTRANASAL | ORAL
  site: String (ex: "orelha esquerda")
  dosage: String
  reaction: String (nenhuma, leve, grave, etc)
  next_dose_date: Date
  notes: Text
  certificate_url: String
  created_at: Timestamp
  updated_at: Timestamp
}
```

### 7. VeterinaryExam (Exame Veterinário)
```
VeterinaryExam {
  id: UUID (PK)
  medical_record_id: UUID (FK)
  animal_id: UUID (FK)
  exam_type: BLOOD | URINE | FECES | IMAGING | ULTRASOUND | CT | MRI | ECG | OTHERS
  exam_name: String
  requested_date: DateTime
  performed_date: DateTime
  result_status: PENDING | IN_PROGRESS | COMPLETED | CANCELLED
  ordered_by_id: UUID (FK - User)
  performed_by_id: UUID (FK - User)
  lab_name: String
  result_value: String
  result_unit: String
  reference_min: String
  reference_max: String
  interpretation: String
  file_url: String
  result_pdf_url: String
  notes: Text
  created_at: Timestamp
  updated_at: Timestamp
}
```

### 8. VeterinaryProcedure (Procedimento Veterinário)
```
VeterinaryProcedure {
  id: UUID (PK)
  medical_record_id: UUID (FK)
  animal_id: UUID (FK)
  appointment_id: UUID (FK)
  procedure_name: String (obrigatório)
  procedure_code: String
  category: SURGERY | DENTAL | PREVENTIVE | THERAPEUTIC | DIAGNOSTIC | GROOMING
  start_time: DateTime
  end_time: DateTime
  performed_by_id: UUID (FK - User)
  assisted_by_id: UUID (FK - User - nullable)
  anesthesia_type: String (none, local, general, etc)
  anesthesia_agent: String
  complications: String
  result: String
  post_operative_care: Text
  restrictions: Text (ex: "não molhar por 10 dias")
  sutures_removal_date: Date
  cost: Decimal
  created_at: Timestamp
  updated_at: Timestamp
}
```

### 9. Service (Serviço)
```
Service {
  id: UUID (PK)
  establishment_id: UUID (FK)
  name: String (obrigatório)
  description: Text
  category: CONSULTATION | VACCINATION | SURGERY | DENTAL | GROOMING | BOARDING | OTHERS
  code: String (único por establishment)
  default_duration_minutes: Integer
  price: Decimal
  active: Boolean
  created_at: Timestamp
  updated_at: Timestamp
}
```

### 10. AppointmentService (Serviço do Agendamento)
```
AppointmentService {
  id: UUID (PK)
  appointment_id: UUID (FK)
  service_id: UUID (FK)
  quantity: Integer (default: 1)
  unit_price: Decimal
  discount_percentage: Decimal (default: 0)
  total_price: Decimal
  notes: String
  created_at: Timestamp
  updated_at: Timestamp
}
```

### 11. Room (Sala/Espaço de Atendimento)
```
Room {
  id: UUID (PK)
  establishment_id: UUID (FK)
  name: String (obrigatório - ex: "Sala 1", "Centro Cirúrgico")
  description: Text
  capacity: Integer (default: 1)
  active: Boolean
  created_at: Timestamp
  updated_at: Timestamp
}
```

> **Nota**: o campo `treatment_room` do `Appointment` referencia o nome ou `id` de um `Room`. Isso permite validar conflito de sala no momento do agendamento.

---

### 12. WaitingList (Fila de Espera)
```
WaitingList {
  id: UUID (PK)
  establishment_id: UUID (FK)
  animal_id: UUID (FK)
  owner_id: UUID (FK)
  veterinarian_id: UUID (FK - nullable, se sem preferência)
  appointment_type: CONSULTATION | VACCINATION | SURGERY | GROOMING | BOARDING | OTHERS
  preferred_date: Date (nullable)
  preferred_time_start: Time (nullable)
  preferred_time_end: Time (nullable)
  priority: LOW | NORMAL | HIGH | URGENT
  status: WAITING | SCHEDULED | CANCELLED | EXPIRED
  expires_at: DateTime (nullable - define quando o registro transita automaticamente para EXPIRED)
  notes: Text
  created_at: Timestamp
  updated_at: Timestamp
}
```

---

### 13. MedicationCatalog (Catálogo de Medicamentos)
```
MedicationCatalog {
  id: UUID (PK)
  establishment_id: UUID (FK - nullable para medicamentos globais)
  name: String (obrigatório)
  active_ingredient: String
  category: String (antibiótico, anti-inflamatório, analgésico, vacina, etc)
  presentations: String[] (comprimido, solução, injeção, etc)
  available_routes: String[] (ORAL, IV, IM, TOPICAL, etc)
  species_indicated: String[] (Cão, Gato, etc)
  contraindicated_species: String[] (nullable)
  standard_dosage_reference: String (referência de dosagem por espécie/peso)
  active: Boolean
  created_at: Timestamp
  updated_at: Timestamp
}
```

---

### 14. VaccineCatalog (Catálogo de Vacinas)
```
VaccineCatalog {
  id: UUID (PK)
  establishment_id: UUID (FK - nullable para vacinas globais)
  name: String (obrigatório)
  vaccine_code: String
  manufacturer: String
  species_indicated: String[]
  diseases_prevented: String[]
  recommended_dose_interval_days: Integer
  booster_required: Boolean
  route: INTRAMUSCULAR | SUBCUTANEOUS | INTRANASAL | ORAL
  active: Boolean
  created_at: Timestamp
  updated_at: Timestamp
}
```

---

### 15. Notification (Notificação)
```
Notification {
  id: UUID (PK)
  establishment_id: UUID (FK)
  recipient_user_id: UUID (FK - nullable)
  recipient_owner_id: UUID (FK - nullable)
  type: APPOINTMENT_REMINDER | APPOINTMENT_CONFIRMATION | APPOINTMENT_CANCELLATION |
        EXAM_RESULT_READY | VACCINATION_DUE | PRESCRIPTION_EXPIRING |
        FOLLOW_UP_DUE | GENERAL
  channel: EMAIL | SMS | WHATSAPP | PUSH | IN_APP
  status: PENDING | SENT | FAILED | READ
  title: String
  body: Text
  sent_at: Timestamp (nullable)
  read_at: Timestamp (nullable)
  reference_type: String (ex: "Appointment", "VeterinaryExam")
  reference_id: UUID (nullable)
  created_at: Timestamp
  updated_at: Timestamp
}
```

---

### 16. VetDocument (Documento Emitido)
```
VetDocument {
  id: UUID (PK)
  establishment_id: UUID (FK)
  animal_id: UUID (FK)
  medical_record_id: UUID (FK - nullable)
  veterinarian_id: UUID (FK)
  document_type: CLINICAL_REPORT | HEALTH_CERTIFICATE | PRESCRIPTION | VACCINATION_CERTIFICATE | REFERRAL | OTHERS
  title: String
  content: Text (conteúdo gerado)
  file_url: String (URL do PDF gerado)
  signed_by: String (nome do veterinário responsável)
  signed_at: Timestamp (nullable)
  valid_until: Date (nullable)
  issued_at: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
}
```

---

### 17. BillingRecord (Registro Simbólico de Faturamento)

> **Escopo**: Dados simbólicos de custo e receita por atendimento para fins de controle interno e relatórios gerenciais. Não inclui emissão de nota fiscal, gateway de pagamento ou módulo financeiro completo.

```
BillingRecord {
  id: UUID (PK)
  establishment_id: UUID (FK)
  appointment_id: UUID (FK)
  animal_id: UUID (FK)
  owner_id: UUID (FK)
  subtotal: Decimal (soma dos serviços)
  discount_total: Decimal (descontos aplicados)
  total_amount: Decimal (valor final)
  payment_status: UNPAID | PARTIALLY_PAID | PAID | WAIVED
  payment_method: CASH | CARD_DEBIT | CARD_CREDIT | PIX | BANK_TRANSFER | HEALTH_PLAN | OTHER (simbólico)
  amount_paid: Decimal
  amount_due: Decimal (calculado)
  notes: Text
  created_at: Timestamp
  updated_at: Timestamp
}
```

---

## ⚙️ Máquina de Estados

### Appointment.status
```
SCHEDULED ──► CONFIRMED ──► IN_PROGRESS ──► COMPLETED
     │              │              │
     └──────────────┴──────────────┴──► CANCELLED
                                   └──► NO_SHOW
```
**Transições permitidas**:
- `SCHEDULED` → `CONFIRMED` (confirmação pelo tutor ou recepcionista)
- `SCHEDULED` → `CANCELLED` (cancelamento antes da confirmação)
- `CONFIRMED` → `IN_PROGRESS` (início do atendimento pelo veterinário)
- `CONFIRMED` → `CANCELLED` (cancelamento após confirmação, requer motivo)
- `CONFIRMED` → `NO_SHOW` (paciente não compareceu)
- `IN_PROGRESS` → `COMPLETED` (atendimento finalizado com prontuário salvo)
- `IN_PROGRESS` → `CANCELLED` (situação excepcional, requer motivo e permissão elevada)

**Regra**: nenhuma transição retroativa é permitida (ex: COMPLETED → SCHEDULED).

---

### VeterinaryExam.result_status
```
PENDING ──► IN_PROGRESS ──► COMPLETED
   │                │
   └────────────────┴──► CANCELLED
```

### WaitingList.status
```
WAITING ──► SCHEDULED (quando agendamento é criado a partir da fila)
   └──► CANCELLED
   └──► EXPIRED (após prazo definido sem agendamento)
```

---

## 🔐 Permissões

### Owners (Tutores)
- `owners.create`
- `owners.read`
- `owners.update`
- `owners.delete`

### Animals (Pacientes)
- `animals.create`
- `animals.read`
- `animals.update`
- `animals.delete`
- `animals.view_history`

### Appointments (Agendamentos)
- `appointments.create`
- `appointments.read`
- `appointments.update`
- `appointments.cancel`
- `appointments.manage_status`

### Medical Records (Prontuários)
- `medical_records.create`
- `medical_records.read`
- `medical_records.update`
- `medical_records.delete` (apenas soft delete, permissão restrita)

### Prescriptions (Prescrições)
- `prescriptions.issue`
- `prescriptions.read`
- `prescriptions.update`

### Vaccinations (Vacinações)
- `vaccinations.register`
- `vaccinations.read`
- `vaccinations.update`

### Exams (Exames)
- `exams.request`
- `exams.read`
- `exams.update_result`
- `exams.cancel`

### Procedures (Procedimentos)
- `procedures.register`
- `procedures.read`
- `procedures.update`

### Services (Serviços)
- `services.create`
- `services.read`
- `services.update`
- `services.delete`

### Documents (Documentos)
- `documents.generate`
- `documents.read`
- `documents.delete`

### Rooms (Salas)
- `rooms.create`
- `rooms.read`
- `rooms.update`
- `rooms.delete`

### Notifications (Notificações)
- `notifications.create`
- `notifications.read`
- `notifications.manage`

### Billing (Faturamento Simbólico)
- `billing.read`
- `billing.update`

### Reports (Relatórios)
- `reports.view_operational`
- `reports.view_clinical`
- `reports.view_financial`
- `reports.export`

---

## 🪜 Regras de Negócio

1. Um animal só pode ter um agendamento com status `IN_PROGRESS` por vez.
2. O prontuário (`MedicalRecord`) só pode ser criado quando o agendamento associado está em status `IN_PROGRESS` ou `COMPLETED`.
3. Um veterinário só pode atender animais do seu `establishment`.
4. O cancelamento de agendamento requer motivo quando o status já for `CONFIRMED` ou superior.
5. Prontuários não podem ser deletados permanentemente — apenas soft delete, com log de auditoria obrigatório.
6. Prontuários só podem ser editados pelo veterinário autor dentro de 24h após a criação; após isso, requer permissão especial.
7. Prescrições são geradas sempre vinculadas a um prontuário e a um animal.
8. A data de vacinação não pode ser futura.
9. O sistema deve verificar alergias registradas do animal antes de confirmar uma prescrição ou vacinação (alerta, não bloqueio obrigatório).
10. Serviços são cadastrados por `establishment`; o tipo do agendamento deve ser coerente com a categoria dos serviços selecionados.
11. A sala (`Room`) deve estar disponível (sem conflito de horário) para que o agendamento seja confirmado. Registros com `deleted_at` preenchido não contam para verificação de conflito de sala ou veterinário.
12. Um tutor possui um único vínculo com cada animal (`owner_id`). Co-tutoria não é suportada no MVP.
13. O `BillingRecord` é criado automaticamente quando um agendamento é finalizado (`COMPLETED`), consolidando os serviços prestados.
14. O `payment_status` do `Appointment` e do `BillingRecord` devem ser mantidos sincronizados. A atualização deve ocorrer via service layer da aplicação: ao atualizar `BillingRecord.payment_status`, o `Appointment.payment_status` é atualizado na mesma transação, e vice-versa.
15. Catálogos de medicamentos e vacinas marcados como globais (sem `establishment_id`) são visíveis para todos os establishments; catálogos locais são visíveis apenas para o establishment que os criou.
16. Notificações de lembrete de consulta devem respeitar a preferência de canal do tutor (`notification_preference` em `Owner`).
17. Documentos gerados (`VetDocument`) ficam associados ao prontuário e só podem ser excluídos pelo veterinário autor ou por permissão elevada.
18. Ações críticas sobre prontuários, prescrições, vacinações e documentos emitidos devem ser auditadas via `AuditLog`.
19. O campo `cost` do `VeterinaryProcedure` representa custo de execução interno (insumos, tempo cirúrgico, etc.) e não é somado automaticamente ao `BillingRecord`. Custos cobráveis de procedimentos devem ser cadastrados como `Service` e vinculados via `AppointmentService`.

---

## 📱 Telas Principais

### 1. Dashboard Operacional da Clínica
- Agenda do dia (agendamentos por hora/veterinário)
- Indicadores rápidos: consultas do dia, pendentes, concluídas, cancelamentos
- Alertas: fila de espera, exames pendentes, próximas vacinações

### 2. Agenda (Calendário)
- Visualização por dia, semana ou mês
- Filtro por veterinário e sala
- Criação/edição de agendamentos diretamente no calendário
- Indicação visual de status por cor

### 3. Fila de Espera
- Lista de pacientes aguardando agendamento
- Filtro por prioridade, veterinário e tipo de atendimento
- Ação para converter em agendamento

### 4. Ficha do Tutor
- Dados cadastrais
- Lista de animais vinculados
- Histórico de atendimentos
- Notificações e preferências de contato

### 5. Ficha do Animal
- Dados do paciente (espécie, raça, idade, peso atual)
- Histórico de consultas e prontuários
- Histórico de vacinações
- Histórico de exames
- Histórico de prescrições
- Histórico de procedimentos
- Documentos emitidos

### 6. Tela de Atendimento
- Dados do animal e tutor
- Abertura/edição do prontuário ativo
- Registro de sinais vitais
- Diagnóstico e plano de tratamento
- Solicitação de exames
- Emissão de prescrição
- Registro de vacinação e procedimentos
- Finalização do atendimento

### 7. Prontuário
- Visualização completa de um atendimento
- Exames e resultados vinculados
- Prescrições emitidas
- Procedimentos realizados
- Documentos gerados

### 8. Gestão de Serviços
- Lista de serviços da clínica
- Criação/edição/ativação de serviços
- Precificação por serviço

### 9. Gestão de Salas
- Lista de salas
- Criação/edição/ativação de salas
- Ocupação por horário

### 10. Faturamento (Simbólico)
- Resumo de receita por período
- Lista de atendimentos com status de pagamento
- Edição do status de pagamento por atendimento
- Filtro por veterinário, serviço e período

### 11. Relatórios
- Relatório operacional (consultas, taxa de ocupação, no-show)
- Relatório clínico (diagnósticos, vacinas, exames)
- Relatório de faturamento simbólico (receita por período/serviço/veterinário)

---

## 📁 Política de Upload de Arquivos

### Tipos aceitos
- Imagens: `image/jpeg`, `image/png`, `image/webp` (fotos de animais, anexos de prontuário)
- Documentos: `application/pdf` (exames, receituários, atestados, certificados)

### Limites
- Foto de animal: máximo 5MB
- Anexos de prontuário e exames: máximo 20MB por arquivo
- Documentos gerados (PDF): sem limite de tamanho (gerados pelo sistema)

### Regras
- Arquivos são armazenados com URL pública protegida por token temporário (pre-signed URL ou equivalente).
- Acesso a arquivos de prontuários e exames requer autenticação e permissão no establishment.
- Arquivos vinculados a um prontuário são mantidos mesmo após soft delete do prontuário.

---

## 🛡️ LGPD e Dados Sensíveis

- Prontuários, diagnósticos, prescrições e histórico clínico do animal são considerados **dados sensíveis** e devem ser armazenados com controle de acesso granular.
- O tutor tem o direito de solicitar **exportação** do histórico clínico do animal (suportado em Fase 3).
- Prontuários não podem ser excluídos permanentemente; o prazo mínimo de retenção seguirá regulamentação aplicável (referência: CFMV).
- Todas as alterações em prontuários devem gerar entrada em `AuditLog` com `changes_before` e `changes_after`.
- Dados de identificação do tutor (CPF, email, telefone) devem ser acessíveis apenas por usuários com permissão explícita.

---

## 🎬 Fluxos Principais

### Fluxo 1: Registrar Novo Responsável/Tutor
```
1. Recepcionista clica "Novo Responsável"
2. Preenche dados: Nome, email, CPF, telefone, endereço
3. Sistema valida CPF (formato e unicidade)
4. Sistema valida email (unicidade no establishment)
5. Sistema pergunta se deseja vincular a usuário existente
6. Cria registro do responsável
7. Envia email de confirmação (opcional)
8. Responsável pode ser convidado para portal (futura integração)
```

**Validações**:
- CPF válido e único
- Email único no estabelecimento
- Telefone válido
- Endereço válido

---

### Fluxo 2: Registrar Novo Animal
```
1. Recepcionista ou owner clica "Novo Animal"
2. Seleciona responsável (owner) existente ou cria novo
3. Preenche dados: Nome, espécie, raça, cor, data nascimento, sexo, peso
4. Preenche dados opcionais: Microchip, alergias, doenças crônicas
5. Sistema calcula idade em meses
6. Upload de foto (opcional)
7. Cria registro do animal
8. Animal vinculado ao responsável
9. Mostrado no dashboard do proprietário
```

**Validações**:
- Nome obrigatório
- Espécie selecionada de lista pré-definida
- Data de nascimento não pode ser futura
- Peso deve ser número positivo

---

### Fluxo 3: Agendar Consulta
```
1. Recepcionista/Owner clica "Novo Agendamento"
2. Seleciona animal
3. Seleciona tipo de consulta (consulta, vacinação, etc)
4. Seleciona serviço(s) desejado(s)
5. Escolhe veterinário (se há múltiplos)
6. Seleciona data/hora disponível (calendario)
7. Adiciona notas específicas (optional)
8. Sistema valida disponibilidade
9. Cria agendamento
10. Envia confirmação por email/SMS/Whatsapp
11. Responsável pode confirmar agendamento (futura integração)
```

**Validações**:
- Animal ativo
- Veterinário disponível na data/hora
- Hora não pode ser passada
- Duração não conflita com outro agendamento
- Sala está disponível

---

### Fluxo 4: Atender Consulta e Criar Prontuário
```
1. Veterinário clica "Iniciar Atendimento"
2. Sistema abre tela de atendimento
3. Vet completa dados: Queixa principal, histórico, exame físico
4. Vet insere sinais vitais (peso, temperatura, FC, FR)
5. Vet adiciona diagnóstico(s) e diagnóstico diferencial
6. Vet descreve achados e plano de tratamento
7. Vet pode solicitar exames
8. Vet prescreve medicamentos (se necessário)
9. Vet adiciona observações de acompanhamento
10. Prontuário é salvo
11. Agendamento marcado como COMPLETED
12. Prontuário fica disponível no histórico do animal
```

**Validações**:
- Todos os campos obrigatórios preenchidos
- Dosagem de medicamentos válida
- Próxima consulta de acompanhamento (se necessário)

---

### Fluxo 5: Registrar Vacinação
```
1. Veterinário ou recepcionista inicia registro de vacinação
2. Seleciona animal e vacinadora
3. Seleciona vacina de lista pré-definida
4. Insere data de vacinação
5. Insere dados: Lote, data de expiração, local aplicação
6. Verifica para reações adversas
7. Define data próxima dose (se houver)
8. Salva registro
9. Sistema atualiza histórico de vacinação do animal
10. Certificado pode ser gerado/impresso
```

**Validações**:
- Animal ativo e sem alergia registrada à vacina
- Data de vacinação não pode ser futura
- Lote válido e dentro da validade
- Veterinário autorizado a vacinar

---

### Fluxo 6: Solicitar Exame
```
1. Veterinário clica "Solicitar Exame" durante atendimento
2. Seleciona tipo de exame (sangue, urina, imagem, etc)
3. Especifica quais análises deseja
4. Adiciona observações clínicas
5. Seleciona laboratorio/clínica de imagem (se integrado)
6. Define urgência
7. Sistema gera número de requisição
8. Exame é associado ao prontuário
9. Status começa como PENDING
10. Notificação enviada ao laboratório (se integração disponível)
```

**Validações**:
- Animal identificado
- Tipo de exame válido
- Observações clínicas suficientes

---

### Fluxo 7: Registrar Resultado de Exame
```
1. Recepcionista ou vet clica "Registrar Resultado"
2. Busca exame pendente
3. Insere data de realização
4. Insere resultados (valor e unidade)
5. Insere interpretação (normal, anormal, crítico)
6. Upload de arquivo (PDF, imagem)
7. Salva resultado
8. Status muda para COMPLETED
9. Notificação enviada ao veterinário responsável
10. Resultado fica visível no prontuário
```

**Validações**:
- Exame existe e está pendente
- Valores válidos para tipo de exame
- Arquivo em formato aceito

---

### Fluxo 8: Prescrever Medicamento
```
1. Veterinário clica "Nova Prescrição"
2. Seleciona medicamento de lista pré-definida OU insere novo
3. Insere dose e unidade
4. Insere frequência e duração
5. Insere via de administração
6. Adiciona instruções especiais
7. Define quantidade dispensada/prescrita
8. Define data validade prescrição
9. Salva prescrição
10. Prescrição vinculada ao prontuário e animal
11. Recepcionista pode dispensar medicamento da clínica (se houver)
12. Proprietário recebe cópia (email ou impressa)
```

**Validações**:
- Medicamento existe ou novo formato válido
- Dosagem adequada para espécie/peso
- Frequência e duração fazem sentido
- Verificação de interações (se integrado a base de dados)

---

### Fluxo 9: Realizar Procedimento/Cirurgia
```
1. Vet clica "Novo Procedimento" durante agendamento cirúrgico
2. Seleciona tipo de procedimento (cirurgia, dental, etc)
3. Insere nome específico do procedimento
4. Define anestesia (tipo, agente)
5. Registra profissionais (principal + assistentes)
6. Inicia cronômetro do procedimento
7. Registra qualquer complicação surgida
8. Finaliza procedimento (encerra cronômetro)
9. Insere resultado e observações pós-operatórias
10. Define restrições/cuidados pós-operatórios
11. Define data remoção de pontos (se aplicável)
12. Salva procedimento
13. Proprietário recebe instruções pós-operatórias
```

**Validações**:
- Agendamento é de tipo apropriado
- Duração estimada é adequada
- Anestesia autorizada para espécie
- Profissionais habilitados

---

### Fluxo 10: Gerar Relatório/Atestado
```
1. Vet clica "Gerar Documento"
2. Seleciona tipo: Relatório clínico, Atestado saúde, Receituário, Certificado vacinal
3. Sistema preenche dados automáticos
4. Vet revisa e adiciona texto personalizado (se necessário)
5. Define assinatura digital (se sistema suporta)
6. Gera PDF
7. Envia para email ou entrega impressa
8. Documento salvo no prontuário
9. Proprietário pode baixar do portal (futura integração)
```

**Validações**:
- Animal identificado
- Vet tem permissão para gerar documento
- Dados do prontuário consistentes

---

### Fluxo 11: Registrar Faturamento Simbólico
```
1. Atendimento é finalizado (status COMPLETED)
2. Sistema cria automaticamente um BillingRecord com os serviços do AppointmentService
3. Sistema calcula subtotal, descontos e total_amount
4. Recepcionista revisa e confirma valores
5. Recepcionista registra método de pagamento simbólico (cash, pix, cartão, etc)
6. Atualiza amount_paid e payment_status (UNPAID, PARTIALLY_PAID ou PAID)
7. Registro fica disponível nos relatórios financeiros simbólicos
```

**Validações**:
- Agendamento deve estar com status COMPLETED
- total_amount deve ser maior ou igual a zero
- payment_method obrigatório se payment_status for PAID ou PARTIALLY_PAID

> **Nota**: Este fluxo não inclui emissão de nota fiscal, integração com gateway de pagamento ou conciliação bancária. É um registro de controle interno.

---

## 📱 Casos de Uso

### UC-CL-001: Recepcionista
1. Registrar novo responsável/tutor
2. Registrar novo animal
3. Agendar consultas
4. Confirmar/cancelar agendamentos
5. Registrar chegada do paciente
6. Registrar pagamento simbólico (método e status)
7. Emitir comprovante simples (PDF gerado pelo sistema)
8. Enviar lembretes de agendamento
9. Gerenciar fila de espera

### UC-CL-002: Veterinário
1. Visualizar agenda de atendimentos
2. Iniciar atendimento/prontuário
3. Completar avaliação clínica
4. Solicitar exames
5. Prescrever medicamentos
6. Registrar vacinações
7. Realizar procedimentos/cirurgias
8. Gerar relatórios médicos
9. Acompanhar evolução clínica
10. Visualizar histórico completo do animal

### UC-CL-003: Dono do Animal
1. Visualizar informações do animal
2. Visualizar histórico de atendimentos
3. Visualizar prontuários
4. Agendar consultas (futura integração)
5. Confirmar agendamentos
6. Receber lembretes
7. Baixar atestados/certificados
8. Comunicar com clínica

### UC-CL-004: Administrador da Clínica
1. Visualizar agenda consolidada
2. Visualizar receita do dia/mês
3. Gerar relatórios de atendimento
4. Gerenciar fila de espera
5. Distribuir atendimentos entre veterinários
6. Visualizar taxa de ocupação

---

## 📈 Métricas e KPIs

### Operacionais
- Consultas realizadas por período
- Taxa de ocupação da agenda
- Tempo médio de consulta
- Taxa de no-show
- Receita por consulta
- Receita por veterinário

### Clínicas
- Doenças mais frequentes
- Taxa de sucesso por diagnóstico
- Medicamentos mais prescritos
- Taxa de vacinação
- Animais novos por período

### Comerciais
- Receita total por período
- Receita por tipo de serviço
- Ticket médio
- Cliente de maior receita
- Retenção de clientes

---

## 🗺️ Roadmap

### Fase 1 (Atual)
- ✅ Estrutura de dados
- [ ] APIs de animals CRUD
- [ ] APIs de owners CRUD
- [ ] APIs de appointments CRUD
- [ ] APIs de rooms CRUD
- [ ] APIs de medical records (prontuário)
- [ ] APIs de services CRUD
- [ ] Catálogos de medicamentos e vacinas (base)
- [ ] Faturamento simbólico (BillingRecord)
- [ ] Dashboard básico
- [ ] Tela de atendimento

### Fase 2
- [ ] Prescrições e medicamentos (catálogo completo)
- [ ] Vacinações (catálogo completo)
- [ ] Exames e resultados
- [ ] Procedimentos/Cirurgias
- [ ] Fila de espera (WaitingList)
- [ ] Documentos emitidos (VetDocument)
- [ ] Notificações básicas (EMAIL/SMS)
- [ ] Relatórios operacionais e financeiros simbólicos
- [ ] Integração com laboratórios

### Fase 3
- [ ] Portal do cliente (web)
- [ ] App mobile para clientes
- [ ] Lembretes automáticos avançados (SMS/Email/WhatsApp)
- [ ] Chat com clínica
- [ ] Agendamento online pelo cliente
- [ ] Exportação de histórico clínico (LGPD)
- [ ] Integração com gateway de pagamento (módulo financeiro completo)

### Fase 4
- [ ] IA para sugestão de diagnóstico
- [ ] Analytics avançado
- [ ] Integração com CRMV
- [ ] Telemedicina veterinária
- [ ] API pública para integrações

---

## ✅ Critérios de Aceitação

- [ ] Todas as APIs testadas com sucesso
- [ ] Testes unitários com 80%+ cobertura
- [ ] Testes de integração implementados
- [ ] Documentação completa (Swagger/OpenAPI)
- [ ] Manual do usuário (Vet, Recepcionista, Admin)
- [ ] Nenhuma vulnerabilidade crítica
- [ ] Performance: <200ms para 95% das requisições
- [ ] Dados sensíveis (prontuários) com controle de acesso granular
- [ ] Auditoria de ações críticas sobre prontuários e prescrições
- [ ] Conformidade com regulamentações de dados de saúde (LGPD/CFMV)
- [ ] Máquina de estados de agendamento respeitada nas APIs
- [ ] Permissões por perfil validadas em todos os endpoints
- [ ] Upload de arquivos com validação de tipo e tamanho
- [ ] Catálogos de medicamentos e vacinas funcionais
- [ ] BillingRecord gerado automaticamente ao finalizar atendimento

---

**Versão**: 1.1 | **Última atualização**: 2026-04-28 | **Status**: Em Desenvolvimento
