import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Matches } from 'class-validator';

export class CreateUserLocal {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false, example: 'example@localhost.com' })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
  @IsOptional()
  @ApiProperty({ required: false, example: '123Ac&44' })
  password: string;

  @IsOptional()
  @ApiProperty({ required: false, example: 'gsi_code' })
  code?: string;

  constructor(partial: Partial<CreateUserLocal>) {
    Object.assign(this, partial);
  }
}
