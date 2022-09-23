import { StorageManager } from './storage';

declare global {
  interface Window {
    __CONFIG__: Record<string | symbol, any>;
    store: StorageManager;
  }
  const __isBrowser__: boolean;
  const __isDev__: boolean;
}

export {};
