export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export enum WorkspaceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum WorkspacePlan {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
}

export enum EstablishmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum RoleType {
  SUPER_ADMIN = 'super_admin',
  WORKSPACE_OWNER = 'workspace_owner',
  ESTABLISHMENT_OWNER = 'establishment_owner',
  WORKSPACE_ADMIN = 'workspace_admin',
  ESTABLISHMENT_ADMIN = 'establishment_admin',
  VETERINARIAN = 'veterinarian',
  RECEPTIONIST = 'receptionist',
  STAFF = 'staff',
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export enum SessionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export enum AnimalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DECEASED = 'deceased',
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  RETURN = 'return',
  VACCINATION = 'vaccination',
  EXAM = 'exam',
  PROCEDURE = 'procedure',
  SURGERY = 'surgery',
  EMERGENCY = 'emergency',
}
