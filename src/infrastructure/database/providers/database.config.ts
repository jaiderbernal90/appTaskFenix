import { User } from '@/src/domain/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: configService.get<string>('DB_PATH'),
  entities: [User],
  synchronize: configService.get<boolean>('TYPEORM_SYNC', false),
  logging: configService.get<boolean>('TYPEORM_LOGGING', false)
});
