import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { InvitationStatus } from '../../../common/enums';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Establishment } from './establishment.entity';
import { Role } from '../../auth/entities/role.entity';
import { User } from '../../users/entities/user.entity';

@Entity('invitations')
export class Invitation extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 100 })
  token: string;

  @Column({ length: 255 })
  email: string;

  @Column({ name: 'workspace_id', type: 'varchar', length: 36 })
  workspaceId: string;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column({ name: 'establishment_id', type: 'varchar', length: 36, nullable: true })
  establishmentId: string | null;

  @ManyToOne(() => Establishment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'establishment_id' })
  establishment: Establishment | null;

  @Column({ name: 'role_id', type: 'varchar', length: 36 })
  roleId: string;

  @ManyToOne(() => Role, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'invited_by_id', type: 'varchar', length: 36 })
  invitedById: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'invited_by_id' })
  invitedBy: User;

  @Column({ type: 'enum', enum: InvitationStatus, default: InvitationStatus.PENDING })
  status: InvitationStatus;

  @Column({ name: 'expires_at', type: 'datetime' })
  expiresAt: Date;
}
