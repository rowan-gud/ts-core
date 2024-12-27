import type { TypeGuard } from './guard';

import { isUnion } from './union';

export type Nullish = null | undefined;

export type Numeric = number | NumericString;
export type NumericString = `${number}`;
export type Primitive = boolean | null | number | string | symbol | undefined;

/**
 * Type guard for boolean values.
 *
 * @param value The value to check.
 * @returns True if the value is a boolean.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard for null values.
 *
 * @param value The value to check.
 * @returns True if the value is null.
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Type guard for number values.
 *
 * @param value The value to check.
 * @returns True if the value is a number.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Type guard for numeric strings.
 *
 * @param value The value to check.
 * @returns True if the value is a numeric string.
 */
export function isNumericString(value: unknown): value is NumericString {
  return isString(value) && !Number.isNaN(Number(value));
}

/**
 * Type guard for string values.
 *
 * @param value The value to check.
 * @returns True if the value is a string.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for symbol values.
 *
 * @param value The value to check.
 * @returns True if the value is a symbol.
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

/**
 * Type guard for undefined values.
 *
 * @param value The value to check.
 * @returns True if the value is undefined.
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Type guard for primitive values.
 *
 * @param value The value to check.
 * @returns True if the value is a primitive
 */
export const isPrimitive: TypeGuard<Primitive> = isUnion(
  isString,
  isNumber,
  isBoolean,
  isSymbol,
  isUndefined,
  isNull,
);

/**
 * Type guard for numeric values.
 *
 * @param value The value to check.
 * @returns True if the value is a number or a numeric string.
 */
export const isNumeric: TypeGuard<Numeric> = isUnion(isNumber, isNumericString);

/**
 * Type guard for nullish values.
 *
 * @param value The value to check.
 * @returns True if the value is undefined or null.
 */
export const isNullish: TypeGuard<Nullish> = isUnion(isUndefined, isNull);
