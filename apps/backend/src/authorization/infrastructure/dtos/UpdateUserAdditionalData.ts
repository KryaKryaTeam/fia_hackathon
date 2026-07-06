import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserAdditionalDataDto {
  @ApiPropertyOptional({ example: '@john_doe', nullable: true })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({ example: 'john#1234', nullable: true })
  @IsOptional()
  @IsString()
  discord?: string;

  @ApiPropertyOptional({ example: 'John', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  lastName?: string;

  @ApiPropertyOptional({ example: 'Smith', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  surName?: string;

  @ApiPropertyOptional({
    example: '2010-05-20T00:00:00.000Z',
    description: 'ISO 8601 date string',
    nullable: true,
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date) // Важливо: перетворює рядок з JSON на об'єкт Date
  birthDay?: Date;
}
