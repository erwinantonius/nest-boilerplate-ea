import { Injectable } from '@nestjs/common';
import { GenericService } from 'src/common/generic.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserActivityLog,
  UserActivityLogDocument,
} from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserActivityLogService extends GenericService<
  UserActivityLog,
  UserActivityLogDocument
> {
  constructor(
    @InjectModel('user_activity_log')
    readonly model: Model<UserActivityLogDocument>,
  ) {
    super(model);
  }
}
