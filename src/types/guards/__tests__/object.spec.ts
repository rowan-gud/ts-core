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
    age: isNumber,
    name: isString,
  });

  it('should return true for objects matching the shape', () => {
    expect(isPerson({ age: 30, name: 'Alice' })).toBe(true);
  });

  it('should return false for objects not matching the shape', () => {
    expect(isPerson({ age: '30', name: 'Alice' })).toBe(false);
    expect(isPerson({ name: 'Alice' })).toBe(false);
  });

  it('should return true for objects with extra keys when strict is false', () => {
    expect(isPerson({ age: 30, foo: 'bar', name: 'Alice' })).toBe(true);
  });

  it('should return false for objects with extra keys when strict is true', () => {
    expect(isPerson({ age: 30, foo: 'bar', name: 'Alice' }, true)).toBe(false);
  });

  it('should return false for non-plain objects', () => {
    expect(isPerson([])).toBe(false);
    expect(isPerson(null)).toBe(false);
  });
});
