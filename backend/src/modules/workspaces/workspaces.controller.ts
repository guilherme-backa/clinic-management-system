import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleType } from '../../common/enums';

@ApiTags('Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private service: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar workspace' })
  create(@Body() dto: CreateWorkspaceDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar workspaces do usuário' })
  findAll(@CurrentUser() user: any) {
    return this.service.findAll(user.id, user.roleType === RoleType.SUPER_ADMIN);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar workspace por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.service.findOne(id, user.id, user.roleType === RoleType.SUPER_ADMIN);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar workspace' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkspaceDto,
    @CurrentUser() user: any,
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Listar membros do workspace' })
  getMembers(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getMembers(id);
  }
}
