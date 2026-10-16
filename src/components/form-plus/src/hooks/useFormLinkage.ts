import { computed } from 'vue'
import type { FormPlusContext, FormPlusSchema } from '../types'

/**
 * 联动链路的最大深度,用于阻断环形联动
 */
const MAX_LINKAGE_DEPTH = 5

interface UseFormLinkageOptions {
  /**
   * @desc 表单项配置
   */
  schemas: () => readonly FormPlusSchema[]
  /**
   * @desc 获取联动上下文
   */
  getContext: () => FormPlusContext
}

/**
 * 字段联动调度
 *
 * 不深监听模型:通过控件事件与实例写入入口调用 dispatch(field),
 * 仅执行把该字段声明为依赖(deps)的联动函数,复杂度为 O(受影响联动数) 而非 O(字段数)。
 */
export function useFormLinkage(options: UseFormLinkageOptions) {
  let depth = 0

  /**
   * 依赖字段 -> 依赖它的 schema 集合(只收集声明了 linkage 的项)
   */
  const dependencyIndex = computed(() => {
    const index = new Map<string, FormPlusSchema[]>()

    for (const schema of options.schemas()) {
      if (!schema.linkage) continue

      for (const dep of schema.deps ?? []) {
        const list = index.get(dep)
        if (list) list.push(schema)
        else index.set(dep, [schema])
      }
    }

    return index
  })

  function run(targets: readonly FormPlusSchema[]) {
    if (!targets.length) return

    depth += 1
    try {
      for (const schema of targets) {
        try {
          const result = schema.linkage?.(options.getContext())
          if (result instanceof Promise) {
            result.catch((error: unknown) => {
              console.error(`[form-plus] ${schema.field} 联动执行失败`, error)
            })
          }
        } catch (error) {
          console.error(`[form-plus] ${schema.field} 联动执行失败`, error)
        }
      }
    } finally {
      depth -= 1
    }
  }

  /**
   * 字段变化后派发联动
   *
   * @param field 发生变化的字段
   */
  function dispatch(field: string) {
    if (depth >= MAX_LINKAGE_DEPTH) return

    const dependents = dependencyIndex.value.get(field)
    if (!dependents?.length) return

    run(dependents)
  }

  /**
   * 执行全部联动,用于首屏初始化
   */
  function runAll() {
    run(options.schemas().filter((schema) => Boolean(schema.linkage)))
  }

  return {
    dispatch,
    runAll,
  }
}
