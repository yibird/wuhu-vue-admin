export {}

declare global {
  type Nullable<T> = T | null
  type NotNullable<T> = T extends null | undefined ? never : T
  type Recordable<T = unknown> = Record<string, T>
  type Maybe<T> = T | null | undefined
  type Noop = (...p: unknown[]) => void
  type ValuesOf<T> = T[keyof T]
  type ModuleType<T = Record<string, unknown>> =
    | Record<string, unknown>
    | { default: T }
  interface Fn {
    (): void
  }
  type AnyFunction = (...args: unknown[]) => unknown

  type ArrayToUnion<T extends readonly unknown[]> = T[number]

  type GetOptional<T> = {
    [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P]
  }
  type GetRequired<T> = {
    [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P]
  }
  type TupleToUnion<T> = T extends Array<infer ITEMS> ? ITEMS : never
  type UnionToIntersection<U> = (
    U extends unknown ? (arg: U) => void : never
  ) extends (arg: infer I) => void
    ? I
    : never
}
