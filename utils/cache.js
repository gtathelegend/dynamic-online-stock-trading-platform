class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key, value, ttlSeconds) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  async getOrSet(key, ttlSeconds, resolver) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const freshValue = await resolver();
    this.set(key, freshValue, ttlSeconds);
    return freshValue;
  }
}

module.exports = new MemoryCache();