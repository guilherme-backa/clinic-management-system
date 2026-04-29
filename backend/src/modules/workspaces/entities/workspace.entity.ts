import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { WorkspaceStatus, WorkspacePlan } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';

@Entity('workspaces')
export class Workspace extends BaseEntity {
  @Column({ length: 150 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 80 })
  slug: string;

  @Column({ name: 'owner_id', type: 'varchar', length: 36 })
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'enum', enum: WorkspaceStatus, default: WorkspaceStatus.ACTIVE })
  status: WorkspaceStatus;

  @Column({ type: 'enum', enum: WorkspacePlan, default: WorkspacePlan.FREE })
  plan: WorkspacePlan;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string | null;
}
