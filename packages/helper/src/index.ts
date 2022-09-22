export * from './storage';
export * from './service';
export * from './utils';

/**
 * 判断执行环境
 * @eg: ssr、csr
 */
// window.__isBrower__ = !!(window || document)
console.log(__isBrowser__);
console.log(__isDev__);
