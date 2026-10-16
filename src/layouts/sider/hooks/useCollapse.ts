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

  const changeCollapsed = (collapsed: boolean) => {
    if (sider.value.collapsed === collapsed) return
    setCollapsed(collapsed)
  }

  // 只在小屏自动收起:桌面端不主动展开,否则每次挂载都会把用户持久化的收起状态改回去
  watch(
    isSmallScreen,
    (screen) => {
      if (screen) changeCollapsed(true)
    },
    { immediate: true }
  )

  return {
    isSmallScreen,
    breakpoints,
    setCollapsed,
  }
}
