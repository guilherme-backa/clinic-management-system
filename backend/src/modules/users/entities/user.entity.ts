import { Entity, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserStatus } from '../../../common/enums';

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Column({ length: 11, nullable: true })
  cpf: string | null;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'birthdate', type: 'date', nullable: true })
  birthdate: Date | null;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ name: 'two_factor_enabled', default: false })
  twoFactorEnabled: boolean;

  @Column({ name: 'two_factor_secret', nullable: true, select: false })
  twoFactorSecret: string | null;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }
}
