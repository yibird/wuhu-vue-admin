import { useAppStore } from '@/store'
import { preloadSearchModal, useGlobalSearch, useLockScreen } from '../config'
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

  /**
   * 空闲时预热全局搜索面板
   *
   * 面板首次打开才挂载,提前加载 chunk 与拼音库可消除首次打开的等待。
   * 使用 requestIdleCallback 避免与首屏渲染争抢主线程。
   */
  let idleCallbackId: number | undefined
  let preloadTimer: ReturnType<typeof setTimeout> | undefined

  onMounted(() => {
    const preload = () => {
      void preloadSearchModal()
    }
    if (typeof requestIdleCallback === 'function') {
      idleCallbackId = requestIdleCallback(preload, { timeout: 2000 })
    } else {
      preloadTimer = setTimeout(preload, 1000)
    }
  })

  onBeforeUnmount(() => {
    if (idleCallbackId !== undefined) cancelIdleCallback(idleCallbackId)
    if (preloadTimer) clearTimeout(preloadTimer)
  })

  const contentStyle = computed(() => {
    const minHeight = !fixedHeader.value
      ? '100%'
      : showTabs.value
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
