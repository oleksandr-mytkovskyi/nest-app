import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
  providers: [AuthService]
})
export class AuthModule {}