import { IsString, MinLength, IsOptional, IsEmail, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
  @IsOptional() @IsString() street?: string;
  @IsOptional() @IsString() number?: string;
  @IsOptional() @IsString() complement?: string;
  @IsOptional() @IsString() neighborhood?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() zipCode?: string;
}

export class CreateEstablishmentDto {
  @ApiProperty({ example: 'VetCare São Paulo' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'workspace-uuid' })
  @IsString()
  workspaceId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-99' })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiPropertyOptional({ type: AddressDto })
  @IsOptional()
  address?: AddressDto;
}
