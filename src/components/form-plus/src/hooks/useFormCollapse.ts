import { computed, ref, watch } from 'vue'
import type { FormPlusCollapse, FormPlusSchema } from '../types'

interface UseFormCollapseOptions {
  /**
   * @desc 表单项配置
   */
  schemas: () => readonly FormPlusSchema[]
  /**
   * @desc 折叠配置,false 表示关闭
   */
  collapse: () => FormPlusCollapse | false | undefined
  /**
   * @desc 字段是否显示
   */
  isVisible: (field: string) => boolean
  /**
   * @desc 折叠状态变化回调
   */
  onCollapseChange?: (collapsed: boolean) => void
}

/**
 * 查询表单折叠
 *
 * 只负责切分「首屏可见」与「折叠区」两组 schema,被折叠的项由外层用 v-if 卸载:
 * 模型独立于渲染,因此折叠不会丢值,提交时仍带上隐藏字段。
 */
export function useFormCollapse(options: UseFormCollapseOptions) {
  /**
   * 归一化后的折叠配置,false/undefined 表示不启用
   */
  const config = computed<FormPlusCollapse | undefined>(() => {
    const value = options.collapse()
    return value === false ? undefined : value
  })

  const enabled = computed(() => config.value !== undefined)

  /**
   * 首屏可见数量
   *
   * 就是配置值本身,不做「对齐整行」的换算:栅格列数支持按断点配置,
   * 真实列数随视口变化,静态配置无法推导,硬算只会让结果随配置形状漂移
   * (例如最小列数为 2 时,宽屏下会白白折叠掉本可一行的字段)。
   */
  const visibleCount = computed(() =>
    Math.max(1, config.value?.visibleCount ?? 3)
  )

  /**
   * 当前实际显示的项(已排除联动隐藏的字段)
   */
  const visibleSchemas = computed(() =>
    options.schemas().filter((schema) => options.isVisible(schema.field))
  )

  const canCollapse = computed(
    () => enabled.value && visibleSchemas.value.length > visibleCount.value
  )

  const collapsed = ref(config.value?.defaultCollapsed ?? true)

  /**
   * 常驻渲染的前 N 项:折叠与展开都只渲染这一段,折叠区由 extraSchemas 单独承载,
   * 避免展开时与折叠区重复渲染
   */
  const primarySchemas = computed(() =>
    canCollapse.value
      ? visibleSchemas.value.slice(0, visibleCount.value)
      : visibleSchemas.value
  )

  const extraSchemas = computed(() =>
    canCollapse.value ? visibleSchemas.value.slice(visibleCount.value) : []
  )

  watch(collapsed, (value) => options.onCollapseChange?.(value))

  // 跟随配置里的初始折叠态,便于父级异步就绪后再决定折叠状态
  watch(
    () => config.value?.defaultCollapsed,
    (value) => {
      if (value === undefined) return
      collapsed.value = value
    }
  )

  function toggleCollapse(value?: boolean) {
    const next = value ?? !collapsed.value
    if (next === collapsed.value) return
    collapsed.value = next
  }

  /**
   * 恢复初始折叠态
   */
  function resetCollapse() {
    if (!enabled.value) return
    toggleCollapse(config.value?.defaultCollapsed ?? true)
  }

  return {
    collapsed,
    canCollapse,
    visibleCount,
    primarySchemas,
    extraSchemas,
    toggleCollapse,
    resetCollapse,
  }
}
