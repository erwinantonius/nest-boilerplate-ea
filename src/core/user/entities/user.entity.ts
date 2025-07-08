import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/base.entity';
import { Schema } from 'src/common/schema.decorator';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  Workplace,
  WorkplaceSimple,
  WorkplaceSimpleSchema,
} from 'src/core/workplace/entities/workplace.entity';
import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';

export enum ContractType {
  PERMANENT = 'PERMANENT',
  OUTSOURCE = 'OUTSOURCE',
}

export type UserDocument = HydratedDocument<User>;
export type UserActivityLogDocument = HydratedDocument<UserActivityLog>;

@Schema({
  inheritOption: true,
})
export class User extends BaseEntity {
  @Prop({ required: true })
  first_name?: string;

  @Prop({ required: true })
  last_name?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hash?: string;

  @Prop({ required: true })
  salt?: string;

  @Prop()
  gender?: string;

  @Prop({ required: true, enum: ContractType, default: ContractType.PERMANENT })
  @IsEnum(ContractType)
  contract_type?: string;

  @Prop({ required: true })
  expired_date?: string;

  @Prop({ required: true })
  roles?: Array<string>;

  @Prop({ required: true })
  phone?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Workplace.name })
  @Type(() => Workplace)
  workplace?: Workplace;

  @Prop({ type: [WorkplaceSimpleSchema], default: undefined })
  workplace_delegate?: WorkplaceSimple[];

  @Prop()
  fcm_token?: string;
}

@Schema({
  inheritOption: true,
})
export class UserActivityLog extends BaseEntity {
  @Prop({ required: true })
  email?: string;

  @Prop({ required: true })
  activity_type?: string;

  @Prop({ required: true })
  activity_date?: Date;
}

export type UserSimple = {
  _id: string;
  name: string;
};

export const UserSchema = SchemaFactory.createForClass(User);
export const UserActivityLogSchema =
  SchemaFactory.createForClass(UserActivityLog);
UserSchema.set('toJSON', { virtuals: true });
UserSchema.virtual('fullname')
  .set(function (fullName: string) {
    const [first_name, last_name] = fullName.split(' ');
    this.set({ first_name, last_name });
  })
  .get(function () {
    return `${this.first_name} ${this.last_name}`;
  });
