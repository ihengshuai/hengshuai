/**
 * 浏览器存储
 */

import { isObject } from '../utils';

enum STORAGE_TYPE {
  LOCAL = 'localStorage',
  SESSION = 'sessionStorage',
}

type IField = { val: any; exp: any };
type StorageRecord = Record<string, IField | Record<string, IField>>;

abstract class IStorage {
  protected __field: string;
  abstract field(k: string): this;
  abstract get(k: string | number): any;
  abstract set(k: string | number, v: any): this;
  abstract clear(): this;
  abstract remove(k: string): this;
  abstract has(k: string): boolean;
  get kind(): typeof StorageManager {
    return StorageManager;
  }
}

class LocalStorage extends IStorage {
  protected __type: STORAGE_TYPE.LOCAL | STORAGE_TYPE.SESSION;

  constructor() {
    super();
    this.__type = STORAGE_TYPE.LOCAL;
  }

  field(k?: string): this {
    this.__field = k;
    return this;
  }

  get(k?: string) {
    const storage = this.parseStorage();
    if (!k && !this.__field) {
      return storage || null;
    } else if (!k || !this.__field) {
      return storage[this.__field] || storage[k] || null;
    }
    const field = storage[this.__field];
    const parsedField = (field || {}) as StorageRecord;
    return parsedField?.[k]?.val;
  }

  set(k: string | number, v: any = null) {
    const storage = this.getStorage();
    if (!this.__field) {
      storage.setItem(
        k as unknown as any,
        JSON.stringify({
          val: v,
          exp: +new Date() + 1000 * 60 * 60 * 24,
        }),
      );
      return this;
    }
    const collection = JSON.parse(storage[this.__field] || '{}');
    collection[k] = {
      val: v,
      exp: +new Date() + 1000 * 60 * 60 * 24,
    };
    storage.setItem(this.__field, JSON.stringify(collection));
    return this;
  }

  remove(k?: string) {
    const storage = this.getStorage();
    if (!k || !this.__field) {
      storage.removeItem(this.__field || k);
    } else {
      const collection = JSON.parse(storage[this.__field] || null);
      delete collection[k];
      storage.setItem(this.__field, JSON.stringify(collection));
    }
    return this;
  }

  has(k: string) {
    if (!k) return false;
    const storage = this.parseStorage();
    if (!this.__field) {
      const { val, exp } = storage[k] || {};
      return !!val;
    }
    const { val, exp } = (storage?.[this.__field] as StorageRecord)?.[k] || {};
    return !!val;
  }

  clear(): this {
    this.getStorage()?.clear();
    return this;
  }

  get end(): this {
    this.__field = undefined;
    return this;
  }

  private parseStorage(): StorageRecord {
    const storage = this.getStorage();
    return Object.keys(storage).reduce((p, k) => {
      p[k] = JSON.parse(storage[k]);
      return p;
    }, {} as StorageRecord);
  }

  private getStorage(): Storage {
    if (this.__type === STORAGE_TYPE.LOCAL) return localStorage;
    return sessionStorage;
  }
}

class SessionStorage extends LocalStorage {
  constructor() {
    super();
    this.__type = STORAGE_TYPE.SESSION;
  }
}

export class StorageManager {
  private static __type: STORAGE_TYPE;

  public static get local() {
    this.__type = STORAGE_TYPE.LOCAL;
    return new LocalStorage();
  }

  public static get session() {
    this.__type = STORAGE_TYPE.SESSION;
    return new SessionStorage();
  }
}

window.store = StorageManager;
