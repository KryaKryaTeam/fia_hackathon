import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { RoleEnum } from '@/types/RoleEnum';

export class UpdateRoleBodyDto {
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  @ApiProperty({
    enum: RoleEnum,
    enumName: 'user_roles',
    example: RoleEnum.ADMIN,
  })
  role: RoleEnum;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'ID which user to change',
    example: randomUUID(),
  })
  userId: string;
}
