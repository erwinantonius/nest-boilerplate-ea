import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';
import {
  Workplace,
  WorkplaceSimple,
} from 'src/core/workplace/entities/workplace.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  gender?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  contract_type: string;

  @IsString()
  @ApiProperty()
  expired_date?: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  roles: Array<string>;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty()
  workplace?: Workplace;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  workplace_delegate?: WorkplaceSimple[];

  @IsString()
  @ApiProperty()
  fcm_token?: string;
}
