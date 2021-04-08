import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { from, Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const roleId = request.user.roleId;
            const allowedRoles = this.reflector.get<number[]>('roles', context.getClass());
            if (!allowedRoles) {
                return true;
            }
            return allowedRoles.includes(roleId);
        } catch (e) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Role not valid',
            }, HttpStatus.FORBIDDEN);
        }
    }
}