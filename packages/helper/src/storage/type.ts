export enum IExpireType {
  NERVER = '-1',
  ALWAYS = '1',
}

export type IExpire = IExpireType | number;
export type IField = { val: any; exp: any };
export enum STORAGE_TYPE {
  LOCAL = 'localStorage',
  SESSION = 'sessionStorage',
  INDEX_DB = 'indexDB',
}

export abstract class IStorage {
  protected __field: string;
  abstract field(k: string): this;
  abstract get(k: any): any;
  abstract set(k: any, v: any): this;
  abstract clear(): this;
  abstract remove(k: string): this;
  abstract has(k: string): boolean;
  get kind(): typeof StorageManager {
    return StorageManager;
  }
}
