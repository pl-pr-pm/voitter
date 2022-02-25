import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class UserInfoCache {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getCache(key: string) {
    try {
      return await this.cacheManager.get(key);
    } catch (e) {
      console.log(e.message());
    }
  }

  async setCache(key: string, value: any) {
    try {
      return await this.cacheManager.set(key, value);
    } catch (e) {
      console.log(e.message());
    }
  }

  async deleteCache(key: string) {
    try {
      return await this.cacheManager.del(key);
    } catch (e) {
      console.log(e.message());
    }
  }
}
