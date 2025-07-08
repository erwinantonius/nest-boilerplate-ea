import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty()
  old_password?: string | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  new_password: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  key: string;

  @IsDate()
  @ApiProperty()
  expired_at: Date;

  @IsBoolean()
  @ApiProperty()
  used: boolean;
}
