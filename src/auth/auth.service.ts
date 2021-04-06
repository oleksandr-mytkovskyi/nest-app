import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Login, Registration, Auth } from './dto/auth.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async login(logData: Login): Promise<Auth> {
        const { email, password } = logData;
        const dataInDB = await this.userRepository.findOne({ email });
        if(!dataInDB) {
            throw new Error('email dont user, maybe you need registration');
        }
        const verify = bcrypt.compareSync(password, dataInDB.password);
        if(!verify) {
            throw new Error('password incorrect');
        }
        const { firstName, lastName } = dataInDB;
        const payload = { firstName, lastName, email };
        const result = this.getTokens(payload);
        return result;
    }

    async registration(newUser: Registration): Promise<Auth> {
        const { email, password, firstName, lastName } = newUser;
        const dataInDB = await this.userRepository.findOne({ email });
        if (dataInDB) {
            throw new Error('email was used, maybe you need login');
        }
        const hash = this.getPasswordHash(password);
        const saveData = {
            email,
            password: hash,
            firstName,
            lastName
        }
        this.userRepository.save(saveData);
        const payload = { firstName, lastName, email };
        const result = this.getTokens(payload);
        return result;
    }

    private getPasswordHash(password: string): string {
        const saltOrRounds = 10;
        const hash = bcrypt.hashSync(password, saltOrRounds);
        return hash;
    }

    private getTokens(payload) {
        const { secretPublickAccess, expiresInAccess, secretPublickRefresh, expiresInRefresh } = jwtConstants;
        return {
            access_token: this.jwtService.sign(payload, {
                secret: secretPublickAccess,
                expiresIn: expiresInAccess
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: secretPublickRefresh,
                expiresIn: expiresInRefresh
            })
        };
    }

}
