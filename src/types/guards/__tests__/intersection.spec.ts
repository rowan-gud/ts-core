import { isIntersection } from '../intersection';

interface A {
  a: number;
}

interface B {
  b: string;
}

const isA = (value: unknown): value is A => {
  return typeof value === 'object' && value !== null && 'a' in value;
};

const isB = (value: unknown): value is B => {
  return typeof value === 'object' && value !== null && 'b' in value;
};

const isAAndB = isIntersection(isA, isB);

describe('isIntersection', () => {
  it('should return true for objects that satisfy all guards', () => {
    expect(isAAndB({ a: 1, b: 'hello' })).toBe(true);
  });

  it('should return false for objects that do not satisfy all guards', () => {
    expect(isAAndB({ a: 1 })).toBe(false);
    expect(isAAndB({ b: 'hello' })).toBe(false);
    expect(isAAndB({ a: 1, b: 'hello', c: true })).toBe(true); // Extra properties are allowed
  });

  it('should return false for non-object values', () => {
    expect(isAAndB(null)).toBe(false);
    expect(isAAndB(undefined)).toBe(false);
    expect(isAAndB(42)).toBe(false);
    expect(isAAndB('string')).toBe(false);
    expect(isAAndB(true)).toBe(false);
  });

  it('should handle empty guards array', () => {
    const isEmptyIntersection = isIntersection();
    expect(isEmptyIntersection({})).toBe(true); // Always true for empty guards
  });
});
