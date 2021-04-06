import { Controller, Post, Body} from '@nestjs/common';
import { AuthServices} from './auth.services';
import { Auth } from './auth.interface';
import { Registration } from './registration.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authServices: AuthServices){}

    @Post('login')
    login(@Body() logData: Auth) {
        return this.authServices.login(logData);
    }
    @Post('registration')
    registration(@Body() newUser: Registration): any {
        return this.authServices.registration(newUser);
    }
}
