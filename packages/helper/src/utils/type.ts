export function getTypeString(type: any): string {
  return Object.prototype.toString.call(type).slice(8, -1).toLowerCase();
}

export function isArray(type: any): boolean {
  return getTypeString(type) === 'array';
}

export function isObject(type: any): boolean {
  return getTypeString(type) === 'object';
}

export function isString(type: any): boolean {
  return getTypeString(type) === 'string';
}

export function isNumber(type: any): boolean {
  return getTypeString(type) === 'number';
}

export function isBoolean(type: any): boolean {
  return getTypeString(type) === 'boolean';
}

export function isFunction(type: any): boolean {
  return getTypeString(type) === 'function';
}

export function isNull(type: any): boolean {
  return getTypeString(type) === 'null';
}

export function isUndefined(type: any): boolean {
  return getTypeString(type) === 'undefined';
}

export function isDate(type: any): boolean {
  return getTypeString(type) === 'date';
}

export function isRegExp(type: any): boolean {
  return getTypeString(type) === 'regexp';
}

export function isError(type: any): boolean {
  return getTypeString(type) === 'error';
}

export function isSymbol(type: any): boolean {
  return getTypeString(type) === 'symbol';
}

export function isPromise(type: any): boolean {
  return getTypeString(type) === 'promise';
}

export function isInstanceOf(type: any, instance: any): boolean {
  return instance instanceof type;
}

export function isClass(type: any): boolean {
  return type.prototype && type.prototype.constructor === type;
}

export function isMap(type: any): boolean {
  return getTypeString(type) === 'map';
}

export function isSet(type: any): boolean {
  return getTypeString(type) === 'set';
}

export function isWeakMap(type: any): boolean {
  return getTypeString(type) === 'weakmap';
}

export function isWeakSet(type: any): boolean {
  return getTypeString(type) === 'weakset';
}

export function isArrayBuffer(type: any): boolean {
  return getTypeString(type) === 'arraybuffer';
}

export function isDataView(type: any): boolean {
  return getTypeString(type) === 'dataview';
}

export function isSameType(type1: any, type2: any): boolean {
  return getTypeString(type1) === getTypeString(type2);
}

export function isExpectType(type: any, expectType: string): boolean {
  return getTypeString(type) === expectType;
}

export function isEmtry(type: any): boolean {
  return type === undefined || type === null || type === '';
}

export function isEmtryObject(type: any): boolean {
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
    return type.prototype
      ? type.prototype
      : Object.getPrototypeOf(type).constructor;
  }
}

export function hasProperty(target: any, k: any) {
  if (!isObject(target)) return false;
  return Object.prototype.hasOwnProperty.call(target, k);
}
