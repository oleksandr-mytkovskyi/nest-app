import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
    ) { }
  use(req: Request, res: Response, next: NextFunction) {
   try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = this.jwtService.verify(token, { secret: jwtConstants.secretPublickAccess });

    req.user = {
        roleId: decode.roleId,
        userId: decode.id
    }
    next();
    } catch(e) {
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Token not valid',
        }, HttpStatus.FORBIDDEN);
    }
  }
}
