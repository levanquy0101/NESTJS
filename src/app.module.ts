// src/app.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { LoggerMiddleware } from './middleware/logger.middleware'; // Import LoggerMiddleware

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => databaseConfig(configService),
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)  // Áp dụng middleware để log
      .forRoutes('*');  // Áp dụng cho tất cả các route
  }
}
