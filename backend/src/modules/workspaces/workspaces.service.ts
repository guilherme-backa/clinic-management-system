import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceUser } from './entities/workspace-user.entity';
import { Role } from '../auth/entities/role.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceStatus, WorkspacePlan, RoleType } from '../../common/enums';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace) private repo: Repository<Workspace>,
    @InjectRepository(WorkspaceUser) private wsUserRepo: Repository<WorkspaceUser>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async create(dto: CreateWorkspaceDto, ownerId: string): Promise<Workspace> {
    const slug = dto.slug ?? this.generateSlug(dto.name);

    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) throw new ConflictException('Slug já em uso');

    const workspace = await this.repo.save(
      this.repo.create({
        ...dto,
        slug,
        ownerId,
        status: WorkspaceStatus.ACTIVE,
        plan: dto.plan ?? WorkspacePlan.FREE,
      }),
    );

    // Auto-assign owner role
    const ownerRole = await this.ensureSystemRole(RoleType.WORKSPACE_OWNER, workspace.id);
    await this.wsUserRepo.save(
      this.wsUserRepo.create({
        workspaceId: workspace.id,
        userId: ownerId,
        roleId: ownerRole.id,
      }),
    );

    return workspace;
  }

  async findAll(userId: string, isSuperAdmin = false): Promise<Workspace[]> {
    if (isSuperAdmin) {
      return this.repo.find({ order: { name: 'ASC' } });
    }
    const memberships = await this.wsUserRepo.find({ where: { userId } });
    const ids = memberships.map((m) => m.workspaceId);
    if (ids.length === 0) return [];
    return this.repo
      .createQueryBuilder('w')
      .where('w.id IN (:...ids)', { ids })
      .orderBy('w.name', 'ASC')
      .getMany();
  }

  async findOne(id: string, userId: string, isSuperAdmin = false): Promise<Workspace> {
    const workspace = await this.repo.findOne({ where: { id }, relations: ['owner'] });
    if (!workspace) throw new NotFoundException('Workspace não encontrado');

    if (!isSuperAdmin) {
      const member = await this.wsUserRepo.findOne({ where: { workspaceId: id, userId } });
      if (!member) throw new ForbiddenException('Acesso negado');
    }

    return workspace;
  }

  async update(id: string, dto: UpdateWorkspaceDto, userId: string): Promise<Workspace> {
    const workspace = await this.findOne(id, userId);

    if (dto.slug && dto.slug !== workspace.slug) {
      const exists = await this.repo.findOne({ where: { slug: dto.slug } });
      if (exists) throw new ConflictException('Slug já em uso');
    }

    Object.assign(workspace, dto);
    return this.repo.save(workspace);
  }

  async updateStatus(id: string, status: WorkspaceStatus): Promise<Workspace> {
    const workspace = await this.repo.findOneOrFail({ where: { id } });
    workspace.status = status;
    return this.repo.save(workspace);
  }

  async getMembers(workspaceId: string): Promise<WorkspaceUser[]> {
    return this.wsUserRepo.find({
      where: { workspaceId },
      relations: ['user', 'role'],
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 60);
  }

  private async ensureSystemRole(type: RoleType, workspaceId: string): Promise<Role> {
    let role = await this.roleRepo.findOne({ where: { type, workspaceId } });
    if (!role) {
      role = await this.roleRepo.save(
        this.roleRepo.create({
          name: this.roleLabel(type),
          slug: `${type}-${workspaceId.substring(0, 8)}`,
          type,
          isSystem: true,
          workspaceId,
        }),
      );
    }
    return role;
  }

  private roleLabel(type: RoleType): string {
    const labels: Record<RoleType, string> = {
      [RoleType.SUPER_ADMIN]: 'Super Admin',
      [RoleType.WORKSPACE_OWNER]: 'Proprietário',
      [RoleType.ESTABLISHMENT_OWNER]: 'Proprietário da Clínica',
      [RoleType.WORKSPACE_ADMIN]: 'Administrador',
      [RoleType.ESTABLISHMENT_ADMIN]: 'Admin da Clínica',
      [RoleType.VETERINARIAN]: 'Veterinário',
      [RoleType.RECEPTIONIST]: 'Recepcionista',
      [RoleType.STAFF]: 'Funcionário',
    };
    return labels[type] ?? type;
  }
}
