import { Injectable } from '@nestjs/common'
import { CacheRepository } from '../cache-repository'
import { RedisService } from './redis.service'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    const TTL = 60 * 15 // 15 minutes
    await this.redis.set(key, value, 'EX', TTL)
  }

  get(key: string): Promise<string | null> {
    const value = this.redis.get(key)

    return value
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
