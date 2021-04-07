import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ListController } from './list.controller';
import { jwtConstants } from '../auth/auth.constants';
import { ListService } from './list.service';
import { List } from './list.entity';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([List]),
    JwtModule.register({       
    secret: jwtConstants.secretPublickAccess,
    signOptions: { expiresIn: '1h' },
 }),],
  controllers: [ListController],
  providers: [ListService]
})
export class ListModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('list');
  }
}
