/**
 * 浏览器存储
 */

import { isEmty, isNumber } from '../utils';

enum STORAGE_TYPE {
  LOCAL = 'localStorage',
  SESSION = 'sessionStorage',
}

enum IExpireType {
  NERVER = '-1',
  ALWAYS = '1',
}

type IExpire = IExpireType | number;
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
      const store = storage[this.__field] || storage[k] || {};
      if (this.isExpire(store?.exp)) {
        this.remove(k || this.__field);
        return null;
      }
      return store?.val || store || null;
    }
    const field = storage[this.__field];
    const parsedField = (field || {}) as StorageRecord;
    if (this.isExpire(parsedField?.[k]?.exp)) {
      this.remove(k);
      return null;
    }
    return parsedField?.[k]?.val || null;
  }

  set(k: string | number, v: any = null, expire: IExpire = IExpireType.NERVER) {
    if (!k) return this;
    const storage = this.getStorage();
    if (typeof expire === 'number') {
      expire = +new Date() + expire;
    }
    if (!this.__field) {
      storage.setItem(
        k as unknown as any,
        JSON.stringify({
          val: v,
          exp: expire,
        }),
      );
      return this;
    }
    const collection = JSON.parse(storage[this.__field] || '{}');
    collection[k] = {
      val: v,
      exp: expire,
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
      if (val) {
        const isExpire = this.isExpire(exp);
        if (isExpire) {
          this.remove(k);
        }
        return !isExpire;
      }
      return false;
    }
    const { val, exp } = (storage?.[this.__field] as StorageRecord)?.[k] || {};
    if (val) {
      const isExpire = this.isExpire(exp);
      if (isExpire) {
        this.remove(k);
      }
      return !isExpire;
    }
    return false;
  }

  expire(k?: string) {
    const storage = this.parseStorage();
    if (!k && !this.__field) return true;
    if (!k || !this.__field) {
      const { exp } = (storage?.[k] || storage?.[this.__field]) as IField;
      return this.isExpire(exp);
    }
    const { exp } = (storage?.[this.__field] as StorageRecord)?.[k] || {};
    return this.isExpire(exp);
  }

  private isExpire(exp: IExpire) {
    if (isEmty(exp)) return false;
    if (exp === IExpireType.NERVER) return false;
    if (exp === IExpireType.ALWAYS) return true;
    if (!isNumber(exp)) return true;
    if (+new Date() > exp) return true;
    return false;
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
