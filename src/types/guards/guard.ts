import type { ArrayLike } from './array';

export type GuardIntersectionType<T> = T extends [
  TypeGuard<infer U>,
  ...infer V,
]
  ? GuardIntersectionTypeHelper<V> & U
  : T extends ArrayLike<TypeGuard<infer U>>
    ? U
    : never;

export type GuardType<T> = T extends TypeGuard<infer U> ? U : never;

export type GuardUnionType<T> =
  T extends ArrayLike<TypeGuard<infer U>> ? U : never;

export type TypeGuard<T = unknown> = (value: unknown) => value is T;

export type TypeGuardArray<T = unknown> =
  | Array<TypeGuard<T>>
  | ReadonlyArray<TypeGuard<T>>;

type GuardIntersectionTypeHelper<T> = T extends []
  ? unknown
  : T extends [TypeGuard<infer U>, ...infer V]
    ? GuardIntersectionTypeHelper<V> & U
    : never;
