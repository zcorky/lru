
export interface Option {
  maxAge: number;
}

export interface LRU<K, T> {
  get(key: K, option?: Option): T | undefined;
  set(key: K, value: T, option?: Option): void;
  // remove(key: string): void;
  // removeAll(): void;
  // forEach(fn: Function): void;
  // toJSON(): object;
  // toString(): string;
  hits(): Hits
  hasKey(key: K): boolean
}

export interface Hits {
  count: number
  rate: number
}

export interface Item<T> {
  expired?: number;
  value?: T
}

function getNow(): number {
  return Date.now();
}

export class lru<K, T> implements LRU<K, T> { // tslint:disable-line
  private size = 0;
  private cache = new Map<K, Item<T>>();
  private _cache = new Map<K, Item<T>>();
  private _hitCount = 0;
  private _missCount = 0;

  constructor(private limit: number = 10) {
  }

  public static create<K, T>(limit: number) {
    return new lru<K, T>(limit);
  }

  public get(key: K, option?: Option): T | undefined {
    let item: Item<T> | undefined = this.cache.get(key);
    const maxAge = option && option.maxAge;
    if (item) {
      if (item.expired && getNow() > item.expired) {
        // @miss
        this._missCount ++;

        item.expired = 0;
        item.value = undefined;
      } else {
        // @hit
        this._hitCount ++;

        if (maxAge !== undefined) {
          const expired = maxAge ? getNow() + maxAge : 0;
          item.expired = expired
        }
      }

      return item.value;
    }

    item = this._cache.get(key);
    if (item) {
      if (item.expired && getNow() > item.expired) {
        // @miss
        this._missCount ++;

        item.expired = 0;
        item.value = undefined;
      } else {
        // @hit
        this._hitCount ++;

        this._updateCache(key, item);

        if (maxAge !== undefined) {
          const expired = maxAge ? getNow() + maxAge : 0;
          item.expired = expired;
        }
      }

      return item.value;
    }

    // @miss
    this._missCount ++;
  }

  public set(key: K, value: T, option?: Option): void {
    const maxAge = option && option.maxAge;
    const expired = maxAge ? getNow() + maxAge : 0;
    let item: Item<T> | undefined = this.cache.get(key);

    if (item) {
      item.expired = expired;
      item.value = value;
    } else {
      item = { expired, value };
      this._updateCache(key, item);
    }
  }

  private _updateCache(key, item) {
    this.cache.set(key, item);
    this.size++;
    if (this.size >= this.limit) {
      this.size = 0;
      this._cache = this.cache;
      this.cache = new Map();
    }
  }

  public hasKey(key: K) {
    if (this.cache.has(key) || this.cache.has(key)) {
      const data = this.get(key);
      return data !== undefined;
    }

    return false;
  }

  public hits() {
    return {
      count: this._hitCount,
      rate: this._hitCount / ((this._hitCount + this._missCount) || 1),
    };
  }
}

export default lru;
