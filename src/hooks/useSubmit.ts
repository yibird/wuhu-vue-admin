/**
 * 管理异步提交状态，防止重复提交。
 *
 * @param func 执行提交的异步函数
 * @returns loading 提交状态和 run 提交方法
 */
export function useSubmit<R, P extends unknown[]>(
  func: (...args: P) => Promise<R>
) {
  const loading = ref(false)

  const run = async (...args: P): Promise<R | undefined> => {
    if (loading.value) return undefined
    try {
      loading.value = true
      return await func(...args)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    run,
  }
}
