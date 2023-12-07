const _metadatas = new Map<any, any>();

export function getTypeString(type: any): string {
  return Object.prototype.toString.call(type).slice(8, -1).toLowerCase();
}

export function isArray(type: any): type is [] {
  return getTypeString(type) === 'array';
}

export function isObject(type: any): type is object {
  return getTypeString(type) === 'object';
}

export function isString(type: any): type is string {
  return getTypeString(type) === 'string';
}

export function isNumber(type: any): type is number {
  return getTypeString(type) === 'number';
}

export function isBoolean(type: any): type is boolean {
  return getTypeString(type) === 'boolean';
}

export function isFunction(type: any): type is Function {
  return getTypeString(type) === 'function';
}

export function isNull(type: any): type is null {
  return getTypeString(type) === 'null';
}

export function isUndefined(type: any): type is undefined {
  return getTypeString(type) === 'undefined';
}

export function isDate(type: any): type is Date {
  return getTypeString(type) === 'date';
}

export function isRegExp(type: any): type is RegExp {
  return getTypeString(type) === 'regexp';
}

export function isError(type: any): type is Error {
  return getTypeString(type) === 'error';
}

export function isSymbol(type: any): type is Symbol {
  return getTypeString(type) === 'symbol';
}

export function isPromise<T = any>(type: any): type is Promise<T> {
  return (
    (type && typeof type.then === 'function') ||
    getTypeString(type) === 'promise'
  );
}

export function isInstanceOf(type: any, instance: any): boolean {
  return instance instanceof type;
}

export function isClass(type: any): boolean {
  return type.prototype && type.prototype.constructor === type;
}

export function isMap<T = any, V = any>(type: any): type is Map<T, V> {
  return getTypeString(type) === 'map';
}

export function isSet<T = any>(type: any): type is Set<T> {
  return getTypeString(type) === 'set';
}

export function isWeakMap(type: any): type is WeakMap<any, any> {
  return getTypeString(type) === 'weakmap';
}

export function isWeakSet(type: any): type is WeakSet<any> {
  return getTypeString(type) === 'weakset';
}

export function isArrayBuffer(type: any): type is ArrayBuffer {
  return getTypeString(type) === 'arraybuffer';
}

export function isDataView(type: any): type is DataView {
  return getTypeString(type) === 'dataview';
}

export function isSameType(type1: any, type2: any): boolean {
  return getTypeString(type1) === getTypeString(type2);
}

export function isExpectType(type: any, expectType: string): boolean {
  return getTypeString(type) === expectType;
}

export function isEmpty(type: any, strict = true): boolean {
  return type === undefined || type === null || (strict ? type === '' : false);
}

export function isEmptyObject(type: any): boolean {
  return isObject(type) && Object.keys(type).length === 0;
}

export function getClassType(type: any): Function | null | undefined {
  if (isNull(type)) {
    return null;
  } else if (isUndefined(type)) {
    return undefined;
  } else if (isBoolean(type)) {
    return Boolean;
  } else if (isNumber(type)) {
    return Number;
  } else if (isString(type)) {
    return String;
  } else {
    return type?.prototype
      ? type.prototype?.constructor
      : Object.getPrototypeOf(type).constructor;
  }
}

export function hasProperty(target: any, k: any) {
  if (!isObject(target)) return false;
  return Object.prototype.hasOwnProperty.call(target, k);
}

export function setMetadata(type: any, metadata: any): void {
  if (!type || !metadata) throw new Error();
  _metadatas.set(type, metadata);
}

export function getMetadata(type: any): any {
  return _metadatas.get(type) || null;
}
