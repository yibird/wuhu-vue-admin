export {}

declare global {
  type Nullable<T> = T | null
  type NotNullable<T> = T extends null | undefined ? never : T
  type Recordable<T = any> = Record<string, T>
  type Maybe<T> = T | null | undefined
  type Noop = (...p: any) => void
  type ValuesOf<T> = T[keyof T]
  type ModuleType<T = Record<string, any>> =
    | Record<string, any>
    | { default: T }
  interface Fn {
    (): void
  }
  type AnyFunction = (...args: any[]) => any

  type ArrayToUnion<T extends any[]> = T[number]

  type GetOptional<T> = {
    [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P]
  }
  type GetRequired<T> = {
    [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P]
  }
  type TupleToUnion<T> = T extends Array<infer ITEMS> ? ITEMS : never
  type UnionToIntersection<U> = (
    U extends any ? (arg: U) => any : never
  ) extends (arg: infer I) => void
    ? I
    : never
}
