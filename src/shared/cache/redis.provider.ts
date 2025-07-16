import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {    
    const redisPassword = configService.get<string>('REDIS_PASSWORD');
    
    // Check if password is not configured or empty
    if (!redisPassword || redisPassword.trim() === '') {
      console.log('⚠️ REDIS_PASSWORD is not configured or empty, skipping Redis connection');
      return null;
    }

    const redisConfig = {
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: redisPassword,
      lazyConnect: false,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
      // Disable automatic reconnection on connection errors
      retryDelayOnClusterDown: 0,
      maxRetriesPerRequest: 0,
      retryDelayOnFailover: 0,
      enableOfflineQueue: false,
    };

    const redis = new Redis(redisConfig);

    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redis.on('ready', () => {
      console.log('🚀 Redis is ready to accept commands');
    });

    redis.on('error', (error) => {
      console.error('❌ Redis connection error');
      // Close connection on error to prevent reconnection attempts
      redis.disconnect();
    });

    redis.on('close', () => {
      console.log('🔌 Redis connection closed');
    });

    redis.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    return redis;
  },
  inject: [ConfigService],
};
