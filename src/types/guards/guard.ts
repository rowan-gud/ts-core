import { ArrayLike } from './array';

export type TypeGuard<T = unknown> = (value: unknown) => value is T;

export type TypeGuardArray<T = unknown> =
  | Array<TypeGuard<T>>
  | ReadonlyArray<TypeGuard<T>>;

export type GuardType<T> = T extends TypeGuard<infer U> ? U : never;

export type GuardUnionType<T> =
  T extends ArrayLike<TypeGuard<infer U>> ? U : never;

type GuardIntersectionTypeHelper<T> = T extends []
  ? unknown
  : T extends [TypeGuard<infer U>, ...infer V]
    ? U & GuardIntersectionTypeHelper<V>
    : never;

export type GuardIntersectionType<T> = T extends [
  TypeGuard<infer U>,
  ...infer V,
]
  ? U & GuardIntersectionTypeHelper<V>
  : T extends ArrayLike<TypeGuard<infer U>>
    ? U
    : never;
