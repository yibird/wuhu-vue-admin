import { computed, type Component } from 'vue'
import { useAppStore } from '@/store'
import { MenuMode, type MenuModeType } from '@/constants'

type SiderMenuMode = Exclude<MenuModeType, (typeof MenuMode)['Horizontal']>

export function useSider(
  components: Readonly<Record<SiderMenuMode, Component>>
) {
  const { app, sider } = useAppStore()

  const showSider = computed(() => sider.value.show)
  const menuMode = computed(() => app.value.menuMode)

  const activeComponent = computed(() => {
    const mode = menuMode.value
    if (!showSider.value || mode === MenuMode.Horizontal) return null
    return components[mode]
  })
  return { showSider, menuMode, activeComponent }
}
