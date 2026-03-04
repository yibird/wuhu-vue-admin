import { ref, watch } from 'vue'
import { router } from '@/router'
import { storeToRefs } from 'pinia'
import { permissionStore, tabsStore } from '@/store'

export function useTabs() {
  const store = tabsStore()
  const { tabs, current, currentTab, homeTab, topMenu, rootId } =
    storeToRefs(store)

  const { menus, flatMenus } = storeToRefs(permissionStore())

  const {
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

    pinTab,
    unpinTab,
    togglePinTab,
    refreshTab,
  } = store

  const prevPath = ref<string>()

  watch(currentTab, (val) => {
    if (!val) return
    const path = val.path
    if (!path || path === prevPath.value) return
    router.push({ path })
    prevPath.value = path
  })

  return {
    tabs,
    current,
    homeTab,
    currentTab,
    topMenu,
    rootId,
    menus,
    flatMenus,

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

    pinTab,
    unpinTab,
    togglePinTab,
    refreshTab,
  }
}
