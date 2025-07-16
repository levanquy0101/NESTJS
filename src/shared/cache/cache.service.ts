import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('REDIS_CLIENT') private redisClient: Redis,
  ) {}

  /**
   * Lấy giá trị từ cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      console.error(`❌ Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Lưu giá trị vào cache
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      console.log(`✅ Cache set: ${key}`);
    } catch (error) {
      console.error(`❌ Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Xóa key khỏi cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      console.log(`🗑️ Cache deleted: ${key}`);
    } catch (error) {
      console.error(`❌ Cache delete error for key ${key}:`, error);
    }
  }

  /**
   * Xóa tất cả cache
   */
  async reset(): Promise<void> {
    try {
      // Cache manager v7 không có method reset, sử dụng Redis flushdb
      await this.redisClient.flushdb();
      console.log('🔄 Cache reset completed');
    } catch (error) {
      console.error('❌ Cache reset error:', error);
    }
  }

  /**
   * Lấy tất cả keys theo pattern
   */
  async getKeys(pattern: string): Promise<string[]> {
    try {
      return await this.redisClient.keys(pattern);
    } catch (error) {
      console.error(`❌ Get keys error for pattern ${pattern}:`, error);
      return [];
    }
  }

  /**
   * Kiểm tra key có tồn tại không
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`❌ Check exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Tăng giá trị counter
   */
  async increment(key: string, value = 1): Promise<number> {
    try {
      return await this.redisClient.incrby(key, value);
    } catch (error) {
      console.error(`❌ Increment error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Giảm giá trị counter
   */
  async decrement(key: string, value = 1): Promise<number> {
    try {
      return await this.redisClient.decrby(key, value);
    } catch (error) {
      console.error(`❌ Decrement error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Set expiration cho key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.redisClient.expire(key, seconds);
      return result === 1;
    } catch (error) {
      console.error(`❌ Expire error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Lấy thời gian còn lại của key
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.redisClient.ttl(key);
    } catch (error) {
      console.error(`❌ TTL error for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Cache với fallback function
   */
  async getOrSet<T>(
    key: string,
    fallback: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    let value = await this.get<T>(key);
    
    if (value === null) {
      value = await fallback();
      await this.set(key, value, ttl);
    }
    
    return value;
  }

  /**
   * Cache multiple keys
   */
  async mget(keys: string[]): Promise<(any | null)[]> {
    try {
      return await this.redisClient.mget(...keys);
    } catch (error) {
      console.error('❌ MGET error:', error);
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple keys
   */
  async mset(keyValues: Record<string, any>, ttl?: number): Promise<void> {
    try {
      await this.redisClient.mset(keyValues);
      
      if (ttl) {
        for (const key of Object.keys(keyValues)) {
          await this.expire(key, ttl);
        }
      }
      
      console.log(`✅ Cache mset: ${Object.keys(keyValues).length} keys`);
    } catch (error) {
      console.error('❌ MSET error:', error);
    }
  }

  /**
   * Lấy thông tin cache stats
   */
  async getStats(): Promise<{
    totalKeys: number;
    memoryUsage: string;
    connectedClients: number;
  }> {
    try {
      const info = await this.redisClient.info();
      const keyspace = await this.redisClient.dbsize();
      
      return {
        totalKeys: keyspace,
        memoryUsage: info.match(/used_memory_human:(\S+)/)?.[1] || '0B',
        connectedClients: 1, // Simplified - không lấy client list
      };
    } catch (error) {
      console.error('❌ Get stats error:', error);
      return {
        totalKeys: 0,
        memoryUsage: '0B',
        connectedClients: 0,
      };
    }
  }
} 