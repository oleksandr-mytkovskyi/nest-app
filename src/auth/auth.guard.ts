import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { from, Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { userInfo } from 'node:os';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private reflector: Reflector
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const token = request.headers.authorization.split(' ')[1];
            const decode = this.jwtService.verify(token, { secret: jwtConstants.secretPublickAccess });
            const allowedRoles = this.reflector.get<number[]>('roles', context.getClass());
            if (!allowedRoles) {
                return true;
            }
            request.user = {
                roleId: decode.roleId,
                userId: decode.id
            }
            // console.log(request.user);
            return allowedRoles.includes(decode.roleId);
        } catch (e) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Token not valid',
            }, HttpStatus.FORBIDDEN);
        }
    }
}