import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Schema } from './schema.decorator';

export type BaseEntityDocument = BaseEntity & Document;
@Schema({
  strict: true,
  strictQuery: false, //to prevent result for invalid key
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class BaseEntity {
  @Prop()
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop({ default: false, required: true })
  deleted?: boolean;
}

const BaseSchema = SchemaFactory.createForClass(BaseEntity);

export { BaseSchema };
