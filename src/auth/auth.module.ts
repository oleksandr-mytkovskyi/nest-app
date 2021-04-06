import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../db/user.entity';
import { AuthController } from './auth.controller';
import { AuthServices } from './auth.services';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({       
        secret: jwtConstants.secretPublickAccess,
        signOptions: { expiresIn: '1h' },
     }),
  ],
  controllers: [AuthController],
  providers: [AuthServices]
})
export class AuthModule {}
