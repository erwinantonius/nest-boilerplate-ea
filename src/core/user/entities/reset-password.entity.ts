import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/base.entity';
import { Schema } from 'src/common/schema.decorator';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.entity';
import { Type } from 'class-transformer';

export type ResetPasswordDocument = HydratedDocument<ResetPassword>;

@Schema({
  inheritOption: true,
})
export class ResetPassword extends BaseEntity {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  expired_at: Date;

  @Prop({ default: false })
  used: boolean;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);
