import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import './common/prototype.extensions';
import { HttpExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://192.168.0.129:4200',
      'https://amsmarmita-front.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'authorization',
      'Content-Type',
      'userid',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Origin',
    ],
    maxAge: 86400,
  });
  app.use(
    helmet({
      hsts: { maxAge: 31536000 },
      frameguard: { action: 'deny' },
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'frame-ancestors': ["'none'"],
        },
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
