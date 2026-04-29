import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EstablishmentStatus } from '../../../common/enums';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity('establishments')
export class Establishment extends BaseEntity {
  @Column({ name: 'workspace_id', type: 'varchar', length: 36 })
  workspaceId: string;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 20, nullable: true })
  phone: string | null;

  @Index()
  @Column({ length: 255, nullable: true })
  email: string | null;

  @Column({ length: 18, nullable: true })
  cnpj: string | null;

  @Column({ type: 'json', nullable: true })
  address: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  } | null;

  @Column({ type: 'enum', enum: EstablishmentStatus, default: EstablishmentStatus.ACTIVE })
  status: EstablishmentStatus;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string | null;
}
