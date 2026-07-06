import { LocationType } from '@/application/application/commands/CreateApplication.command';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateApplicatioBodyLocation {
  @ApiProperty({ description: 'longitude' })
  long: number;

  @ApiProperty({ description: 'latitude' })
  lat: number;
}

export class CreateApplicationBody {
  @ApiProperty({ enum: () => LocationType, enumName: 'Location Type' })
  locationType: LocationType;

  @ApiProperty({
    name: 'text',
    minimum: 10,
    maximum: 1000,
    description: 'The application body text',
  })
  @IsString()
  @Length(10, 1000)
  text: string;

  @ApiPropertyOptional({
    type: CreateApplicatioBodyLocation,
    description: 'Location object (long, lat)',
  })
  location?: {
    long: number;
    lat: number;
  };
  @ApiPropertyOptional({ description: 'OSM Address' })
  @IsString()
  address?: string;
}
