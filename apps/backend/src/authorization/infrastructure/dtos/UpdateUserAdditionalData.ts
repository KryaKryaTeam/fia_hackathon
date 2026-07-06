import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserAdditionalDataDto {
  @ApiPropertyOptional({ example: 'Smith', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  fullName?: string;

  @ApiPropertyOptional({ example: '+380000000000', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  phone?: string;

  @ApiPropertyOptional({ example: 'London, str. BackStreet 5', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  address?: string;
}
