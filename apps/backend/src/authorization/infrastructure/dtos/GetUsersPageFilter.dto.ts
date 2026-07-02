import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GetUsersPageFilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Filters emails' })
  email?: string;
}
