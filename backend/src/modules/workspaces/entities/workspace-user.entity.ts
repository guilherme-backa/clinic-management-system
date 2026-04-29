import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Workspace } from './workspace.entity';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../auth/entities/role.entity';

@Entity('workspace_users')
@Unique(['workspaceId', 'userId'])
export class WorkspaceUser extends BaseEntity {
  @Column({ name: 'workspace_id', type: 'varchar', length: 36 })
  workspaceId: string;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'role_id', type: 'varchar', length: 36 })
  roleId: string;

  @ManyToOne(() => Role, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
