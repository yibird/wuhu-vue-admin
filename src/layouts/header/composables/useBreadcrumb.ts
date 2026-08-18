import { computed } from 'vue'
import { useAppStore, usePermissionStore } from '@/store'
import { useTabs } from '@/composables'
import { findPath } from '@zhouchengfeng/okay'
import { menusToOptions } from '@/utils'

export function useBreadcrumb() {
  const { currentTab, openTab } = useTabs()
  const { header } = useAppStore()
  const { menus } = usePermissionStore()
  const showBreadcrumb = computed(() => header.value.showBreadcrumb)
  const showBreadCrumbIcon = computed(() => header.value.showBreadCrumbIcon)

  const items = computed(() => {
    if (!currentTab.value) return []
    return findPath(menus.value, currentTab.value.name)
  })

  const dropdownMenus = computed(() => {
    return items.value.map((item) => {
      if (item.children && item.children.length > 0) {
        return menusToOptions(item.children)
      }
      return []
    })
  })
  const openMenu = (key: string | number) => {
    return openTab(String(key))
  }

  return {
    showBreadcrumb,
    showBreadCrumbIcon,
    items,
    dropdownMenus,
    openMenu,
  }
}
