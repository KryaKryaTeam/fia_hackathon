import { ApiResponseProperty } from '@nestjs/swagger';

export class RefreshResponse {
  @ApiResponseProperty({ type: 'string' })
  accessToken: string;
}
