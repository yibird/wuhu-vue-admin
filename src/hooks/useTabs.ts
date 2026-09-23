import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { tabsStore } from '@/store'
import type { TabNavOption } from '@/store/tabs/types'

export function useTabs() {
  const router = useRouter()
  const route = useRoute()
  const store = tabsStore()

  function navigateTab(option: TabNavOption) {
    // 当前路由已处于目标 Tab(相同路径且携带相同 tabKey)时不再重复导航
    if (route.path === option.path && history.state?.tabKey === option.key)
      return
    return router.push({
      ...option,
      state: {
        tabKey: option.key,
      },
    })
  }

  watch(
    () => store.activeKey,
    (val) => {
      const tab = val
        ? store.tabs.find((tab) => tab.key === val)
        : store.homeTab
      if (!tab) return
      navigateTab(tab)
    }
  )

  watch(
    () => route.fullPath,
    () => {
      // 优先通过 history state 恢复自定义 Tab(navigateTab 导航时写入)
      const stateKey = history.state?.tabKey as string | undefined
      if (stateKey) {
        // 首页 Tab 为虚拟 Tab,activeKey 为 undefined 时表示选中首页
        if (stateKey === store.homeTab?.key) {
          if (store.activeKey !== undefined) store.changeTab()
          return
        }
        const tab = store.tabs.find((tab) => tab.key === stateKey)
        if (tab && store.activeKey !== tab.key) {
          store.changeTab(tab.key)
        }
        return
      }
      // 直接通过 url 访问时,根据路由 meta 的菜单 id 恢复菜单 Tab
      const menuId = route.meta.id
      if (!menuId) return
      const tab = store.tabs.find((tab) => tab.key === String(menuId))
      if (tab && store.activeKey !== tab.key) {
        store.changeTab(tab.key)
      }
    },
    { immediate: true }
  )

  return {
    ...store,
    ...storeToRefs(store),
  }
}
