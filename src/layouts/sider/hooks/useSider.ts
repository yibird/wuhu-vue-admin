import { computed } from 'vue'
import { Drawer } from 'antdv-next'
import { useAppStore } from '@/store'
import { MenuMode } from '@/constants'
import { VerticalSider } from '../components'
import { useCollapse } from './useCollapse.ts'

const SPLIT_RAIL_WIDTH = 78

const components = {
  [MenuMode.Vertical]: VerticalSider,
  [MenuMode.Mix]: defineAsyncComponent(
    () => import('../components/mix-sider.vue')
  ),
  [MenuMode.Split]: defineAsyncComponent(
    () => import('../components/split-sider.vue')
  ),
}

export function useSider() {
  const { app, sider, setCollapsed } = useAppStore()

  const showSider = computed(() => sider.value.show)
  const menuMode = computed(() => app.value.menuMode)

  const { isSmallScreen } = useCollapse()

  /**
   * 内联渲染的侧边栏组件
   *
   * 横向菜单模式的导航由头部承载,整体隐藏侧边栏时也不渲染,两种情况都返回 null
   */
  const siderComponent = computed(() => {
    const mode = menuMode.value
    if (!showSider.value || mode === MenuMode.Horizontal) return null
    return components[mode]
  })

  const drawerOpen = computed({
    get: () => !sider.value.collapsed,
    set: (open: boolean) => setCollapsed(!open),
  })

  /** Split 模式是图标栏 + 菜单栏两列,抽屉需要容纳两列 */
  const drawerSize = computed(() =>
    menuMode.value === MenuMode.Split
      ? sider.value.width + SPLIT_RAIL_WIDTH
      : sider.value.width
  )

  const drawerComponent = computed(() => {
    if (!siderComponent.value) return null
    return h(
      Drawer,
      {
        classes: { body: 'p-0! overflow-hidden!' },
        closable: false,
        'data-testid': 'layout-sider-drawer',
        open: drawerOpen.value,
        placement: 'left',
        size: drawerSize.value,
        'onUpdate:open': (open: boolean) => (drawerOpen.value = open),
      },
      () => h(siderComponent.value!)
    )
  })

  const component = computed(() =>
    isSmallScreen.value ? drawerComponent.value : siderComponent.value
  )

  return { component }
}
