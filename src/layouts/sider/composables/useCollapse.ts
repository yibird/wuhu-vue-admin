import { useBreakpoints } from '@vueuse/core'
import { watch } from 'vue'
import { useAppStore } from '@/store'

const siderBreakpoints = {
  sm: 640,
} as const

export function useCollapse() {
  const { sider, setCollapsed } = useAppStore()
  const breakpoints = useBreakpoints(siderBreakpoints)
  const isSmallScreen = breakpoints.smaller('sm')

  const syncCollapsed = (smallScreen: boolean) => {
    const nextCollapsed = smallScreen
    if (sider.value.collapsed === nextCollapsed) return

    setCollapsed(nextCollapsed)
  }

  watch(
    isSmallScreen,
    (smallScreen) => {
      syncCollapsed(smallScreen)
    },
    { immediate: true }
  )

  return {
    isSmallScreen,
    breakpoints,
    setCollapsed,
  }
}
