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

  const changeCollapsed = (screen: boolean) => {
    const nextCollapsed = screen
    if (sider.value.collapsed === nextCollapsed) return
    setCollapsed(nextCollapsed)
  }

  watch(isSmallScreen, (screen) => changeCollapsed(screen))

  return {
    isSmallScreen,
    breakpoints,
    setCollapsed,
  }
}
