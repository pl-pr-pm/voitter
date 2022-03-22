import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
function readCsrfToken(req) {
  return req.csrfToken();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: true,
      HttpOnly: true,
      Secure: true,
      SameSite: 'None',
      path: '/',
      value: readCsrfToken,
    }),
  );
  app.enableCors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true, // フロントエンドでcookieを利用できるように設定
  }); // prefligntリクエストも全てのoriginから許可
  await app.listen(80);
}
bootstrap();
