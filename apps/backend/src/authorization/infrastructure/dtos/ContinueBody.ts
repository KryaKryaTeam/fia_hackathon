import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Matches, IsString } from 'class-validator';

export class ContinueBody {
  @ApiProperty({
    description: "The 6-digit verification code sent to the user's email",
    example: '454950',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, {
    message: 'The verification code must be exactly 6 digits',
  })
  code: string;

  @ApiProperty({
    description:
      'The unique request identifier (UUID v4) generated during the registration start',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID('4', {
    message: 'The requestId must be a valid UUID v4',
  })
  requestId: string;

  constructor(partial: Partial<ContinueBody>) {
    Object.assign(this, partial);
  }
}
