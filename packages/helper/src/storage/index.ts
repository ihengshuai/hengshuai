/**
 * 浏览器存储
 */
import { STORAGE_TYPE } from './type';
import { LocalStorage, SessionStorage } from './storage';

export class StorageManager {
  private static __type: STORAGE_TYPE;

  public static get local() {
    if (!__isBrowser__) return;
    this.__type = STORAGE_TYPE.LOCAL;
    return new LocalStorage();
  }

  public static get session() {
    if (!__isBrowser__) return;
    this.__type = STORAGE_TYPE.SESSION;
    return new SessionStorage();
  }

  public static get indexdb() {
    if (!__isBrowser__) return;
    this.__type = STORAGE_TYPE.INDEX_DB;
    return indexedDB;
  }
}

window && (window.store = StorageManager);
