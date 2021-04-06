import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
    ) { }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const token = request.headers.authorization.split(' ')[1];
            const decodet = this.jwtService.verify(token, { secret: jwtConstants.secretPublickAccess })
            return true;
        } catch (e) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Token not valid',
            }, HttpStatus.FORBIDDEN);
        }
    }
}