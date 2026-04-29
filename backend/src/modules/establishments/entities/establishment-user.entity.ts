import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Establishment } from './establishment.entity';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../auth/entities/role.entity';

@Entity('establishment_users')
@Unique(['establishmentId', 'userId'])
export class EstablishmentUser extends BaseEntity {
  @Column({ name: 'establishment_id', type: 'varchar', length: 36 })
  establishmentId: string;

  @ManyToOne(() => Establishment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'establishment_id' })
  establishment: Establishment;

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
