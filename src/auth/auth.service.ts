import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/core/user/user.service';
import * as bcrypt from 'bcrypt';
import {
  Workplace,
  WorkplaceSimple,
} from 'src/core/workplace/entities/workplace.entity';
import { UserActivityLogService } from 'src/core/user/user-activity-log.service';
import { UserActivityLogDocument } from 'src/core/user/entities/user.entity';
import { RolePermissionService } from 'src/core/user/role-permisision.service';

export interface TokenPayload {
  id: string;
  workplace: Workplace;
  workplace_delegate: WorkplaceSimple[];
  email: string;
  fullname: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userLogService: UserActivityLogService,
    private rolePermissionService: RolePermissionService,
    private jwtService: JwtService,
  ) {}

  async signIn(email, pass) {
    try {
      const userLogin = { email };
      const user = await this.userService.findOne({
        filter: userLogin,
        populate: 'workplace',
      });
      if (!user) {
        this.userLogService.create({
          email,
          activity_type: 'attemp_login_failed',
          activity_date: new Date(),
        } as UserActivityLogDocument);
        throw new UnauthorizedException();
      }

      if (user.contract_type === 'OUTSOURCE') {
        if (new Date(user.expired_date) < new Date()) {
          this.userLogService.create({
            email,
            activity_type: 'attemp_login_expired',
            activity_date: new Date(),
          } as UserActivityLogDocument);
          throw new HttpException(
            'Forbidden, your account expired',
            HttpStatus.FORBIDDEN,
          );
        }
      }

      const hash = await bcrypt.hash(pass, user.salt);
      if (hash !== user.hash) {
        throw new UnauthorizedException();
      }
      const allPermission = await this.rolePermissionService.getByRoles(
        user.roles,
      );
      const payload: TokenPayload = {
        workplace: user.workplace,
        workplace_delegate: user.workplace_delegate,
        email: user.email,
        roles: user.roles,
        fullname: `${user.first_name} ${user.last_name}`,
        id: user.id as string,
      };

      const access_token = this.jwtService.sign(payload);
      const userLog = await this.userLogService.findOne({
        filter: { email },
      });

      if (!userLog)
        this.userLogService.create({
          email,
          activity_type: 'attemp_login_success',
          activity_date: new Date(),
        } as UserActivityLogDocument);

      return {
        access_token,
        fullname: `${user.first_name} ${user.last_name}`,
        roles: user.roles,
        workplace: user.workplace,
        workplace_delegate: user.workplace_delegate,
        email: user.email,
        _id: user._id,
        permission: allPermission.permission,
      };
    } catch (e) {
      throw e;
    }
  }
}
