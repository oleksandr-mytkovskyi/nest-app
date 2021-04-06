import { SetMetadata } from '@nestjs/common';
import { Roles as RolesI } from './roles.interface';

export const Roles = (...roles: RolesI[]) => SetMetadata('roles', roles);