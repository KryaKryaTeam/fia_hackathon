import { ApiProperty } from '@nestjs/swagger';
import { IFilePlain } from '@/files/domain/entities/File.entity';

export class FileDto implements IFilePlain {
  @ApiProperty({
    name: 'size',
    required: true,
    description: 'A size of file in bytes',
  })
  size: number;
  @ApiProperty({
    name: 'mimeType',
    required: true,
    description: 'A mime type of file',
  })
  mimeType: string;

  @ApiProperty({
    name: 'slot',
    required: true,
    description: 'Slot of file for attach',
  })
  slot: string;

  @ApiProperty({
    name: 'url',
    required: true,
    description: 'internal link to a file',
  })
  url: string;
}
