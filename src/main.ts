import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // LIMIT REQUEST
  app.use(json({ limit: '60mb' }));

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT);
}
bootstrap();
