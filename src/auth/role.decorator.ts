import { SetMetadata } from '@nestjs/common';

export const Roles = (args: Array<string>) => SetMetadata('roles', args);
