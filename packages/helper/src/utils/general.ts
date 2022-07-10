/**
 * 通用方法
 */

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
