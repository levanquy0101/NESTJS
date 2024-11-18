import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 8080);

  await app.listen(port);
  console.log(`🚀 Ứng dụng đang chạy tại: http://localhost:${port}`);
}

bootstrap();
