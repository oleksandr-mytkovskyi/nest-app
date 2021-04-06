import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Login, Registration, Auth, PayloadData } from './dto/auth.dto';
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
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'email dont used, maybe you need registration'
            }, HttpStatus.UNAUTHORIZED);
        }
        const verify = bcrypt.compareSync(password, dataInDB.password);
        if(!verify) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'invalid password'
            }, HttpStatus.UNAUTHORIZED);
        }
        const { firstName, lastName, roleId } = dataInDB;
        const payload = { firstName, lastName, email, roleId };
        const result = this.getTokens(payload);
        return result;
    }

    async registration(newUser: Registration): Promise<Auth> {
        const { email, password, firstName, lastName } = newUser;
        const dataInDB = await this.userRepository.findOne({ email });
        if (dataInDB) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'email was used, maybe you need login'
            }, HttpStatus.UNAUTHORIZED);
        }
        const hash = this.getPasswordHash(password);
        const saveData = {
            email,
            password: hash,
            firstName,
            lastName
        }
        const data = await this.userRepository.save(saveData);
        console.log(data);
        const payload = { firstName, lastName, email, roleId: data.roleId };
        const result = this.getTokens(payload);
        return result;
    }

    private getPasswordHash(password: string): string {
        const saltOrRounds = 10;
        const hash = bcrypt.hashSync(password, saltOrRounds);
        return hash;
    }

    private getTokens(payload: PayloadData): Auth {
        const { secretPrivatkAccess, expiresInAccess, secretPrivatkRefresh , expiresInRefresh } = jwtConstants;
        return {
            access_token: this.jwtService.sign(payload, {
                secret: secretPrivatkAccess,
                algorithm: 'RS256',
                expiresIn: expiresInAccess
            }),
            refresh_token: this.jwtService.sign(payload, {
                secret: secretPrivatkRefresh,
                algorithm: 'RS256',
                expiresIn: expiresInRefresh
            })
        };
    }
}
