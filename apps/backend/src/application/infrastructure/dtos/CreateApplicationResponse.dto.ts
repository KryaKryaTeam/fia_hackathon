import { ApplicationStatus } from '@/application/domain/entities/Application.entity';
import { AddressObject } from '@/application/domain/objects/Address.object';
import { LocationObject } from '@/application/domain/objects/Location.object';
import { ApplicationRequesterObject } from '@/application/domain/objects/Requester.object';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

class RequesterResponse {
  @ApiProperty({ description: 'UUID', example: randomUUID() })
  id: string;
  @ApiProperty({
    description: 'Requester email',
    example: 'example@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Full name of requester',
    example: 'Ivanov Ivan Ivanovych',
  })
  fullName?: string;

  @ApiProperty({
    description: 'Address of requester',
    example: 'London Backstreet 12',
  })
  address?: string;

  @ApiProperty({
    description: 'Phone of requester',
    example: '+380 00 000 00 00',
  })
  phone?: string;
}

class ApplicationResponse {
  @ApiProperty({ description: 'UUID', example: randomUUID() })
  id: string;

  @ApiProperty({ description: 'Application body text' })
  text: string;

  @ApiProperty({
    description: 'Location object',
    example: { long: 10, lat: 10 },
  })
  location: LocationObject;

  @ApiProperty({
    description: 'Address object',
    example: 'London Backstreet 12',
  })
  address: AddressObject;

  @ApiProperty({
    description: 'Requester object',
    type: () => RequesterResponse,
  })
  requester: ApplicationRequesterObject;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({
    enum: () => ApplicationStatus,
    enumName: 'Application status',
  })
  status: ApplicationStatus;
}

export class CreateApplicationResponse {
  @ApiProperty({ type: () => ApplicationResponse })
  application: ApplicationResponse;
}
