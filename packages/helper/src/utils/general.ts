/**
 * 通用方法
 */

import { DeepMerge, IDict } from '@/global';
import { isEmpty, isObject, isString } from './type';

/**
 * 节流函数
 * @param fn 目标函数
 * @param delay 延迟时间
 * @returns
 */
export function throttle(fn: Function, delay = 500) {
  let timer: any;
  return function (this: any, ...args: any[]) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 防抖函数
 * @param fn 目标函数
 * @param delay 延迟时间
 * @returns
 */
export function debounce(fn: Function, delay = 500) {
  let timer: any;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 函数柯理化
 * @param fn 目标函数
 * @param args 参数
 * @returns
 */
export function curry(fn: Function, ...args: any[]) {
  return function curried(this: any, ...args1: any[]) {
    if (args.concat(args1).length >= fn.length) {
      return fn.apply(this, args.concat(args1));
    } else {
      return function (this: any, ...args2: any[]) {
        return curried.apply(this, args1.concat(args2));
      };
    }
  };
}

/**
 * compose函数
 * @param fns 函数数组
 * @returns
 */
export function compose(...fns: Function[]) {
  return function (this: any, ...args: any[]) {
    let i = fns.length;
    while (i--) {
      args = [fns[i].apply(this, args)];
    }
    return args[0];
  };
}

/**
 * 队列执行
 * @param queue 待执行的队列
 * @param fn 每个队列的载体
 * @param cb 执行完后的回调
 */
export const runQueue = (queue: Function[], fn: Function, cb: Function) => {
  const step = (idx: number) => {
    if (idx >= queue.length) {
      return cb();
    }
    if (queue[idx]) {
      fn(queue[idx], () => {
        step(idx + 1);
      });
    } else {
      step(idx + 1);
    }
  };
  step(0);
};

/**
 * 下划线转换驼峰
 */
export function snakeToCamel(data: IDict<any> | any[] | string): any {
  if (data) {
    if (typeof data === 'string') {
      return data.replace(/_([^_])/gi, ($0, $1) => $1.toUpperCase());
    } else if (typeof data === 'number' || typeof data === 'boolean') {
      return data;
    } else {
      const res: any = data.constructor === Array ? [] : {};
      for (const key in data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const value = data[key];
        res[snakeToCamel(key) as string] =
          typeof value !== 'object' || value === null
            ? value
            : snakeToCamel(value);
      }
      return res;
    }
  }
  return data;
}

/**
 * 判断是否是浏览器环境
 */
export function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * 等待指定时间
 */
export function sleep(wait = 500, result?: any) {
  return new Promise((resolve) => setTimeout(() => resolve(result), wait));
}

/** 空函数 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

/**
 * 转换字符串query成对象形式
 * @param qs 字符串query
 */
export function qs2obj(qs: string): Record<string, any> {
  const res: Record<string, any> = {};
  let child: Array<string>;
  qs &&
    qs.split('&').forEach((item: string) => {
      res[(child = item.split('='))[0]] = child[1] || null;
    });
  return res;
}

/**
 * 转换对象query位string
 * @param obj 对象query
 */
export function obj2qs(obj: Record<string, any>): string {
  let res = '';
  let val: string;
  obj &&
    Object.keys(obj).forEach((prop: string) => {
      res += '&' + prop;
      (val = obj[prop]) !== null && (res += '=' + val);
    });
  return res.substring(1);
}

/**
 * 将query拼接到url上
 * @param baseURL 地址
 * @param query 字符串或对象query
 */
export function queryToStrURL(
  baseURL: string | null | undefined,
  query: string | Record<string, any>,
): string {
  let hash = null;
  let search = null;
  if (isString(query)) {
    query = qs2obj(query);
  }
  baseURL = (baseURL || '')
    .replace(/#.*$/, function ($0) {
      hash = $0;
      return '';
    })
    .replace(/\?[^#]*/, function ($0) {
      search = $0;
      return '';
    });
  const qsObj = Object.assign(
    qs2obj((search || (search = '')).substring(1)),
    query,
  );
  Object.keys(qsObj).forEach(
    (item) => isEmpty(qsObj[item]) && delete qsObj[item],
  );
  const qs = obj2qs(qsObj);

  return baseURL + (qs ? '?' : '') + qs + (hash || (hash = ''));
}

/**
 * 排除对象中的key
 * @param obj 源对象
 * @param keys 要排除的key
 */
export function omit<T extends Record<any, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result: Partial<T> = {};
  if (!obj) {
    return result as Omit<T, K>;
  }
  if (!keys || keys.length === 0) {
    return obj as Omit<T, K>;
  }
  Object.keys(obj).forEach((key) => {
    if (!keys.includes(key as K)) {
      result[key as keyof T] = obj[key as keyof T];
    }
  });
  return result as Omit<T, K>;
}

/**
 * 取对象中的key
 * @param obj 源对象
 * @param keys 要取的key
 */
export function pick<T extends Record<any, any>, K extends keyof T = any>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  const result: Partial<Pick<T, K>> = {};
  keys.forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  });
  return result as Pick<T, K>;
}

export function deepMerge<T, U>(target: T, source: U): DeepMerge<T, U> {
  if (isObject(target) && isObject(source)) {
    const merged: any = { ...target };

    for (const key in source) {
      if (isObject(source[key])) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        merged[key] = deepMerge(target[key as any], source[key]);
      } else {
        merged[key] = source[key];
      }
    }

    return merged;
  }

  return source as DeepMerge<T, U>;
}
