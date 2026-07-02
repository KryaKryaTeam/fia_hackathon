import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateAvatarReq {
  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  avatar: string;
}
