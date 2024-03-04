import { StorageManager } from './storage';

declare global {
  interface Window {
    __CONFIG__: Record<string | symbol, any>;
    store: StorageManager;
  }
  const __isBrowser__: boolean;
  const __isDev__: boolean;
}

export type IDict<T = string> = {
  [key: string]: T;
};

export type IDictNum<T = string> = {
  [key: number]: T;
};

export type IPrimitive = string | number | boolean | null | undefined;

export type IBasicTypeCtor =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor;

export type DeepMerge<T, U> = T extends object
  ? U extends object
    ? {
        [K in keyof (T & U)]: K extends keyof U
          ? K extends keyof T
            ? DeepMerge<T[K], U[K]>
            : U[K]
          : K extends keyof T
          ? T[K]
          : never;
      }
    : U
  : T;

export {};
