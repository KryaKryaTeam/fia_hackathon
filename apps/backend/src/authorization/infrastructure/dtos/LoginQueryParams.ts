import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthorizationProviderTypes } from '@/types/AuthorizationProvidersTypes';

export class LoginQueryParams {
  @ApiProperty({
    enum: AuthorizationProviderTypes,
    enumName: 'Authorization Providers',
    description: 'Specify which authorization provider to use',
  })
  provider: AuthorizationProviderTypes;

  @ApiProperty({
    name: 'state',
    description: 'CSRF protection code',
  })
  state: string;

  @ApiPropertyOptional({
    name: 'code',
    description: 'Code for OAuth provider',
  })
  code?: string;
}
