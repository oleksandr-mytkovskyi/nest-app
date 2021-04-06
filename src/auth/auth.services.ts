import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Auth } from './auth.interface';
import { User } from '../db/user.entity';
import { Registration } from './registration.interface';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

@Injectable()
export class AuthServices {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async login(logData: Auth) {
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

    async registration(newUser: Registration) {
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

    private comparePasswordHash(password, hash) {
        return bcrypt.compareSync(password, hash);
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

// async login(user: any) {
//     const payload = { username: user.username, sub: user.userId };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }