import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class RegistartionBody {
  @IsEmail()
  @ApiProperty({ required: true, example: 'example@localhost.com' })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
  @ApiProperty({ required: true, example: '123Ac&44' })
  password: string;

  constructor(partial: Partial<RegistartionBody>) {
    Object.assign(this, partial);
  }
}
