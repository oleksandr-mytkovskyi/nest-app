import { Controller, Post, Body, Get, UseGuards} from '@nestjs/common';
import { AuthService} from './auth.service';
import { LoginDTO, RegistrationDTO, AuthDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService){}

    @Post('login')
    login(@Body() logData: LoginDTO): Promise<AuthDTO> {
        return this.AuthService.login(logData);
    }
    @Post('registration')
    registration(@Body() newUser: RegistrationDTO): Promise<AuthDTO> {
        return this.AuthService.registration(newUser);
    }
}
