let runtimePromise: Promise<typeof import('./runtime')> | undefined

/**
 * 按需加载 Univer 运行时(含 React/rxjs 与样式)
 * @returns Univer 运行时模块
 */
export function loadUniverRuntime() {
  runtimePromise ??= import('./runtime')
  return runtimePromise
}
