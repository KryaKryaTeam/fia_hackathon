import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsJWT } from 'class-validator';

export class ContinueResponse {
  @ApiProperty({
    description: 'JWT access token used for authorizing subsequent requests',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  accessToken: string;

  constructor(partial: Partial<ContinueResponse>) {
    Object.assign(this, partial);
  }
}
