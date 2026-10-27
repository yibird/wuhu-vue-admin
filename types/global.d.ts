export {}

declare global {
  /**
   * 表示一个可以为 null 的类型
   * @example let user: Nullable<string> = null;
   */
  type Nullable<T> = T | null

  /**
   * 排除 T 类型中的 null 和 undefined
   * @example type StrictString = NotNullable<string | null | undefined>; // 结果为 string
   */
  type NotNullable<T> = T extends null | undefined ? never : T

  /**
   * 构造一个键为 string、值为任意类型的对象类型
   * @example const data: Recordable<number> = { a: 1, b: 2 };
   */
  type Recordable<T = unknown> = Record<string, T>

  /**
   * 表示一个可能为 null 或 undefined 的类型 (类似可选参数)
   * @example let name: Maybe<string> = undefined;
   */
  type Maybe<T> = T | null | undefined

  /**
   * 表示一个无返回值的空函数类型
   * @example const handleError: Noop = () => { console.error('error') };
   */
  type Noop = (...p: unknown[]) => void

  /**
   * 获取对象所有 value 的联合类型
   * @example type T = ValueOf<{ a: string; b: number }>; // 结果为 string | number
   */
  type ValueOf<T> = T[keyof T]

  /**
   * 获取对象所有 key 的联合类型
   * @example type K = KeyOf<{ a: string; b: number }>; // 结果为 'a' | 'b'
   */
  type KeyOf<T> = keyof T

  /**
   * 模块类型，常用于动态导入或兼容 CommonJS/ESM 模块
   * 可能是一个普通的对象，也可能是一个包含 default 导出的对象
   * @example const mod: ModuleType<MyModule> = { default: myModule };
   */
  type ModuleType<T = Record<string, unknown>> =
    | Record<string, unknown>
    | { default: T }

  /**
   * 无参数、无返回值的函数接口定义
   * 注意：不建议常用此类型，尽量用 `() => void` 替代
   */
  interface Fn {
    (): void
  }

  /**
   * 任意函数类型 (接收任意参数，返回任意类型)
   * @example const fn: AnyFunction = (a, b) => a + b;
   */
  type AnyFunction = (...args: unknown[]) => unknown

  /**
   * 将数组/元组类型转换为其中元素的联合类型
   * @example type U = ArrayToUnion<['a', 'b', 'c']>; // 结果为 'a' | 'b' | 'c'
   */
  type ArrayToUnion<T extends readonly unknown[]> = T[number]

  /**
   * 获取对象中所有【可选】属性组成的子集
   * @example type Opt = GetOptional<{ a: string; b?: number }>; // 结果为 { b?: number }
   */
  type GetOptional<T> = {
    [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P]
  }

  /**
   * 获取对象中所有【必选】属性组成的子集
   * @example type Req = GetRequired<{ a: string; b?: number }>; // 结果为 { a: string }
   */
  type GetRequired<T> = {
    [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P]
  }

  /**
   * 元组/数组转换为联合类型 (与 ArrayToUnion 类似，但使用了 infer 推导)
   * @example type U = TupleToUnion<[string, number]>; // 结果为 string | number
   */
  type TupleToUnion<T> = T extends Array<infer ITEMS> ? ITEMS : never

  /**
   * 将联合类型转换为交叉类型
   *
   * @example type I = UnionToIntersection<{ a: 1 } | { b: 2 }>; // 结果为 { a: 1 } & { b: 2 }
   */
  type UnionToIntersection<U> = (
    U extends unknown ? (arg: U) => void : never
  ) extends (arg: infer I) => void
    ? I
    : never

  /**
   * 将对象 T 中的指定键 K 转为必选，其余保持不变
   * @example type User = { name?: string; age?: number };
   * type StrictNameUser = RequiredKeys<User, 'name'>;  // 结果为: { name: string; age?: number }
   */
  type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

  /**
   * 构建时由 webUpdateNotice 注入的运行时 API
   */
  interface Window {
    /**
     * 更新提示插件实例,仅生产构建存在
     */
    pluginWebUpdateNotice_?: {
      /**
       * 切换更新提示语言
       */
      setLocale: (locale: string) => void
    }
  }
}
