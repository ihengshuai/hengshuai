import { describe, expect, test } from '@jest/globals';

import {
  isString,
  isBoolean,
  isArray,
  isNumber,
  isNull,
  isUndefined,
  isObject,
  isFunction,
  isDate,
  isRegExp,
  isError,
  isMap,
  isWeakMap,
  isSet,
  isWeakSet,
  isSymbol,
  isPromise,
  isClass,
  isInstanceOf,
  isArrayBuffer,
  isDataView,
  isExpectType,
  isSameType,
  isEmtryObject,
  isEmtry,
  getClassType,
  getTypeString,
  hasProperty,
} from '../../src/utils/type';

async function asyncFun() {
  return await 2;
}

function fetchData() {
  return asyncFun();
}

class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

describe('type util test', () => {
  test('test declare type', () => {
    // string
    expect(isString('str')).toBeTruthy();
    expect(isString(null)).not.toBeTruthy();
    expect(isString([])).toBeFalsy();

    // boolean
    expect(isBoolean(true)).not.toBeFalsy();
    expect(isBoolean('true')).not.toBeTruthy();
    expect(isBoolean(Symbol('x'))).toBeFalsy();

    // array
    expect(isArray([1, 2])).toBeTruthy();
    expect(isArray(false)).toBeFalsy();

    // number
    expect(isNumber(1)).toBeTruthy();
    expect(isNumber('')).toBeFalsy();

    // Null
    expect(isNull(null)).toBeTruthy();
    expect(isNull(undefined)).toBeFalsy();
    expect(isNull([])).toBeFalsy();

    // undefined
    expect(isUndefined(undefined)).toBeTruthy();
    expect(isUndefined(false)).toBeFalsy();

    // object
    expect(isObject({})).toBeTruthy();
    expect(isObject([])).toBeFalsy();

    // funtion
    expect(isFunction(() => false)).toBeTruthy();
    expect(isFunction(2)).toBeFalsy();

    // Date
    expect(isDate(new Date())).toBeTruthy();
    expect(isDate(2)).toBeFalsy();

    // regexp
    expect(isRegExp(/\.w+/i)).toBeTruthy();
    expect(isRegExp('')).toBeFalsy();

    // error
    expect(isError(new Error('error'))).toBeTruthy();
    expect(isError(false)).toBeFalsy();

    // map
    expect(isMap(new Map())).toBeTruthy();
    expect(isMap(new Set())).toBeFalsy();

    // weakmap
    expect(isWeakMap(new WeakMap())).toBeTruthy();
    expect(isWeakMap(new Map())).toBeFalsy();

    // set
    expect(isSet(new Set())).toBeTruthy();
    expect(isSet(new Map())).toBeFalsy();

    // weakset
    expect(isWeakSet(new WeakSet())).toBeTruthy();
    expect(isWeakSet(new Set())).toBeFalsy();

    // Symbol
    expect(isSymbol(Symbol('sign'))).toBeTruthy();
    expect(isSymbol(false)).toBeFalsy();

    // promsie
    expect(isPromise(Promise.resolve(true))).toBeTruthy();
    expect(isPromise(fetchData())).toBeTruthy();
    expect(isPromise(() => 2)).toBeFalsy();

    // class
    expect(isClass(class App {})).toBeTruthy();
    expect(isClass(new Object())).toBeFalsy();

    // isInstanceOf
    expect(isInstanceOf(User, new User('ming'))).toBeTruthy();
    expect(isInstanceOf(User, { name: 'ming' })).toBeFalsy();

    // arraybuffer
    expect(isArrayBuffer(new ArrayBuffer(2))).toBeTruthy();
    expect(isArrayBuffer(new Array(2))).toBeFalsy();

    // dataview
    expect(isDataView(new DataView(new ArrayBuffer(2)))).toBeTruthy();
    expect(isDataView(new Blob([new ArrayBuffer(2)]))).toBeFalsy();
  });

  test('test isSameType and isExpectType', () => {
    expect(isExpectType({}, 'object')).toBeTruthy();
    expect(isSameType([1], [2])).toBeTruthy();
    expect(isSameType([1], new ArrayBuffer(2))).toBeFalsy();
    expect(isSameType(null, undefined)).toBeFalsy();
  });

  test('test emtry methods', () => {
    expect(isEmtryObject({})).toBeTruthy();
    expect(isEmtryObject({ name: 'ming' })).toBeFalsy();
    expect(isEmtry(null)).toBeTruthy();
    expect(isEmtry(undefined)).toBeTruthy();
    expect(isEmtry('')).toBeTruthy();
    expect(isEmtry('xxx')).toBeFalsy();
    expect(isEmtry(true)).toBeFalsy();
  });

  test('test getClassType method', () => {
    expect(getClassType(null)).toBe(null);
    expect(getClassType(undefined)).toBe(undefined);
    expect(getClassType('')).toBe(String);
    expect(getClassType(1)).toBe(Number);
    expect(getClassType(true)).toBe(Boolean);
    expect(getClassType([])).toBe(Array);
    expect(getClassType(new User('jest'))).toBe(User);
    expect(getClassType(User)).toBe(User);
    expect(getClassType(Symbol('jest'))).toBe(Symbol);
    expect(getClassType(new Error('error'))).toBe(Error);
    expect(getClassType(new Date())).toBe(Date);
    expect(getClassType({})).toBe(Object);
  });

  test('test getTypeString method', () => {
    expect(getTypeString(null)).toBe('null');
    expect(getTypeString('')).toBe('string');
    expect(getTypeString(true)).toBe('boolean');
  });

  test('test hasProperty method', () => {
    const proto = Object.create({ name: 'helper' });
    expect(hasProperty(proto, 'name')).toBeFalsy();
    expect(hasProperty({ name: 'jest' }, 'name')).toBeTruthy();
    expect(hasProperty('', 'name')).toBeFalsy();
  });
});
