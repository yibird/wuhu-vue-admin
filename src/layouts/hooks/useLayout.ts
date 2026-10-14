import { useAppStore } from '@/store'
import { useGlobalSearch, useLockScreen } from '../config'
import { useGlobalShortcuts, usePreferences } from '../preferences'

export function useLayout() {
  const { header, tabs } = useAppStore()

  const { preferencesOpen, closePreferences } = usePreferences()
  const { searchOpen } = useGlobalSearch()
  const { isLocked } = useLockScreen()

  const fixedHeader = computed(() => header.value.fixed)
  const showTabs = computed(() => tabs.value.show)

  /**
   * 搜索面板首次打开后再挂载
   *
   * 用 v-if 跟随 searchOpen 会在关闭时立刻卸载组件,离开动画不会播放;
   * 首次打开后保持挂载,既能保留懒加载,又可以让关闭动画完整播放。
   */
  const searchMounted = shallowRef(false)
  watch(
    searchOpen,
    (open) => {
      if (open) searchMounted.value = true
    },
    { immediate: true }
  )

  useGlobalShortcuts()

  const contentStyle = computed(() => {
    const minHeight = !fixedHeader.value
      ? '100%'
      : tabs.value
        ? 'calc(100% - 90px)'
        : 'calc(100% - 50px)'
    return {
      'min-height': minHeight,
    }
  })
  return {
    fixedHeader,
    showTabs,
    contentStyle,
    preferencesOpen,
    searchOpen,
    searchMounted,
    isLocked,
    closePreferences,
  }
}
