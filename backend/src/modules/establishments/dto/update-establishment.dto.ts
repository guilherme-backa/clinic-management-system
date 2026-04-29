import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateEstablishmentDto } from './create-establishment.dto';

export class UpdateEstablishmentDto extends PartialType(
  OmitType(CreateEstablishmentDto, ['workspaceId'] as const),
) {}
