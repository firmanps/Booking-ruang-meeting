import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 5000);
  const allowedOrigins = (
    configService.get<string>('CORS_ORIGINS') ?? 'http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.set('trust proxy', 1);
  app.use(helmet());
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.enableShutdownHooks();

  await app.listen(port);
}
void bootstrap();
