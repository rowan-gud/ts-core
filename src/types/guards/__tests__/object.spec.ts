import { isPlainObject, isPlainObjectOf, isShapedObject } from '../object';
import { isNumber, isString } from '../primitive';

describe('isPlainObject', () => {
  it('should return true for plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject(new Date())).toBe(true);
  });

  it('should return false for non-plain objects', () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject('string')).toBe(false);
  });
});

describe('isPlainObjectOf', () => {
  const isNumberObject = isPlainObjectOf(isNumber);

  it('should return true for plain objects with number values', () => {
    expect(isNumberObject({ a: 1, b: 2 })).toBe(true);
  });

  it('should return false for plain objects with non-number values', () => {
    expect(isNumberObject({ a: 1, b: '2' })).toBe(false);
  });

  it('should return false for non-plain objects', () => {
    expect(isNumberObject([])).toBe(false);
    expect(isNumberObject(null)).toBe(false);
  });
});

describe('isShapedObject', () => {
  const isPerson = isShapedObject({
    name: isString,
    age: isNumber,
  });

  it('should return true for objects matching the shape', () => {
    expect(isPerson({ name: 'Alice', age: 30 })).toBe(true);
  });

  it('should return false for objects not matching the shape', () => {
    expect(isPerson({ name: 'Alice', age: '30' })).toBe(false);
    expect(isPerson({ name: 'Alice' })).toBe(false);
  });

  it('should return true for objects with extra keys when strict is false', () => {
    expect(isPerson({ name: 'Alice', age: 30, foo: 'bar' })).toBe(true);
  });

  it('should return false for objects with extra keys when strict is true', () => {
    expect(isPerson({ name: 'Alice', age: 30, foo: 'bar' }, true)).toBe(false);
  });

  it('should return false for non-plain objects', () => {
    expect(isPerson([])).toBe(false);
    expect(isPerson(null)).toBe(false);
  });
});
