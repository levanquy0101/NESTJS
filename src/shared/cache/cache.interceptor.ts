import { Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

export interface CacheOptions {
  ttl?: number;
  key?: string;
  prefix?: string;
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private cacheService: CacheService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Chỉ cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    // Tạo cache key
    const cacheKey = this.generateCacheKey(request);
    
    // Thử lấy từ cache trước
    const cachedResponse = await this.cacheService.get(cacheKey);
    if (cachedResponse) {
      console.log(`📦 Cache hit: ${cacheKey}`);
      return of(cachedResponse);
    }

    // Nếu không có trong cache, thực hiện request và cache kết quả
    return next.handle().pipe(
      tap(async (response) => {
        if (response) {
          await this.cacheService.set(cacheKey, response, 3600); // 1 hour default
          console.log(`💾 Cache stored: ${cacheKey}`);
        }
      }),
    );
  }

  private generateCacheKey(request: any): string {
    const { method, url, query, params, body } = request;
    
    // Tạo key từ method, url và query params
    let key = `${method}:${url}`;
    
    // Thêm query params nếu có
    if (Object.keys(query).length > 0) {
      key += `:${JSON.stringify(query)}`;
    }
    
    // Thêm params nếu có
    if (Object.keys(params).length > 0) {
      key += `:${JSON.stringify(params)}`;
    }
    
    // Thêm body nếu có (cho POST/PUT requests)
    if (body && Object.keys(body).length > 0) {
      key += `:${JSON.stringify(body)}`;
    }
    
    return key;
  }
}

// Decorator để áp dụng cache cho specific routes
export const CacheResponse = (options: CacheOptions = {}) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const cacheService = this.cacheService;
      if (!cacheService) {
        return originalMethod.apply(this, args);
      }
      
      const cacheKey = options.key || `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
      const ttl = options.ttl || 3600;
      
      // Thử lấy từ cache
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }
      
      // Thực hiện method và cache kết quả
      const result = await originalMethod.apply(this, args);
      await cacheService.set(cacheKey, result, ttl);
      
      return result;
    };
    
    return descriptor;
  };
}; 