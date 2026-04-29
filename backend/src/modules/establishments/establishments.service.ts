import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Establishment } from './entities/establishment.entity';
import { EstablishmentUser } from './entities/establishment-user.entity';
import { WorkspaceUser } from '../workspaces/entities/workspace-user.entity';
import { Role } from '../auth/entities/role.entity';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { EstablishmentStatus, RoleType } from '../../common/enums';

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment) private repo: Repository<Establishment>,
    @InjectRepository(EstablishmentUser) private estUserRepo: Repository<EstablishmentUser>,
    @InjectRepository(WorkspaceUser) private wsUserRepo: Repository<WorkspaceUser>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async create(dto: CreateEstablishmentDto, ownerId: string): Promise<Establishment> {
    await this.assertWorkspaceMember(dto.workspaceId, ownerId);

    const est = await this.repo.save(
      this.repo.create({
        ...dto,
        status: EstablishmentStatus.ACTIVE,
      }),
    );

    const ownerRole = await this.ensureRole(RoleType.ESTABLISHMENT_OWNER, est.id);
    await this.estUserRepo.save(
      this.estUserRepo.create({
        establishmentId: est.id,
        userId: ownerId,
        roleId: ownerRole.id,
      }),
    );

    return est;
  }

  async findAll(workspaceId: string, userId: string, isSuperAdmin = false): Promise<Establishment[]> {
    const qb = this.repo
      .createQueryBuilder('e')
      .where('e.workspace_id = :workspaceId', { workspaceId })
      .orderBy('e.name', 'ASC');

    if (!isSuperAdmin) {
      // Return only establishments where user is a member
      const memberships = await this.estUserRepo.find({ where: { userId } });
      const estIds = memberships.map((m) => m.establishmentId);

      const wsUser = await this.wsUserRepo.findOne({ where: { workspaceId, userId } });
      const isWsAdmin = wsUser && [
        RoleType.WORKSPACE_OWNER,
        RoleType.WORKSPACE_ADMIN,
      ].includes(wsUser.role?.type as RoleType);

      if (!isWsAdmin) {
        if (estIds.length === 0) return [];
        qb.andWhere('e.id IN (:...estIds)', { estIds });
      }
    }

    return qb.getMany();
  }

  async findOne(id: string, userId: string, isSuperAdmin = false): Promise<Establishment> {
    const est = await this.repo.findOne({ where: { id }, relations: ['workspace'] });
    if (!est) throw new NotFoundException('Estabelecimento não encontrado');

    if (!isSuperAdmin) {
      const member = await this.estUserRepo.findOne({ where: { establishmentId: id, userId } });
      const wsUser = await this.wsUserRepo.findOne({
        where: { workspaceId: est.workspaceId, userId },
        relations: ['role'],
      });
      const isWsAdmin = wsUser && [
        RoleType.WORKSPACE_OWNER,
        RoleType.WORKSPACE_ADMIN,
      ].includes(wsUser.role?.type as RoleType);

      if (!member && !isWsAdmin) throw new ForbiddenException('Acesso negado');
    }

    return est;
  }

  async update(id: string, dto: UpdateEstablishmentDto, userId: string): Promise<Establishment> {
    const est = await this.findOne(id, userId);
    Object.assign(est, dto);
    return this.repo.save(est);
  }

  async updateStatus(id: string, status: EstablishmentStatus): Promise<Establishment> {
    const est = await this.repo.findOneOrFail({ where: { id } });
    est.status = status;
    return this.repo.save(est);
  }

  async getMembers(establishmentId: string): Promise<EstablishmentUser[]> {
    return this.estUserRepo.find({
      where: { establishmentId },
      relations: ['user', 'role'],
    });
  }

  private async assertWorkspaceMember(workspaceId: string, userId: string) {
    const member = await this.wsUserRepo.findOne({ where: { workspaceId, userId } });
    if (!member) throw new ForbiddenException('Você não é membro deste workspace');
  }

  private async ensureRole(type: RoleType, establishmentId: string): Promise<Role> {
    const slug = `${type}-est-${establishmentId.substring(0, 8)}`;
    let role = await this.roleRepo.findOne({ where: { slug } });
    if (!role) {
      role = await this.roleRepo.save(
        this.roleRepo.create({
          name: this.roleLabel(type),
          slug,
          type,
          isSystem: true,
          workspaceId: null,
        }),
      );
    }
    return role;
  }

  private roleLabel(type: RoleType): string {
    const labels: Record<string, string> = {
      [RoleType.ESTABLISHMENT_OWNER]: 'Proprietário da Clínica',
      [RoleType.ESTABLISHMENT_ADMIN]: 'Admin da Clínica',
      [RoleType.VETERINARIAN]: 'Veterinário',
      [RoleType.RECEPTIONIST]: 'Recepcionista',
      [RoleType.STAFF]: 'Funcionário',
    };
    return labels[type] ?? type;
  }
}
