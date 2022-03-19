import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./src/secrets/private.key'),
    cert: fs.readFileSync('./src/secrets/certificate.crt'),
    ca: fs.readFileSync('./src/secrets/ca_bundle.crt'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // フロントエンドでcookieを利用できるように設定
  }); // prefligntリクエストも全てのoriginから許可
  await app.listen(3001);
}
bootstrap();
