import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserActivityLogSchema,
  UserSchema,
} from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { MailingModule } from 'src/mailing/mailing.module';
import { UserActivityLogService } from './user-activity-log.service';
import {
  RolePermission,
  RolePermissionSchema,
} from './entities/role-permission.entity';
import { RolePermissionService } from './role-permisision.service';
import { ResetPasswordSchema } from './entities/reset-password.entity';
import { ResetPasswordService } from './reset-password.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { WorkplaceModule } from '../workplace/workplace.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: 'user_activity_log', schema: UserActivityLogSchema },
      { name: 'reset_password', schema: ResetPasswordSchema },
    ]),
    MailingModule,
    ConfigModule,
    CommonModule,
    WorkplaceModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtService,
    UserActivityLogService,
    RolePermissionService,
    ResetPasswordService,
  ],
  exports: [
    UserService,
    UserActivityLogService,
    RolePermissionService,
    ResetPasswordService,
  ],
})
export class UserModule {}
