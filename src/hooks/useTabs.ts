import { createSharedComposable } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { permissionStore, tabsStore } from '@/store'
import { isUrl } from '@/utils'
import type { TabNavOption } from '@/store/tabs/types'

/**
 * 解析 Tab 对应的路由 path
 *
 * 外链菜单不是路由,点击后由地址栏承载 URL(形如 `/https://example.com`),
 * useIframe 再去掉首个 `/` 还原为 iframe 地址。
 * 必须以 `/` 开头,vue-router 才会按绝对路径解析,否则会被拼到当前路由后面。
 *
 * @param path Tab 的 path,内链为路由 path,外链为完整 URL
 * @returns 可直接交给 router.push 的绝对 path
 */
function toRoutePath(path: string) {
  return isUrl(path) ? `/${path}` : path
}

/**
 * Tab 与路由的同步副作用,全局只注册一次
 *
 * useTabs() 目前有 20+ 处调用(布局、面包屑、搜索面板以及各详情页),
 * 若把这两个 watcher 留在 useTabs 里,一次 Tab 切换会同时跑 N 个 watcher、
 * 并发发起 N 次 router.push,数量还会随缓存页面增加。
 */
const useTabsNavigation = createSharedComposable(() => {
  const router = useRouter()
  const route = useRoute()
  const store = tabsStore()

  function navigateTab(option: TabNavOption) {
    const path = toRoutePath(option.path)
    // 当前路由已处于目标 Tab(相同路径且携带相同 tabKey)时不再重复导航
    if (route.path === path && history.state?.tabKey === option.key) return
    return router.push({
      ...option,
      path,
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
})

export function useTabs() {
  const router = useRouter()
  const store = tabsStore()
  const permission = permissionStore()

  useTabsNavigation()

  /**
   * 按路由 path 打开对应菜单 Tab
   *
   * 页面内直接 router.push 不会建立 Tab（Tab 只在 openTab 时创建），
   * 凡是「打开站内某个菜单页面」的入口都应走这里：
   * 命中菜单则新增或激活对应 Tab，非菜单路由退化为普通跳转。
   *
   * @param path 目标路由 path
   * @returns 是否命中菜单并打开了 Tab
   */
  async function openTabByPath(path: string) {
    const menu = Reflect.get(permission.menuCache.pathMap, path)
    if (!menu) {
      await router.push(path)
      return false
    }

    return store.openTab(menu.id)
  }

  return {
    ...store,
    ...storeToRefs(store),
    openTabByPath,
  }
}
