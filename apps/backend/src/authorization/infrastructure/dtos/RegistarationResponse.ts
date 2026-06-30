import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class RegistrationResponse {
  @ApiProperty({
    description:
      'The unique ID used to track the registration process and verify the 6-digit code',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  requestId: string;

  constructor(partial: Partial<RegistrationResponse>) {
    Object.assign(this, partial);
  }
}
