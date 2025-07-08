import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/base.entity';
import mongoose, { HydratedDocument } from 'mongoose';
import { Schema } from 'src/common/schema.decorator';
import { ApiProperty } from '@nestjs/swagger';

export type WorkplaceDocument = HydratedDocument<Workplace>;

@Schema({})
export class WorkplaceSimple {
  @ApiProperty()
  @Prop({ type: mongoose.SchemaTypes.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  code: string;
}

@Schema({ inheritOption: true })
export class Workplace extends BaseEntity {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  code: string;
  @Prop()
  coordinate: Array<number>;
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  currency: string;
  @Prop({ required: true })
  contact_name: string;
  @Prop({ required: true })
  contact_phone: string;
  @Prop({ required: true })
  contact_email: string;
}

export const WorkplaceSchema = SchemaFactory.createForClass(Workplace);
export const WorkplaceSimpleSchema =
  SchemaFactory.createForClass(WorkplaceSimple);
