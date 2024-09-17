import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { User } from '@entities/user.entity';
import { AuthController } from '@controllers/auth/auth.controller';
import { AuthService } from '@services/auth/auth.service';
import { UsersController } from '@controllers/users/users.controller';
import { UsersService } from '@services/users/users.service';
import { JwtStrategy } from '@utils/strategies/jwt.strategy';
import { AUTH_SERVICE_TOKEN } from '@interfaces/services/IAuthService.interface';
import { USERS_SERVICE_TOKEN } from '@interfaces/services/IUserService.interface';
import { TASKS_SERVICE_TOKEN } from '@interfaces/services/ITaskService.interface';
import { typeOrmConfig } from './infrastructure/database/providers/database.config';
import { TasksController } from './application/controllers/tasks/tasks.controller';
import UsersRepository from './infrastructure/database/repositories/users.repository';
import { TasksService } from './application/services/tasks/tasks.service';
import { Task } from '@entities/task.entity';
import TasksRepository from './infrastructure/database/repositories/tasks.repository';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '4h' }
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([User, Task])
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    TasksController
  ],
  providers: [
    AppService,
    JwtStrategy,
    UsersRepository,
    TasksRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: TASKS_SERVICE_TOKEN,
      useClass: TasksService
    },
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthService
    },
    {
      provide: USERS_SERVICE_TOKEN,
      useClass: UsersService
    }
  ]
})
export class AppModule {}
