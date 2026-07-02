import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PageQueryDto {
  @ApiProperty({
    default: 0,
    description: 'A page number, starts from 0',
    minimum: 0,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page = 0;
}
