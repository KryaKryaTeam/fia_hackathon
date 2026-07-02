import { ApiResponseProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiResponseProperty({ type: 'string' })
  accessToken: string;
  @ApiResponseProperty({ type: 'boolean' })
  userExistsBefore: boolean;
}
