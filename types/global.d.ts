declare type Nullable<T> = T | null;
declare type Key = keyof any;
declare type Recordable<T = any> = Record<Key, T>;
declare type EmptyFunc<T = any> = () => T;
declare type NotUndefined<T> = T extends undefined ? never : T;
declare type Expand<T> = T extends infer S ? { [K in keyof S]: S[K] } : never;
// declare type UnionType<T> = T extends infer T ? T : never;
// 联合函数类型转交叉函数类型
declare type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// 深度参数可选
declare type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
