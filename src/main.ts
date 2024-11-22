import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 8080);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000'); // Địa chỉ của frontend

  // Cấu hình CORS cho phép yêu cầu từ frontend
  app.enableCors({
    origin: frontendUrl, // Lấy từ biến môi trường
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(port);
  console.log(`🚀 Ứng dụng đang chạy tại: http://localhost:${port}`);
}

bootstrap();
