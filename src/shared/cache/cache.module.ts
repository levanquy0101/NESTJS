import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import { RedisProvider } from './redis.provider';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: 'redis',
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: configService.get<number>('REDIS_TTL', 3600), // 1 hour default
        max: configService.get<number>('REDIS_MAX', 100), // max items in cache
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService, RedisProvider],
  exports: [CacheService, CacheModule],
})
export class SharedCacheModule {} 