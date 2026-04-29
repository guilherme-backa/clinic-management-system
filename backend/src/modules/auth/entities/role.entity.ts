import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RoleType } from '../../../common/enums';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 60 })
  slug: string;

  @Column({ type: 'enum', enum: RoleType })
  type: RoleType;

  @Column({ type: 'json', nullable: true })
  permissions: string[] | null;

  @Column({ name: 'is_system', default: false })
  isSystem: boolean;

  @Column({ name: 'workspace_id', type: 'varchar', length: 36, nullable: true })
  workspaceId: string | null;
}
