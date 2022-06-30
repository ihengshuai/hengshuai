import "reflect-metadata"

export function throttle(cb: Function, delay: number) {
  let timeout: number | undefined;
  return function () {
    if (timeout) {
      return;
    }
    timeout = setTimeout(() => {
      cb();
      timeout = undefined;
    }, delay);
  };
}
