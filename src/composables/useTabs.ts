import { usePermissionStore, useTabStore, useAppStore } from '@/store'

export function useTabs() {
  const store = useTabStore()
  const { menus, flatMenus } = usePermissionStore()
  const appStore = useAppStore()

  const {
    tabs,
    current,
    currentTab,
    homeTab,
    topMenu,
    rootId,
    openHomeTab,
    openTab,
    openTabByName,
    openTabByIndex,
    closeTab,
    closeByName,
    closeByIndex,
    closeCurrentTab,
    closeLeftTab,
    closeRightTab,
    closeOtherTab,
    closeAllTab,
    sortTabs,
    pinTab,
    unpinTab,
    togglePinTab,
    refreshTab,
  } = store

  const showIcon = computed(() => appStore.tab.value.showIcon)
  const theme = computed(() => appStore.tab.value.theme)

  return {
    tabs,
    current,
    homeTab,
    currentTab,
    topMenu,
    rootId,
    menus,
    flatMenus,
    showIcon,
    theme,

    openHomeTab,
    openTab,
    openTabByName,
    openTabByIndex,

    closeTab,
    closeByName,
    closeByIndex,
    closeCurrentTab,
    closeLeftTab,
    closeRightTab,
    closeOtherTab,
    closeAllTab,

    sortTabs,
    pinTab,
    unpinTab,
    togglePinTab,
    refreshTab,
  }
}
