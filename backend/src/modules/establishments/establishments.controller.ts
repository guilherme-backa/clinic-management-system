import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EstablishmentsService } from './establishments.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleType } from '../../common/enums';

@ApiTags('Establishments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('establishments')
export class EstablishmentsController {
  constructor(private service: EstablishmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar estabelecimento' })
  create(@Body() dto: CreateEstablishmentDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar estabelecimentos do workspace' })
  @ApiQuery({ name: 'workspaceId', required: true })
  findAll(@Query('workspaceId') workspaceId: string, @CurrentUser() user: any) {
    return this.service.findAll(workspaceId, user.id, user.roleType === RoleType.SUPER_ADMIN);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar estabelecimento por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.service.findOne(id, user.id, user.roleType === RoleType.SUPER_ADMIN);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar estabelecimento' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEstablishmentDto,
    @CurrentUser() user: any,
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Listar membros do estabelecimento' })
  getMembers(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getMembers(id);
  }
}
