import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Vite moves to another port when 5173 is taken, so allow any localhost
  // origin in development rather than pinning a single one.
  const configured = process.env.CLIENT_ORIGIN;
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (configured && origin === configured) return callback(null, true);
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
        return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed`), false);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Cabin photos and avatars live on disk, served back at /uploads/<file>.
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`proDashboard API listening on http://localhost:${port}`);
}

bootstrap();
