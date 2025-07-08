import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/base.entity';
import mongoose, { HydratedDocument } from 'mongoose';
import { Schema } from 'src/common/schema.decorator';
import { Workplace } from 'src/core/workplace/entities/workplace.entity';
import { Type } from 'class-transformer';

export type DocumentNumberingDocument = HydratedDocument<DocumentNumbering>;

@Schema({ inheritOption: true })
export class DocumentNumbering extends BaseEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Workplace.name })
  @Type(() => Workplace)
  Workplace?: Workplace;
  @Prop({ required: true })
  code: string;
  @Prop({ required: true, default: 0 })
  counter: number;
  @Prop({ required: true })
  year: number;
  @Prop({ required: true })
  month: number;
}

export class QrBarcodeGeneratorDto {
  data: string;
}

export class DocNumberingDto {
  code: string;
}

export const DocumentNumberingSchema =
  SchemaFactory.createForClass(DocumentNumbering);
