import { isEnum } from '../enum';

describe('isEnum', () => {
  it('should return true for valid enum values (array)', () => {
    const isDirection = isEnum(['up', 'down', 'left', 'right']);
    expect(isDirection('up')).toBe(true);
    expect(isDirection('down')).toBe(true);
    expect(isDirection('left')).toBe(true);
    expect(isDirection('right')).toBe(true);
  });

  it('should return false for invalid enum values (array)', () => {
    const isDirection = isEnum(['up', 'down', 'left', 'right']);
    expect(isDirection('diagonal')).toBe(false);
    expect(isDirection('')).toBe(false);
    expect(isDirection(null)).toBe(false);
    expect(isDirection(undefined)).toBe(false);
  });

  it('should return true for valid enum values (object)', () => {
    enum Direction {
      Up = 'up',
      Down = 'down',
      Left = 'left',
      Right = 'right',
    }
    const isDirection = isEnum(Direction);
    expect(isDirection('up')).toBe(true);
    expect(isDirection('down')).toBe(true);
    expect(isDirection('left')).toBe(true);
    expect(isDirection('right')).toBe(true);
  });

  it('should return false for invalid enum values (object)', () => {
    enum Direction {
      Up = 'up',
      Down = 'down',
      Left = 'left',
      Right = 'right',
    }
    const isDirection = isEnum(Direction);
    expect(isDirection('diagonal')).toBe(false);
    expect(isDirection('')).toBe(false);
    expect(isDirection(null)).toBe(false);
    expect(isDirection(undefined)).toBe(false);
  });

  it('should handle numeric enums', () => {
    enum NumericEnum {
      One = 1,
      Two,
      Three,
    }
    const isNumeric = isEnum(NumericEnum);
    expect(isNumeric(1)).toBe(true);
    expect(isNumeric(2)).toBe(true);
    expect(isNumeric(3)).toBe(true);
    expect(isNumeric(4)).toBe(false);
  });

  it('should handle mixed enums', () => {
    enum MixedEnum {
      One = 1,
      Two = 'two',
      Three = 3,
    }
    const isMixed = isEnum(MixedEnum);
    expect(isMixed(1)).toBe(true);
    expect(isMixed('two')).toBe(true);
    expect(isMixed(3)).toBe(true);
    expect(isMixed('three')).toBe(false);
  });
});
