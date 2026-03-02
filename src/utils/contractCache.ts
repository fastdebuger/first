/**
 * 合同数据缓存工具（简单版）
 * 用于避免重复请求接口
 */

interface CacheItem {
  data: any;
  timestamp: number;
}

class ContractCache {
  private cache: Map<string, CacheItem> = new Map();
  private defaultExpireTime = 5 * 60 * 1000; // 默认5分钟

  /**
   * 生成缓存键
   */
  private getCacheKey(type: string, params: any): string {
    const sortedParams = JSON.stringify(params, Object.keys(params).sort());
    return `${type}:${sortedParams}`;
  }

  /**
   * 获取缓存数据
   */
  get(type: string, params: any): any | null {
    const key = this.getCacheKey(type, params);
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // 检查是否过期
    if (Date.now() - item.timestamp > this.defaultExpireTime) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  /**
   * 设置缓存数据
   */
  set(type: string, params: any, data: any): void {
    const key = this.getCacheKey(type, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 清除指定类型的缓存
   */
  clear(type?: string): void {
    if (type) {
      // 清除指定类型的所有缓存
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.startsWith(`${type}:`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      // 清除所有缓存
      this.cache.clear();
    }
  }
}

// 导出单例
export default new ContractCache();

