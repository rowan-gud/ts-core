import { describe, expect, it } from 'vitest';

import type { TypeGuard } from '../guard';

import { isUnion } from '../union';

// Example type guards
const isNumber: TypeGuard<number> = (value): value is number =>
  typeof value === 'number';
const isString: TypeGuard<string> = (value): value is string =>
  typeof value === 'string';
const isBoolean: TypeGuard<boolean> = (value): value is boolean =>
  typeof value === 'boolean';

describe('isUnion', () => {
  it('should return true if the value is a number or a string', () => {
    const isNumberOrString = isUnion(isNumber, isString);

    expect(isNumberOrString(42)).toBe(true);
    expect(isNumberOrString('hello')).toBe(true);
    expect(isNumberOrString(true)).toBe(false);
  });

  it('should return true if the value is a number, string, or boolean', () => {
    const isNumberStringOrBoolean = isUnion(isNumber, isString, isBoolean);

    expect(isNumberStringOrBoolean(42)).toBe(true);
    expect(isNumberStringOrBoolean('hello')).toBe(true);
    expect(isNumberStringOrBoolean(true)).toBe(true);
    expect(isNumberStringOrBoolean({})).toBe(false);
  });

  it('should return false if no guards are provided', () => {
    const isNothing = isUnion();

    expect(isNothing(42)).toBe(false);
    expect(isNothing('hello')).toBe(false);
    expect(isNothing(true)).toBe(false);
  });

  it('should return false if the value does not match any guard', () => {
    const isNumberOrString = isUnion(isNumber, isString);

    expect(isNumberOrString({})).toBe(false);
    expect(isNumberOrString([])).toBe(false);
    expect(isNumberOrString(null)).toBe(false);
    expect(isNumberOrString(undefined)).toBe(false);
  });
});
