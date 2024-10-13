import { isArray, isArrayOf } from '../array';
import { isNumber } from '../primitive';

describe('isArray', () => {
  it('should return true for arrays', () => {
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray([])).toBe(true);
  });

  it('should return false for non-arrays', () => {
    expect(isArray('hello')).toBe(false);
    expect(isArray(123)).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
  });
});

describe('isArrayOf', () => {
  const isNumberArray = isArrayOf(isNumber);

  it('should return true for arrays of numbers', () => {
    expect(isNumberArray([1, 2, 3])).toBe(true);
    expect(isNumberArray([0, -1, 3.14])).toBe(true);
  });

  it('should return false for arrays with non-number elements', () => {
    expect(isNumberArray([1, '2', 3])).toBe(false);
    expect(isNumberArray(['1', '2', '3'])).toBe(false);
  });

  it('should return false for non-arrays', () => {
    expect(isNumberArray('hello')).toBe(false);
    expect(isNumberArray(123)).toBe(false);
    expect(isNumberArray({})).toBe(false);
    expect(isNumberArray(null)).toBe(false);
    expect(isNumberArray(undefined)).toBe(false);
  });
});
