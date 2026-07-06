import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsPhoneNumber } from 'class-validator';

export class UpdateUserAdditionalDataDto {
  @ApiProperty({example: "John Doe Smith"})
  @IsString()
  @Length(10, 200)
  fullName: string;

  @ApiProperty({example: "+380 63 821 22 96"})
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({example: "Zhytomyr, str. Schevchenka 5"})
  @IsString()
  address: string;
}
