import { Controller, Post, Body, Get, UseGuards} from '@nestjs/common';
import { AuthService} from './auth.service';
import { Login, Registration, Auth } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService){}

    @Post('login')
    login(@Body() logData: Login): Promise<Auth> {
        return this.AuthService.login(logData);
    }
    @Post('registration')
    registration(@Body() newUser: Registration): Promise<Auth> {
        return this.AuthService.registration(newUser);
    }
}
