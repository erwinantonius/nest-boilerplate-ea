import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/base.entity';
import { Schema } from 'src/common/schema.decorator';
import { HydratedDocument } from 'mongoose';

export type RolePermissionDocument = HydratedDocument<RolePermission>;

@Schema({
  inheritOption: true,
})
export class RolePermission extends BaseEntity {
  @Prop({ required: true })
  role?: string;

  @Prop({ required: true })
  permission?: Array<string>;
}

export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermission);
