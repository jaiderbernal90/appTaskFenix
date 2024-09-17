import { Injectable } from '@nestjs/common';
import { IAuthService } from '@interfaces/services/IAuthService.interface';
import UsersRepository from '@/src/infrastructure/database/repositories/users.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@dto/auth/login.dto';
import { IResponseToken } from '@interfaces/IResponseToken.interface';
import { compareHash, generateHash } from '@utils/handleBcrypt';
import { IResponse } from '@interfaces/IResponse.interface';
import { ListUserDto } from '@/src/application/dto/user/list-user.dto';
import { RegisterDto } from '@dto/auth/register.dto';
import { HttpException, NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly _jwtSvc: JwtService,
    private readonly _userRepository: UsersRepository
  ) {}

  public async login(dataLogin: LoginDto): Promise<IResponseToken> {
    const { email, password } = dataLogin;

    const findUser = await this._userRepository.findByEmail(email);
    if (!findUser)
      throw new NotFoundException('No existe un usuario con ese email');

    const { id, fullname, password: passwordHash } = findUser;
    const checkPassword = await compareHash(password, passwordHash);
    if (!checkPassword) throw new HttpException('Contraseña incorrecta', 403);

    const payload = { id, fullname };
    const token = this._jwtSvc.sign(payload);

    return { token };
  }

  public async register(user: RegisterDto): Promise<IResponse<ListUserDto>> {
    const { password } = user;
    const plainToHash = await generateHash(password);
    user = { ...user, password: plainToHash };

    const data = await this._userRepository.create(user);

    return { message: 'Usuario registrado exitosamente', data: data };
  }
}
