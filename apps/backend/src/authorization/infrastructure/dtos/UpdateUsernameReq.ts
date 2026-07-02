import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUsernameReq {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  username: string;
}
