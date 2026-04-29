import { IsString, MinLength, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkspacePlan } from '../../../common/enums';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'Clínica VetCare' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'vetcare', description: 'Identificador único (lowercase, hifens)' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug deve conter apenas letras minúsculas, números e hifens' })
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: WorkspacePlan })
  @IsOptional()
  @IsEnum(WorkspacePlan)
  plan?: WorkspacePlan;
}
