import { Module, Global } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheInterceptor } from './cache.interceptor';
import { redisProvider } from './redis.provider';

@Global()
@Module({
  providers: [
    redisProvider,
    CacheService,
    CacheInterceptor,
  ],
  exports: [
    CacheService,
    CacheInterceptor,
  ],
})
export class SharedCacheModule {}
