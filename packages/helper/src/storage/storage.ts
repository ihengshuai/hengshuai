import { hasProperty, isEmtry, isNumber } from '@/utils';
import { IExpire, IField, IExpireType, IStorage, STORAGE_TYPE } from './type';

type StorageRecord = Record<string, IField | Record<string, IField>>;

export class LocalStorage extends IStorage {
  protected __type: STORAGE_TYPE.LOCAL | STORAGE_TYPE.SESSION;

  constructor() {
    super();
    this.__type = STORAGE_TYPE.LOCAL;
  }

  field(k?: string): this {
    this.__field = k;
    return this;
  }

  get(k?: any) {
    const storage = this.parseStorage();
    if (!k && !this.__field) {
      return storage || null;
    } else if (!k || !this.__field) {
      if (!hasProperty(storage, k || this.__field)) return null;
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

  set(k: any, v: any = null, expire: IExpire = IExpireType.NERVER) {
    if (!k) return this;
    const storage = this.getStorage();
    if (
      isNumber(expire) &&
      expire !== IExpireType.NERVER &&
      expire !== IExpireType.ALWAYS
    ) {
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
    if (isEmtry(exp)) return false;
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
      let val: any;
      try {
        val = JSON.parse(storage[k]);
      } catch (err) {
        val = storage[k];
      }
      p[k] = val;
      return p;
    }, {} as StorageRecord);
  }

  private getStorage(): Storage {
    if (this.__type === STORAGE_TYPE.LOCAL) return localStorage;
    return sessionStorage;
  }
}

export class SessionStorage extends LocalStorage {
  constructor() {
    super();
    this.__type = STORAGE_TYPE.SESSION;
  }
}
