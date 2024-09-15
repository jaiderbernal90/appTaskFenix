import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { IAuthService } from '../interfaces/services/IAuthService.interface';
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { IResponseToken } from '../interfaces/IResponseToken.interface';
import { compareHash, generateHash } from '../utils/handleBcrypt';
import { User } from 'src/domain/entities/user.entity';
import UserRepository from 'src/infrastructure/database/repositories/user.repository';
import { IResponse } from '../interfaces/IResponse.interface';
import { ListUserDto } from '../dto/user/list-user.dto';

@Injectable()
export class AuthService implements IAuthService {

    constructor(
        private readonly _jwtSvc: JwtService,
        private readonly _userRepository: UserRepository,
    ) { }

    public async login(dataLogin: LoginDto): Promise<IResponseToken> {
        const { email, password } = dataLogin;

        const findUser = await this._userRepository.findByEmail(email);
        if (!findUser) throw new NotFoundException('No existe un usuario con ese email');
        
        const { id, fullname, age, password:passwordHash } = findUser;
        const checkPassword = await compareHash(password, passwordHash);
        if (!checkPassword) throw new HttpException('Contraseña incorrecta', 403)

        const payload = { id, fullname, age }
        const token = this._jwtSvc.sign(payload);

        return { token }
    }


    public async register(user: RegisterDto): Promise<IResponse<ListUserDto>> {
        const { password } = user;
        const plainToHash = await generateHash(password);
        user = {...user, password:plainToHash};
        
        const data = await this._userRepository.create(user);
    
        return { message: 'Usuario registrado exitosamente', data: data };
    }
}
