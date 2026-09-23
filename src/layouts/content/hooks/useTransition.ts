import { useAppStore } from '@/store'

/**
 * 内容区顶部占位高度:header 50 + tabs 40,与 useLayout 的 contentStyle 保持一致
 *
 * @param tabsVisible - tabs 是否展示
 * @returns 顶部占位高度(px)
 */
function getTopOffset(tabsVisible: boolean) {
  return tabsVisible ? 90 : 50
}

export function useTransition() {
  const { animation, tabs } = useAppStore()

  const pageAnimation = computed(() => animation.value.pageAnimation)
  const pageAnimationMode = computed(() => animation.value.pageAnimationMode)
  const loadingAnimation = computed(() => animation.value.loadingAnimation)
  /**
   * 加载态尺寸:固定为内容区可视高度,
   * 否则新页面渲染后会把容器撑高,导致 loading 偏离垂直居中
   */
  const loadingStyle = computed(() => ({
    height: `calc(100vh - ${getTopOffset(tabs.value.show)}px)`,
  }))
  return {
    pageAnimation,
    pageAnimationMode,
    loadingAnimation,
    loadingStyle,
  }
}
