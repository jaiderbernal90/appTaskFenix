import { User } from '@/src/domain/entities/user.entity';
import UsersRepository from '@/src/infrastructure/database/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userRepository: UsersRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: User) {
    const user = await this.userRepository.findOne(payload.id);
    return user;
  }
}
