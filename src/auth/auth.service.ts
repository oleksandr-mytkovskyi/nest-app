import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDTO, RegistrationDTO, AuthDTO, PayloadDataDTO } from './dto/auth.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { UserSerializeDTO } from './dto/auth.serialize.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async login(logData: LoginDTO): Promise<AuthDTO> {
        const { email, password } = logData;
        const data = await this.userRepository.findOne({ where: { email } });
        if(!data) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'email dont used, maybe you need registration'
            }, HttpStatus.UNAUTHORIZED);
        }
        const verify = bcrypt.compareSync(password, data.password);
        if(!verify) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'invalid password'
            }, HttpStatus.UNAUTHORIZED);
        }
        const serialize = plainToClass(UserSerializeDTO, data);
        const payload = {...serialize};
        const result = this.getTokens(payload);
        const refreshToken = result.refresh_token;
        await this.userRepository.update({id: data.id}, {refreshToken});
        return result;
    }

    async registration(newUser: RegistrationDTO): Promise<AuthDTO> {
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
            lastName,
        }
        const data = await this.userRepository.save(saveData);
        const serialize = plainToClass(UserSerializeDTO, data);
        const payload = {...serialize};
        const result = this.getTokens(payload);
        const refreshToken = result.refresh_token;
        await this.userRepository.update({id: data.id}, {refreshToken});
        return result;
    }

    private getPasswordHash(password: string): string {
        const saltOrRounds = 10;
        const hash = bcrypt.hashSync(password, saltOrRounds);
        return hash;
    }

    private getTokens(payload: PayloadDataDTO): AuthDTO {
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
