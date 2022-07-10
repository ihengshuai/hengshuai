/**
 * 浏览器存储
 */

type StorageType = 'local' | 'session';
class Storage {
  /**
   * storage类型
   */
  private _storageType: StorageType = 'local';
  /**
   * 设置storage类型栈
   */
  private _storageTypeStack: StorageType[] = ['local'];
  private static _instance: Storage;

  public static get instance(): Storage {
    if (!this._instance) {
      this._instance = new Storage();
    }
    return this._instance;
  }

  public set(key: string, val: any): Storage {
    const storage = this.getStorage();
    storage.setItem(key, JSON.stringify(val));
    return this;
  }

  public get(key: string): any {
    const storage = this.getStorage();
    const val = storage.getItem(key);
    if (val) {
      return JSON.parse(val);
    }
    return null;
  }

  public has(key: string): boolean {
    const storage = this.getStorage();
    return storage.getItem(key) !== null;
  }

  public delete(key: string): Storage {
    const storage = this.getStorage();
    storage.removeItem(key);
    return this;
  }

  public use(type: StorageType): Storage {
    this._storageTypeStack.push(type);
    this._storageType = type;
    return this;
  }

  public back(): Storage {
    if (this._storageTypeStack.length > 1) {
      this._storageType = this._storageTypeStack.pop();
    }
    return this;
  }

  public clear(): Storage {
    const storage = this.getStorage();
    storage.clear();
    return this;
  }

  private getStorage(): globalThis.Storage {
    if (!!localStorage || !!sessionStorage)
      throw new Error('浏览器不支持localStorage或sessionStorage');

    if (this._storageType === 'local') {
      return localStorage;
    }
    return sessionStorage;
  }
}

export const storage = Storage.instance;
