# Arquitetura de Banco de Dados

**Versão**: 1.0 | **Data**: 2026-04-28 | **Database**: PostgreSQL 14+

---

## 📊 Diagrama de Entidades

```
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA DE SISTEMA                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │  Workspace   │◄─────┤  Establishment                      │
│  │              │      │              │                     │
│  │ - id (PK)    │      │ - id (PK)    │                     │
│  │ - name       │      │ - name       │                     │
│  │ - owner_id   │      │ - workspace  │                     │
│  │ - status     │      │ - phone      │                     │
│  │ - plan       │      │ - email      │                     │
│  └──────────────┘      │ - cnpj       │                     │
│         ▲              └──────────────┘                     │
│         │                     ▲                             │
│         │                     │                             │
│  ┌──────┴──────┐         ┌────┴────────┐                   │
│  │   Workspace │         │Establishment│                   │
│  │    User     │         │    User     │                   │
│  │             │         │             │                   │
│  │ - ws_id(FK) │         │ - est_id(FK)                    │
│  │ - user_id   │         │ - user_id   │                   │
│  │ - role_id   │         │ - role_id   │                   │
│  └─────────────┘         └─────────────┘                   │
│         ▲                     ▲                             │
│         │                     │                             │
│         └──────────┬──────────┘                            │
│                    │                                       │
│              ┌─────┴────────┐                             │
│              │    User      │                             │
│              │              │                             │
│              │ - id (PK)    │                             │
│              │ - email      │                             │
│              │ - cpf        │                             │
│              │ - password   │                             │
│              │ - 2fa_*      │                             │
│              └──────────────┘                             │
│                                                            │
│  ┌──────────────┐      ┌──────────────┐                  │
│  │     Role     │      │ Invitation   │                  │
│  │              │      │              │                  │
│  │ - id (PK)    │      │ - id (PK)    │                  │
│  │ - name       │      │ - token      │                  │
│  │ - slug       │      │ - email      │                  │
│  │ - type       │      │ - role_id    │                  │
│  │ - permissions       │ - status     │                  │
│  └──────────────┘      └──────────────┘                  │
│                                                            │
│  ┌──────────────────┐   ┌──────────────────┐             │
│  │    AuditLog      │   │      Session     │             │
│  │                  │   │                  │             │
│  │ - id (PK)        │   │ - id (PK)        │             │
│  │ - workspace_id   │   │ - user_id        │             │
│  │ - user_id        │   │ - workspace_id   │             │
│  │ - action         │   │ - access_token   │             │
│  │ - resource_type  │   │ - refresh_token  │             │
│  │ - changes_*      │   │ - expires_at     │             │
│  └──────────────────┘   └──────────────────┘             │
│                                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   CAMADA DE CLÍNICA VETERINÁRIA             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │    Owner     │◄─────┤    Animal    │                    │
│  │              │      │              │                    │
│  │ - id (PK)    │      │ - id (PK)    │                    │
│  │ - est_id(FK) │      │ - est_id(FK) │                    │
│  │ - first_name │      │ - owner_id   │                    │
│  │ - cpf        │      │ - name       │                    │
│  │ - phone      │      │ - species    │                    │
│  │ - email      │      │ - breed      │                    │
│  │ - address    │      │ - birthdate  │                    │
│  └──────────────┘      │ - weight_kg  │                    │
│         ▲              │ - status     │                    │
│         │              └──────────────┘                    │
│         │                     ▲                            │
│         │                     │                            │
│         └─────────────────────┘                            │
│                                                             │
│  ┌──────────────────┐   ┌──��───────────┐                  │
│  │   Appointment    │   │  MedicalRecord                   │
│  │                  │   │              │                  │
│  │ - id (PK)        │   │ - id (PK)    │                  │
│  │ - est_id(FK)     │   │ - appt_id(FK)                   │
│  │ - animal_id      │   │ - animal_id  │                  │
│  │ - owner_id       │   │ - vet_id     │                  │
│  │ - vet_id         │───┤ - visit_date │                  │
│  │ - scheduled_*    │   │ - complaint  │                  │
│  │ - type           │   │ - diagnosis  │                  │
│  │ - status         │   │ - treatment  │                  │
│  │ - payment_*      │   │ - findings   │                  │
│  └──────────────────┘   └──────────────┘                  │
│         ▲                     ▲                            │
│         │                     │                            │
│  ┌──────┴────────┐       ┌────┴──────────┐               │
│  │AppointmentService     │ Prescription  │               │
│  │                │      │              │               │
│  │ - id (PK)     │      │ - id (PK)    │               │
│  │ - appt_id(FK) │      │ - rec_id(FK) │               │
│  │ - service_id  │      │ - animal_id  │               │
│  │ - quantity    │      │ - medication │               │
│  │ - price       │      │ - dosage     │               │
│  └────────────────┘      │ - frequency  │               │
│                          │ - route      │               │
│  ┌──────────────┐        │ - duration   │               │
│  │  Vaccination │        └──────────────┘               │
│  │              │               ▲                       │
│  │ - id (PK)    │               │                       │
│  │ - est_id(FK) │        ┌──────┴──────────┐           │
│  │ - animal_id  │        │PharmacyDispensingRecord    │
│  │ - vaccine    │        │                │           │
│  │ - batch_no   │        │ - id (PK)      │           │
│  │ - date       │        │ - presc_id(FK) │           │
│  │ - next_dose  │        │ - date         │           │
│  └──────────────┘        │ - quantity     │           │
│         ▲                 │ - price        │           │
│         │                 └────────────────┘           │
│  ┌──────┴──────────┐                                   │
│  │VeterinaryExam   │    ┌──────────────┐              │
│  │                 │    │ Service      │              │
│  │ - id (PK)       │    │              │              │
│  │ - rec_id(FK)    │    │ - id (PK)    │              │
│  │ - animal_id     │    │ - est_id(FK) │              │
│  │ - exam_type     │    │ - name       │              │
│  │ - result_*      │    │ - price      │              │
│  │ - file_url      │    │ - category   │              │
│  └──────────────────┘    └──────────────┘              │
│                                                         │
│  ┌──────────────────┐                                  │
│  │VeterinaryProcedure                                 │
│  │                  │                                  │
│  │ - id (PK)        │                                  │
│  │ - rec_id(FK)     │                                  │
│  │ - appt_id(FK)    │                                  │
│  │ - animal_id      │                                  │
│  │ - proc_name      │                                  │
│  │ - vet_id         │                                  │
│  │ - assistant_id   │                                  │
│  │ - anesthesia_*   │                                  │
│  │ - duration       │                                  │
│  │ - result         │                                  │
│  └──────────────────┘                                  │
│                                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Tabelas do Sistema

### 1. workspaces
```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id),
  logo_url VARCHAR(500),
  website VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  plan VARCHAR(50) NOT NULL DEFAULT 'FREE',
  settings JSONB DEFAULT '{}',
  max_establishments INTEGER DEFAULT 5,
  current_establishments INTEGER DEFAULT 0,
  max_users INTEGER DEFAULT 50,
  current_users INTEGER DEFAULT 0,
  storage_gb INTEGER DEFAULT 10,
  used_storage_gb INTEGER DEFAULT 0,
  subscription_plan VARCHAR(50) DEFAULT 'FREE',
  billing_cycle_start DATE,
  billing_cycle_end DATE,
  payment_method VARCHAR(50),
  invoice_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX idx_workspaces_status ON workspaces(status);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);
```

### 2. establishments
```sql
CREATE TABLE establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  cnpj VARCHAR(18) UNIQUE,
  inscricao_estadual VARCHAR(20),
  razao_social VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  opening_date DATE,
  closing_date DATE,
  operating_hours JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  number_of_rooms INTEGER,
  number_of_vets INTEGER,
  number_of_staff INTEGER,
  logo_url VARCHAR(500),
  photo_url VARCHAR(500),
  address_street VARCHAR(255),
  address_number VARCHAR(20),
  address_complement VARCHAR(255),
  address_neighborhood VARCHAR(100),
  address_city VARCHAR(100),
  address_state VARCHAR(2),
  address_postal_code VARCHAR(10),
  address_country VARCHAR(100) DEFAULT 'Brasil',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE(workspace_id, slug)
);

CREATE INDEX idx_establishments_workspace_id ON establishments(workspace_id);
CREATE INDEX idx_establishments_cnpj ON establishments(cnpj);
CREATE INDEX idx_establishments_status ON establishments(status);
```

### 3. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  phone VARCHAR(20),
  birthdate DATE,
  gender VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  password_changed_at TIMESTAMP NULL,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_method VARCHAR(50),
  two_factor_secret VARCHAR(255),
  two_factor_backup_codes TEXT[],
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  last_login_at TIMESTAMP NULL,
  last_login_ip VARCHAR(45),
  professional_license_number VARCHAR(50),
  license_expiration_date DATE,
  specialties TEXT[],
  notification_email BOOLEAN DEFAULT true,
  notification_sms BOOLEAN DEFAULT false,
  notification_push BOOLEAN DEFAULT false,
  preferred_notification_method VARCHAR(50),
  settings JSONB DEFAULT '{}',
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_users_status ON users(status);
```

### 4. workspace_users
```sql
CREATE TABLE workspace_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  additional_permissions TEXT[],
  denied_permissions TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_workspace_users_workspace_id ON workspace_users(workspace_id);
CREATE INDEX idx_workspace_users_user_id ON workspace_users(user_id);
CREATE INDEX idx_workspace_users_role_id ON workspace_users(role_id);
```

### 5. establishment_users
```sql
CREATE TABLE establishment_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id),
  workspace_user_id UUID NOT NULL REFERENCES workspace_users(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  additional_permissions TEXT[],
  denied_permissions TEXT[],
  assigned_by_id UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE(establishment_id, user_id)
);

CREATE INDEX idx_establishment_users_establishment_id ON establishment_users(establishment_id);
CREATE INDEX idx_establishment_users_user_id ON establishment_users(user_id);
CREATE INDEX idx_establishment_users_role_id ON establishment_users(role_id);
```

### 6. roles
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'CUSTOM',
  permissions TEXT[] NOT NULL,
  is_system_role BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE(workspace_id, slug)
);

CREATE INDEX idx_roles_workspace_id ON roles(workspace_id);
CREATE INDEX idx_roles_type ON roles(type);
```

### 7. invitations
```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  workspace_id UUID REFERENCES workspaces(id),
  establishment_id UUID REFERENCES establishments(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  invited_by_id UUID NOT NULL REFERENCES users(id),
  accepted_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP NULL,
  UNIQUE(email, workspace_id)
);

CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_status ON invitations(status);
```

### 8. audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  establishment_id UUID REFERENCES establishments(id),
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  changes_before JSONB,
  changes_after JSONB,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  severity VARCHAR(50) DEFAULT 'INFO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_workspace_id ON audit_logs(workspace_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 9. sessions
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  access_token VARCHAR(500) NOT NULL,
  refresh_token VARCHAR(500) NOT NULL UNIQUE,
  token_expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_info JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_workspace_id ON sessions(workspace_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

---

## 📋 Tabelas de Clínica Veterinária

### 10. owners
```sql
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id),
  user_id UUID REFERENCES users(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  cpf VARCHAR(11) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  phone_secondary VARCHAR(20),
  birthdate DATE,
  gender VARCHAR(50),
  document_type VARCHAR(50) DEFAULT 'CPF',
  document_number VARCHAR(50),
  marital_status VARCHAR(50),
  profession VARCHAR(100),
  preferred_contact VARCHAR(50) DEFAULT 'PHONE',
  notification_preference VARCHAR(50) DEFAULT 'EMAIL',
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  notes TEXT,
  address_street VARCHAR(255),
  address_number VARCHAR(20),
  address_complement VARCHAR(255),
  address_neighborhood VARCHAR(100),
  address_city VARCHAR(100),
  address_state VARCHAR(2),
  address_postal_code VARCHAR(10),
  address_country VARCHAR(100) DEFAULT 'Brasil',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_owners_establishment_id ON owners(establishment_id);
CREATE INDEX idx_owners_cpf ON owners(cpf);
CREATE INDEX idx_owners_email ON owners(email);
```

### 11. animals
```sql
CREATE TABLE animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id),
  owner_id UUID NOT NULL REFERENCES owners(id),
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  breed VARCHAR(100),
  color VARCHAR(100),
  size VARCHAR(50),
  birthdate DATE,
  age_months INTEGER,
  weight_kg DECIMAL(5,2),
  microchip_id VARCHAR(50) UNIQUE,
  registration_number VARCHAR(100),
  gender VARCHAR(50),
  castrated BOOLEAN DEFAULT false,
  castration_date DATE,
  blood_type VARCHAR(20),
  allergies TEXT[],
  chronic_diseases TEXT[],
  medications TEXT[],
  vaccination_status TEXT[],
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  photo_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_animals_establishment_id ON animals(establishment_id);
CREATE INDEX idx_animals_owner_id ON animals(owner_id);
CREATE INDEX idx_animals_microchip_id ON animals(microchip_id);
CREATE INDEX idx_animals_status ON animals(status);
```

### 12. appointments
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id),
  animal_id UUID NOT NULL REFERENCES animals(id),
  owner_id UUID NOT NULL REFERENCES owners(id),
  veterinarian_id UUID NOT NULL REFERENCES users(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  appointment_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
  cancellation_reason TEXT,
  cancelled_by_id UUID REFERENCES users(id),
  cancelled_at TIMESTAMP NULL,
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMP NULL,
  reminder_method VARCHAR(50),
  notes TEXT,
  payment_status VARCHAR(50) DEFAULT 'UNPAID',
  treatment_room VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_appointments_establishment_id ON appointments(establishment_id);
CREATE INDEX idx_appointments_animal_id ON appointments(animal_id);
CREATE INDEX idx_appointments_veterinarian_id ON appointments(veterinarian_id);
CREATE INDEX idx_appointments_scheduled_date ON appointments(scheduled_date);
CREATE INDEX idx_appointments_status ON appointments(status);
```

### 13. medical_records
```sql
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id),
  appointment_id UUID REFERENCES appointments(id),
  animal_id UUID NOT NULL REFERENCES animals(id),
  veterinarian_id UUID NOT NULL REFERENCES users(id),
  visit_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  chief_complaint TEXT NOT NULL,
  history TEXT,
  physical_examination TEXT,
  weight_kg DECIMAL(5,2),
  temperature_celsius DECIMAL(4,1),
  heart_rate_bpm INTEGER,
  respiratory_rate INTEGER,
  diagnosis TEXT[],
  differential_diagnosis TEXT[],
  findings TEXT,
  treatment_plan TEXT,
  follow_up_date DATE,
  follow_up_notes TEXT,
  outcome VARCHAR(255),
  complications TEXT,
  attachments TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_medical_records_establishment_id ON medical_records(establishment_id);
CREATE INDEX idx_medical_records_animal_id ON medical_records(animal_id);
CREATE INDEX idx_medical_records_veterinarian_id ON medical_records(veterinarian_id);
CREATE INDEX idx_medical_records_visit_date ON medical_records(visit_date);
```

### 14. prescriptions
```sql
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID NOT NULL REFERENCES medical_records(id),
  animal_id UUID NOT NULL REFERENCES animals(id),
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  unit VARCHAR(50),
  frequency VARCHAR(100),
  duration_days INTEGER,
  route VARCHAR(50),
  instructions TEXT,
  quantity_prescribed INTEGER,
  quantity_dispensed INTEGER,
  medicine_presentation VARCHAR(100),
  prescribed_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMP,
  refills_allowed INTEGER DEFAULT 0,
  refills_used INTEGER DEFAULT 0,
  pharmacy_dispensed VARCHAR(255),
  dispensed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prescriptions_medical_record_id ON prescriptions(medical_record_id);
CREATE INDEX idx_prescriptions_animal_id ON prescriptions(animal_id);
```

### 15. vaccinations
```sql
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id),
  animal_id UUID NOT NULL REFERENCES animals(id),
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_code VARCHAR(50),
  vaccinated_date DATE NOT NULL,
  veterinarian_id UUID NOT NULL REFERENCES users(id),
  batch_number VARCHAR(100),
  expiration_date DATE,
  route VARCHAR(50),
  site VARCHAR(100),
  dosage VARCHAR(100),
  reaction VARCHAR(255),
  next_dose_date DATE,
  notes TEXT,
  certificate_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vaccinations_establishment_id ON vaccinations(establishment_id);
CREATE INDEX idx_vaccinations_animal_id ON vaccinations(animal_id);
CREATE INDEX idx_vaccinations_vaccinated_date ON vaccinations(vaccinated_date);
```

### 16. veterinary_exams
```sql
CREATE TABLE veterinary_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID NOT NULL REFERENCES medical_records(id),
  animal_id UUID NOT NULL REFERENCES animals(id),
  exam_type VARCHAR(50) NOT NULL,
  exam_name VARCHAR(255),
  requested_date TIMESTAMP,
  performed_date TIMESTAMP,
  result_status VARCHAR(50) DEFAULT 'PENDING',
  ordered_by_id UUID REFERENCES users(id),
  performed_by_id UUID REFERENCES users(id),
  lab_name VARCHAR(255),
  result_value VARCHAR(255),
  result_unit VARCHAR(50),
  reference_min VARCHAR(50),
  reference_max VARCHAR(50),
  interpretation TEXT,
  file_url VARCHAR(500),
  result_pdf_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_veterinary_exams_medical_record_id ON veterinary_exams(medical_record_id);
CREATE INDEX idx_veterinary_exams_animal_id ON veterinary_exams(animal_id);
CREATE INDEX idx_veterinary_exams_result_status ON veterinary_exams(result_status);
```

### 17. veterinary_procedures
```sql
CREATE TABLE veterinary_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID NOT NULL REFERENCES medical_records(id),
  animal_id UUID NOT NULL REFERENCES animals(id),
  appointment_id UUID REFERENCES appointments(id),
  procedure_name VARCHAR(255) NOT NULL,
  procedure_code VARCHAR(100),
  category VARCHAR(50) NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  performed_by_id UUID NOT NULL REFERENCES users(id),
  assisted_by_id UUID REFERENCES users(id),
  anesthesia_type VARCHAR(100),
  anesthesia_agent VARCHAR(100),
  complications TEXT,
  result TEXT,
  post_operative_care TEXT,
  restrictions TEXT,
  sutures_removal_date DATE,
  cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_veterinary_procedures_medical_record_id ON veterinary_procedures(medical_record_id);
CREATE INDEX idx_veterinary_procedures_animal_id ON veterinary_procedures(animal_id);
CREATE INDEX idx_veterinary_procedures_performed_by_id ON veterinary_procedures(performed_by_id);
```

### 18. services
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  code VARCHAR(50) UNIQUE,
  default_duration_minutes INTEGER,
  price DECIMAL(10,2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_establishment_id ON services(establishment_id);
CREATE INDEX idx_services_category ON services(category);
```

### 19. appointment_services
```sql
CREATE TABLE appointment_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id),
  service_id UUID NOT NULL REFERENCES services(id),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  total_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointment_services_appointment_id ON appointment_services(appointment_id);
CREATE INDEX idx_appointment_services_service_id ON appointment_services(service_id);
```

---

## 🔐 Segurança

### Constraints de Segurança
```sql
-- Prevent circular workspace ownership
ALTER TABLE workspaces ADD CONSTRAINT chk_owner_is_user 
  CHECK (owner_id IS NOT NULL);

-- Prevent appointments in the past
ALTER TABLE appointments ADD CONSTRAINT chk_future_appointment 
  CHECK (scheduled_date >= CURRENT_DATE);

-- Prevent invalid birthdates
ALTER TABLE animals ADD CONSTRAINT chk_valid_birthdate 
  CHECK (birthdate <= CURRENT_DATE);

ALTER TABLE users ADD CONSTRAINT chk_valid_birthdate_user 
  CHECK (birthdate <= CURRENT_DATE);

-- Prevent negative weights
ALTER TABLE animals ADD CONSTRAINT chk_positive_weight 
  CHECK (weight_kg > 0);

ALTER TABLE medical_records ADD CONSTRAINT chk_positive_weight_record 
  CHECK (weight_kg > 0);
```

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE veterinary_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE veterinary_procedures ENABLE ROW LEVEL SECURITY;

-- Example: Animals should only be visible within their establishment
CREATE POLICY animals_isolation ON animals
  USING (establishment_id IN (
    SELECT establishment_id FROM establishment_users 
    WHERE user_id = current_user_id()
  ));
```

---

## 📈 Índices de Performance

```sql
-- Composite indexes para queries comuns
CREATE INDEX idx_appointments_vet_date 
  ON appointments(veterinarian_id, scheduled_date, status);

CREATE INDEX idx_medical_records_animal_date 
  ON medical_records(animal_id, visit_date DESC);

CREATE INDEX idx_vaccinations_animal_date 
  ON vaccinations(animal_id, vaccinated_date DESC);

CREATE INDEX idx_audit_logs_workspace_date 
  ON audit_logs(workspace_id, created_at DESC);

CREATE INDEX idx_sessions_user_active 
  ON sessions(user_id, status) WHERE status = 'ACTIVE';
```

---

## 🔄 Triggers e Functions

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate animal age in months
CREATE OR REPLACE FUNCTION calculate_animal_age()
RETURNS TRIGGER AS $$
BEGIN
  NEW.age_months := EXTRACT(YEAR FROM age(CURRENT_DATE, NEW.birthdate)) * 12 
    + EXTRACT(MONTH FROM age(CURRENT_DATE, NEW.birthdate));
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_animal_age BEFORE INSERT OR UPDATE ON animals
  FOR EACH ROW EXECUTE FUNCTION calculate_animal_age();
```

---

**Versão**: 1.0 | **Última atualização**: 2026-04-28
