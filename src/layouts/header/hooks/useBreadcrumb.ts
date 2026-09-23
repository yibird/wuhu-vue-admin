import { computed } from 'vue'
import { useAppStore, usePermissionStore } from '@/store'
import { useTabs } from '@/hooks'
import { findPath } from '@zhouchengfeng/okay'
import { menusToOptions } from '@/utils'

export function useBreadcrumb() {
  const { currentTab, openTab } = useTabs()
  const { header } = useAppStore()
  const { menus } = usePermissionStore()
  const show = computed(() => header.value.showBreadcrumb)
  const showIcon = computed(() => header.value.showBreadCrumbIcon)

  const items = computed(() => {
    const menuId = currentTab.value?.menuId
    if (!menuId) return []
    return findPath(menus.value, menuId)
  })

  const dropdownMenus = computed(() =>
    items.value.map((item) =>
      item.children?.length ? menusToOptions(item.children) : []
    )
  )

  return {
    show,
    showIcon,
    items,
    dropdownMenus,
    openMenu: openTab,
  }
}
