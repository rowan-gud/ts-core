import {
  isBoolean,
  isNull,
  isNullish,
  isNumber,
  isNumeric,
  isNumericString,
  isPrimitive,
  isString,
  isSymbol,
  isUndefined,
} from '../primitive';

describe('type Guards', () => {
  describe('isString', () => {
    it('should return true for string values', () => {
      expect(isString('hello')).toBe(true);
    });

    it('should return false for non-string values', () => {
      expect(isString(123)).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString(Symbol('symbol'))).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for number values', () => {
      expect(isNumber(123)).toBe(true);
    });

    it('should return false for non-number values', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(true)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber(Symbol('symbol'))).toBe(false);
    });
  });

  describe('isNumericString', () => {
    it('should return true for numeric string values', () => {
      expect(isNumericString('123')).toBe(true);
    });

    it('should return false for non-numeric string values', () => {
      expect(isNumericString('abc')).toBe(false);
      expect(isNumericString('123abc')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isNumericString(123)).toBe(false);
      expect(isNumericString(true)).toBe(false);
      expect(isNumericString(null)).toBe(false);
      expect(isNumericString(undefined)).toBe(false);
      expect(isNumericString(Symbol('symbol'))).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for boolean values', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-boolean values', () => {
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean(Symbol('symbol'))).toBe(false);
    });
  });

  describe('isSymbol', () => {
    it('should return true for symbol values', () => {
      expect(isSymbol(Symbol('symbol'))).toBe(true);
    });

    it('should return false for non-symbol values', () => {
      expect(isSymbol('symbol')).toBe(false);
      expect(isSymbol(123)).toBe(false);
      expect(isSymbol(true)).toBe(false);
      expect(isSymbol(null)).toBe(false);
      expect(isSymbol(undefined)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should return true for undefined values', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return false for non-undefined values', () => {
      expect(isUndefined('undefined')).toBe(false);
      expect(isUndefined(123)).toBe(false);
      expect(isUndefined(true)).toBe(false);
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(Symbol('symbol'))).toBe(false);
    });
  });

  describe('isNull', () => {
    it('should return true for null values', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false for non-null values', () => {
      expect(isNull('null')).toBe(false);
      expect(isNull(123)).toBe(false);
      expect(isNull(true)).toBe(false);
      expect(isNull(undefined)).toBe(false);
      expect(isNull(Symbol('symbol'))).toBe(false);
    });
  });

  describe('isPrimitive', () => {
    it('should return true for primitive values', () => {
      expect(isPrimitive('string')).toBe(true);
      expect(isPrimitive(123)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(Symbol('symbol'))).toBe(true);
      expect(isPrimitive(undefined)).toBe(true);
      expect(isPrimitive(null)).toBe(true);
    });

    it('should return false for non-primitive values', () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(isPrimitive(() => {})).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('should return true for numeric values', () => {
      expect(isNumeric(123)).toBe(true);
      expect(isNumeric('123')).toBe(true);
    });

    it('should return false for non-numeric values', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric(true)).toBe(false);
      expect(isNumeric(null)).toBe(false);
      expect(isNumeric(undefined)).toBe(false);
      expect(isNumeric(Symbol('symbol'))).toBe(false);
    });
  });

  describe('isNullish', () => {
    it('should return true for nullish values', () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });

    it('should return false for non-nullish values', () => {
      expect(isNullish('null')).toBe(false);
      expect(isNullish(123)).toBe(false);
      expect(isNullish(true)).toBe(false);
      expect(isNullish(Symbol('symbol'))).toBe(false);
    });
  });
});
