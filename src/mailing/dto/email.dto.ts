import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class Recepient {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  to: Array<object>;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  cc?: Array<object>;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  bcc?: Array<object>;
}

export class Content {
  @IsString()
  @ApiProperty()
  subject: string;

  @IsString()
  @ApiProperty()
  plainText: string;

  @IsString()
  @ApiProperty()
  html?: string;
}

export class Attachment {
  @IsString()
  name: string;
  @IsString()
  contentType: string;
  @IsString()
  contentInBase64: string;
}

export class EmailDto {
  @IsString()
  @ApiProperty()
  senderAddress?: string;

  @IsObject()
  @ApiProperty()
  content: Content;

  @IsObject()
  @ApiProperty()
  recipients: Recepient;

  @IsArray()
  @ApiProperty()
  attachment?: Attachment[];
}
