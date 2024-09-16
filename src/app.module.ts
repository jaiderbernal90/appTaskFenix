import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { User } from '@entities/user.entity';
import { AuthController } from '@controllers/auth.controller';
import { AuthService } from '@services/auth.service';
import { UserController } from '@controllers/user.controller';
import { UserService } from '@services/user.service';
import { JwtStrategy } from '@utils/strategies/jwt.strategy';
import UserRepository from '@repositories/user.repository';
import { AUTH_SERVICE_TOKEN } from '@interfaces/services/IAuthService.interface';
import { USER_SERVICE_TOKEN } from '@interfaces/services/IUserService.interface';
import { typeOrmConfig } from './infrastructure/database/providers/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '4h' }
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [
    AppService,
    JwtStrategy,
    UserRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthService
    },
    {
      provide: USER_SERVICE_TOKEN,
      useClass: UserService
    }
  ]
})
export class AppModule {}
