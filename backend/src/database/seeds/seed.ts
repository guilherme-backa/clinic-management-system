import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/auth/entities/role.entity';
import { Workspace } from '../../modules/workspaces/entities/workspace.entity';
import { WorkspaceUser } from '../../modules/workspaces/entities/workspace-user.entity';
import { Session } from '../../modules/auth/entities/session.entity';
import { Establishment } from '../../modules/establishments/entities/establishment.entity';
import { EstablishmentUser } from '../../modules/establishments/entities/establishment-user.entity';
import { Invitation } from '../../modules/establishments/entities/invitation.entity';
import { UserStatus, RoleType } from '../../common/enums';

const ds = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'clinic',
  password: process.env.DB_PASSWORD ?? 'clinic_pass',
  database: process.env.DB_NAME ?? 'clinic_db',
  entities: [User, Role, Workspace, WorkspaceUser, Session, Establishment, EstablishmentUser, Invitation],
  synchronize: false,
  charset: 'utf8mb4',
});

async function seed() {
  await ds.initialize();
  console.log('Connected to DB');

  const userRepo = ds.getRepository(User);
  const roleRepo = ds.getRepository(Role);
  const wsRepo = ds.getRepository(Workspace);
  const wsUserRepo = ds.getRepository(WorkspaceUser);

  // Create super admin user
  let admin = await userRepo.findOne({ where: { email: 'admin@clinic.com' } });
  if (!admin) {
    admin = await userRepo.save(
      userRepo.create({
        fullName: 'Super Admin',
        email: 'admin@clinic.com',
        password: await bcrypt.hash('Admin@123', 12),
        status: UserStatus.ACTIVE,
      }),
    );
    console.log('Created admin user: admin@clinic.com / Admin@123');
  } else {
    console.log('Admin user already exists');
  }

  // Create default workspace
  let workspace = await wsRepo.findOne({ where: { slug: 'clinic-demo' } });
  if (!workspace) {
    workspace = await wsRepo.save(
      wsRepo.create({
        name: 'Clínica Demo',
        slug: 'clinic-demo',
        ownerId: admin.id,
      }),
    );
    console.log('Created workspace: Clínica Demo');
  } else {
    console.log('Workspace already exists');
  }

  // Create super admin role
  let role = await roleRepo.findOne({ where: { type: RoleType.SUPER_ADMIN, workspaceId: workspace.id } });
  if (!role) {
    role = await roleRepo.save(
      roleRepo.create({
        name: 'Super Admin',
        slug: `super-admin-${workspace.id.substring(0, 8)}`,
        type: RoleType.SUPER_ADMIN,
        isSystem: true,
        workspaceId: workspace.id,
      }),
    );
    console.log('Created super admin role');
  }

  // Assign role to admin in workspace
  const existing = await wsUserRepo.findOne({
    where: { workspaceId: workspace.id, userId: admin.id },
  });
  if (!existing) {
    await wsUserRepo.save(
      wsUserRepo.create({
        workspaceId: workspace.id,
        userId: admin.id,
        roleId: role.id,
      }),
    );
    console.log('Assigned admin to workspace with super_admin role');
  }

  await ds.destroy();
  console.log('\nSeed completed!');
  console.log('Login: admin@clinic.com / Admin@123');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
