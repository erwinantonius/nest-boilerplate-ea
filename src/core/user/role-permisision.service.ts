import { Injectable } from '@nestjs/common';
import { GenericService } from 'src/common/generic.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RolePermission,
  RolePermissionDocument,
} from './entities/role-permission.entity';

@Injectable()
export class RolePermissionService extends GenericService<
  RolePermission,
  RolePermissionDocument
> {
  constructor(
    @InjectModel(RolePermission.name)
    readonly model: Model<RolePermissionDocument>,
  ) {
    super(model);
  }

  async getByRoles(roles: Array<string>) {
    const rolePermissions = await super.findAll(
      {
        filter: {
          role: {
            $in: roles,
          },
        },
      },
      true,
    );
    const allPermissions = {
      role: roles,
      permission: [...new Set(rolePermissions.flatMap((m) => m.permission))],
    };
    return allPermissions;
  }
}
