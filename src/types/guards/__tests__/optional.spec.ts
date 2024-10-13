import { isNullable, isOptional, isOptionalNullable } from '../optional';
import { isNumber, isString } from '../primitive';

describe('isOptional', () => {
  const isNumberOrUndefined = isOptional(isNumber);

  it('should return true for a number', () => {
    expect(isNumberOrUndefined(42)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isNumberOrUndefined(undefined)).toBe(true);
  });

  it('should return false for a string', () => {
    expect(isNumberOrUndefined('42')).toBe(false);
  });
});

describe('isNullable', () => {
  const isNumberOrNull = isNullable(isNumber);

  it('should return true for a number', () => {
    expect(isNumberOrNull(42)).toBe(true);
  });

  it('should return true for null', () => {
    expect(isNumberOrNull(null)).toBe(true);
  });

  it('should return false for a string', () => {
    expect(isNumberOrNull('42')).toBe(false);
  });
});

describe('isOptionalNullable', () => {
  const isNumberOrNullOrUndefined = isOptionalNullable(isNumber);

  it('should return true for a number', () => {
    expect(isNumberOrNullOrUndefined(42)).toBe(true);
  });

  it('should return true for null', () => {
    expect(isNumberOrNullOrUndefined(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isNumberOrNullOrUndefined(undefined)).toBe(true);
  });

  it('should return false for a string', () => {
    expect(isNumberOrNullOrUndefined('42')).toBe(false);
  });
});

describe('isOptional with isString', () => {
  const isStringOrUndefined = isOptional(isString);

  it('should return true for a string', () => {
    expect(isStringOrUndefined('hello')).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isStringOrUndefined(undefined)).toBe(true);
  });

  it('should return false for a number', () => {
    expect(isStringOrUndefined(42)).toBe(false);
  });
});

describe('isNullable with isString', () => {
  const isStringOrNull = isNullable(isString);

  it('should return true for a string', () => {
    expect(isStringOrNull('hello')).toBe(true);
  });

  it('should return true for null', () => {
    expect(isStringOrNull(null)).toBe(true);
  });

  it('should return false for a number', () => {
    expect(isStringOrNull(42)).toBe(false);
  });
});

describe('isOptionalNullable with isString', () => {
  const isStringOrNullOrUndefined = isOptionalNullable(isString);

  it('should return true for a string', () => {
    expect(isStringOrNullOrUndefined('hello')).toBe(true);
  });

  it('should return true for null', () => {
    expect(isStringOrNullOrUndefined(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isStringOrNullOrUndefined(undefined)).toBe(true);
  });

  it('should return false for a number', () => {
    expect(isStringOrNullOrUndefined(42)).toBe(false);
  });
});
