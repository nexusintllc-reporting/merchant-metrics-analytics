// Simple in-memory cache for product data
const cache = new Map();

interface CacheEntry {
  data: any;
  timestamp: number;
  shop: string;
}

export function setCache(key: string, data: any, shop: string) {
  cache.set(key, { 
    data, 
    timestamp: Date.now(),
    shop 
  });
}

export function getCache(key: string, shop: string, maxAgeMs = 300000) { // 5 minutes default
  const cached = cache.get(key);
  
  if (!cached) return null;
  
  // Check if cache belongs to same shop and is not expired
  if (cached.shop !== shop || Date.now() - cached.timestamp > maxAgeMs) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}