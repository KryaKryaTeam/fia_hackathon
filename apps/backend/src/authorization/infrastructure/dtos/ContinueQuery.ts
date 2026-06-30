import { ApiProperty } from '@nestjs/swagger';

export class ContinueQuery {
  @ApiProperty({
    name: 'state',
    description: 'CSRF protection code',
  })
  state: string;
}
