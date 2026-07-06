import { ApiResponseProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiResponseProperty({ type: 'string' })
  access_token: string;
  @ApiResponseProperty({ type: 'boolean' })
  userExistsBefore: boolean;
}
