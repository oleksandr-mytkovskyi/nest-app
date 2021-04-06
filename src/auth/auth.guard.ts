import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { from, Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

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
            const roles = this.reflector.get<string[]>('roles', context.getClass());
            if (!roles) {
                return true;
            }

            const allowedRoles = Object.values(roles[0]);

            const request = context.switchToHttp().getRequest();
            const token = request.headers.authorization.split(' ')[1];
            const decode = this.jwtService.verify(token, { secret: jwtConstants.secretPublickAccess });
            return allowedRoles.includes(decode.roleId);
        } catch (e) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Token not valid',
            }, HttpStatus.FORBIDDEN);
        }
    }
}