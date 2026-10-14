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
      componentNames.add(getComponentName(tab.path))
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
