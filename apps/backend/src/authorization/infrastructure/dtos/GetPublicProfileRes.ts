import { ApiProperty } from '@nestjs/swagger';
import { IProfile } from '@/authorization/domain/entities/User.entity';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { RoleEnum } from '@/types/RoleEnum';

export class GetProfileRes implements IProfile {
  @ApiProperty({
    format: 'uuid',
  })
  id: string;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({
    example: 'https://cdn.example.com/avatars/1.png',
    format: 'uri',
  })
  avatarURL: InternalFile<'user:avatar'>;

  @ApiProperty({ enum: RoleEnum, example: RoleEnum.USER })
  role: RoleEnum;
}
