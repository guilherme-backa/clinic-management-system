import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstablishmentsController } from './establishments.controller';
import { EstablishmentsService } from './establishments.service';
import { Establishment } from './entities/establishment.entity';
import { EstablishmentUser } from './entities/establishment-user.entity';
import { Invitation } from './entities/invitation.entity';
import { WorkspaceUser } from '../workspaces/entities/workspace-user.entity';
import { Role } from '../auth/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Establishment, EstablishmentUser, Invitation, WorkspaceUser, Role]),
  ],
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService],
  exports: [EstablishmentsService, TypeOrmModule],
})
export class EstablishmentsModule {}
