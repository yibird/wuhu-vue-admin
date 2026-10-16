import { getComponentName } from '@/router'
import { useTabs } from '@/hooks'
import { useAppStore } from '@/store'
import { isUrl } from '@/utils'

/** 缓存页面数上限,避免缓存过多实例占用内存 */
const MAX_PAGE_CACHE = 20
/** `pageCacheMax` 缺失或非法时的默认缓存页面数 */
const DEFAULT_PAGE_CACHE = 10
/**
 * 缓存页面数下限,至少保留一个缓存页
 *
 * 注意:Vue 中 `max` 为 0 表示不限制缓存,此处下限会覆盖该语义;
 * 如需支持"不限制",应单独区分 0 的取值。
 */
const MIN_PAGE_CACHE = 1

export function useKeepAlive() {
  const { allTabs, currentTab, excludes } = useTabs()
  const { app } = useAppStore()

  const max = computed(() => {
    const value = Number(app.value.pageCacheMax)
    return Number.isFinite(value)
      ? Math.min(MAX_PAGE_CACHE, Math.max(MIN_PAGE_CACHE, value))
      : DEFAULT_PAGE_CACHE
  })
  /**
   * 参与 KeepAlive 缓存的组件名集合
   *
   * 以字符串作为依赖,只有集合真正变化时才产出新数组;
   * 否则 Tab 每次切换都会让 KeepAlive 重新执行一轮 pruneCache
   */
  const includeKey = computed(() => {
    if (!app.value.pageCache) return ''

    const componentNames = new Set<string>()
    for (const tab of allTabs.value) {
      if (!tab?.keepAlive || !tab.path || isUrl(tab.path)) continue
      // 与刷新逻辑同源,优先使用 tab 上已写入的组件名
      const componentName = tab.componentName || getComponentName(tab.path)
      componentNames.add(componentName)
    }
    return [...componentNames].join(',')
  })
  const include = computed(() =>
    includeKey.value ? includeKey.value.split(',') : []
  )
  /**
   * 刷新期间临时排除的页面,被排除的页面不会写入 KeepAlive 缓存
   */
  const exclude = computed(() => excludes.value)
  /**
   * 当前页面是否正在刷新,刷新时先卸载页面,再重新挂载以重建页面实例
   */
  const refreshing = computed(() => {
    const componentName = currentTab.value?.componentName
    return !!componentName && excludes.value.includes(componentName)
  })

  return { include, exclude, max, refreshing }
}
