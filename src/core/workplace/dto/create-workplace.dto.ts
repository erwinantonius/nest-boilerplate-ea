import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkplaceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  coordinate: Array<number>;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  contact_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  contact_phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  contact_email: string;
}
