import { makeCacheKey } from './analyticsHelpers';

export class PersistentCacheManager {
  private memoryStorage: Map<string, any> = new Map();
  public version = 1;

  private performanceMetrics = {
    setOperations: 0,
    getOperations: 0,
    removeOperations: 0,
    totalSetTime: 0,
    totalGetTime: 0,
    totalRemoveTime: 0
  };

  private validateCacheData(data: any): boolean {
    try {
      if (!data) return false;
      if (data.orders && !Array.isArray(data.orders)) return false;
      if (data.lastUpdatedAt && isNaN(Date.parse(data.lastUpdatedAt))) return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  private async getPersistentStorage(): Promise<Map<string, any>> {
    return this.memoryStorage;
  }

  async set<T>(key: string, value: T, ttl: number = 30 * 60 * 1000): Promise<void> {
    const startTime = performance.now();
    
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Invalid cache key');
      }

      if (!this.validateCacheData(value)) {
        throw new Error('Invalid cache data structure');
      }

      const storage = await this.getPersistentStorage();
      const entry = {
        value,
        timestamp: Date.now(),
        ttl,
        key,
        version: this.version
      };
      
      storage.set(key, entry);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem(key, JSON.stringify(entry));
        } catch (e) {
        }
      }
      await this.enforceSizeLimit(50);
      
    } catch (error) {
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      this.performanceMetrics.setOperations++;
      this.performanceMetrics.totalSetTime += duration;
    }
  }

  async get<T>(key: string): Promise<{ value: T; timestamp: number } | null> {
    const startTime = performance.now();
    
    try {
      const storage = await this.getPersistentStorage();
      let entry = storage.get(key);
      
      if (!entry && typeof window !== 'undefined' && window.localStorage) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            entry = JSON.parse(stored);
            storage.set(key, entry);
          }
        } catch (e) {
          await this.remove(key);
          return null;
        }
      }

      if (!entry) {
        return null;
      }

      const isExpired = Date.now() - entry.timestamp > entry.ttl;
      if (isExpired) {
        await this.remove(key);
        return null;
      }

      if (!this.validateCacheData(entry.value)) {
        await this.remove(key);
        return null;
      }

      return { value: entry.value, timestamp: entry.timestamp };
    } catch (error) {
      await this.remove(key);
      return null;
    } finally {
      const duration = performance.now() - startTime;
      this.performanceMetrics.getOperations++;
      this.performanceMetrics.totalGetTime += duration;
    }
  }

  async remove(key: string): Promise<void> {
    const startTime = performance.now();
    
    try {
      const storage = await this.getPersistentStorage();
      storage.delete(key);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
        }
      }
    } catch (error) {
    } finally {
      const duration = performance.now() - startTime;
      this.performanceMetrics.removeOperations++;
      this.performanceMetrics.totalRemoveTime += duration;
    }
  }

  async emergencyReset(shop: string): Promise<void> {
    const keys = [
      makeCacheKey(shop, "orders"),
    ];
    
    for (const key of keys) {
      await this.remove(key);
    }
  }

  async cleanAllExpired(): Promise<number> {
    let cleanedCount = 0;
    const storage = await this.getPersistentStorage();
    const now = Date.now();
    
    for (const [key, entry] of storage.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        await this.remove(key);
        cleanedCount++;
      }
    }
    
    if (typeof window !== 'undefined' && window.localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('::analytics::')) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const entry = JSON.parse(stored);
              if (now - entry.timestamp > entry.ttl) {
                localStorage.removeItem(key);
                cleanedCount++;
              }
            }
          } catch (e) {
            localStorage.removeItem(key);
            cleanedCount++;
          }
        }
      }
    }
    
    return cleanedCount;
  }

  async enforceSizeLimit(maxSize: number = 100): Promise<void> {
    const storage = await this.getPersistentStorage();
    if (storage.size <= maxSize) return;
    
    const entries = Array.from(storage.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
    const toRemove = storage.size - maxSize;
    for (let i = 0; i < toRemove; i++) {
      await this.remove(entries[i][0]);
    }
  }

  getStats() {
    return {
      size: this.memoryStorage.size,
      version: this.version
    };
  }

  getPerformanceReport() {
    const avgSetTime = this.performanceMetrics.setOperations > 0 
      ? this.performanceMetrics.totalSetTime / this.performanceMetrics.setOperations 
      : 0;
    
    const avgGetTime = this.performanceMetrics.getOperations > 0 
      ? this.performanceMetrics.totalGetTime / this.performanceMetrics.getOperations 
      : 0;
    
    const avgRemoveTime = this.performanceMetrics.removeOperations > 0 
      ? this.performanceMetrics.totalRemoveTime / this.performanceMetrics.removeOperations 
      : 0;

    return {
      operations: {
        set: this.performanceMetrics.setOperations,
        get: this.performanceMetrics.getOperations,
        remove: this.performanceMetrics.removeOperations
      },
      averageTimes: {
        set: parseFloat(avgSetTime.toFixed(2)),
        get: parseFloat(avgGetTime.toFixed(2)),
        remove: parseFloat(avgRemoveTime.toFixed(2))
      },
      totalTimes: {
        set: parseFloat(this.performanceMetrics.totalSetTime.toFixed(2)),
        get: parseFloat(this.performanceMetrics.totalGetTime.toFixed(2)),
        remove: parseFloat(this.performanceMetrics.totalRemoveTime.toFixed(2))
      }
    };
  }

  healthReport() {
    const now = Date.now();
    let expiredCount = 0;
    let validCount = 0;

    for (const entry of this.memoryStorage.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++;
      } else {
        validCount++;
      }
    }

    const total = this.memoryStorage.size;
    const health = total > 0 ? validCount / total : 1;

    return {
      total: total,
      valid: validCount,
      expired: expiredCount,
      health: health,
      sizeInfo: {
        memorySize: total,
        recommendedMax: 50,
        needsCleaning: total > 50
      }
    };
  }
}

export const cacheManager = new PersistentCacheManager();