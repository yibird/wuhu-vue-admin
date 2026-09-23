import { getComponentName } from '@/router'
import { useTabs } from '@/hooks'
import { useAppStore } from '@/store'
import { isUrl } from '@/utils'

export function useKeepAlive() {
  const { allTabs, currentTab, excludes } = useTabs()
  const { app } = useAppStore()

  const max = computed(() => {
    const value = Number(app.value.pageCacheMax)
    return Number.isFinite(value) ? Math.min(20, Math.max(1, value)) : 10
  })
  const include = computed(() => {
    if (!app.value.pageCache) return []

    const componentNames = new Set<string>()
    for (const tab of allTabs.value) {
      if (!tab?.keepAlive || !tab.path || isUrl(tab.path)) continue
      componentNames.add(getComponentName(tab.path))
    }
    return [...componentNames]
  })
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
