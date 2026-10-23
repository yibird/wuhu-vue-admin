import { defineStore, storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import { permissionStore } from '../permission'
import { canCloseTab, canOpenTab } from './guard'
import {
  getTabIndex,
  menuToTab,
  sortPinTabs,
  toRouteTab,
  toRouteTabKey,
} from './util'
import type { IMenu, TabOption } from '#/config'
import type { ITab, TabStoreState, TabTarget, TabGuardSource } from './types'

const initialState = (): TabStoreState => ({
  tabs: [],
  activeKey: undefined,
  excludes: [],
})

export const tabsStore = defineStore('wuhu-vue-admin:tabs', {
  state: initialState,
  persist: {
    pick: ['tabs'],
  },
  getters: {
    /**
     * 获取首页Tab
     * @returns 首页Tab
     */
    homeTab() {
      const { flatRoutes } = permissionStore()
      if (flatRoutes.length === 0) return
      const homeMenu = flatRoutes.find((item) => item.home)
      if (homeMenu) return menuToTab(homeMenu)
      const menu = flatRoutes[0]
      if (!menu) return
      return menuToTab(menu)
    },
    /**
     * 当前选中的 Tab
     * @returns activeKey 为 undefined 时返回首页 Tab,未匹配到 Tab 时返回 undefined
     */
    currentTab(): ITab | undefined {
      if (!this.activeKey) return this.homeTab
      return this.tabs.find((item) => item.key === this.activeKey)
    },
    /**
     * 全部 Tab,由首页虚拟 Tab 与已打开的 Tab 组成
     * @returns Tab 列表,首页 Tab 始终位于首位
     */
    allTabs(): ITab[] {
      if (!this.homeTab) return this.tabs
      return [this.homeTab, ...this.tabs]
    },
  },
  actions: {
    /**
     * 打开 Tab,已存在则直接选中,不存在则根据菜单新增后选中
     *
     * 新增与激活都会先经过打开守卫,守卫返回 false 时不产生任何变化
     *
     * @param target Tab 操作目标
     * - string：Tab key
     * - number：Tab 下标
     * - ITab：Tab项，通过Tab key 定位对应 Tab
     * @returns 是否已打开
     */
    async openTab(target: TabTarget) {
      // 通过下标方式打开tab,属于站内切换,不触发打开守卫
      if (typeof target === 'number') {
        this.changeTab(target)
        return true
      }

      const { menuCache } = permissionStore()

      // 通过key打开tab
      if (typeof target === 'string') {
        // 首页 Tab 为虚拟 Tab,不加入 tabs 列表
        if (this.homeTab && target === this.homeTab.key) {
          this.openHomeTab()
          return true
        }
        const exists = this.tabs.find((tab) => tab.key === target)
        // 如果tab不存在,则根据key从菜单列表中查询
        const menu = exists ? undefined : Reflect.get(menuCache.idMap, target)
        const tab = exists ?? (menu ? menuToTab(menu) : undefined)
        if (!tab || !(await canOpenTab(tab))) return false
        if (!exists) {
          this.tabs.push(tab)
        }
        this.changeTab(tab)
        return true
      }

      // 通过对象方式打开tab
      if (this.homeTab && target.key === this.homeTab.key) {
        this.openHomeTab()
        return true
      }
      const exists = this.tabs.find((tab) => tab.key === target.key)
      const menu = exists
        ? undefined
        : Reflect.get(menuCache.pathMap, target.path)
      const tab = exists ?? (menu ? menuToTab(menu) : undefined)
      if (!tab || !(await canOpenTab(tab))) return false
      if (!exists) {
        this.tabs.push(tab)
      }
      this.changeTab(tab)
      return true
    },

    /**
     * 打开路由 Tab
     *
     * 用于不以菜单为入口的页面(例如隐藏子页面),同一 path 下 query 不同会各自占用一个 Tab
     *
     * @param option 路由 Tab 参数
     * @returns 是否已打开
     */
    async openRouteTab(option: TabOption) {
      const key = toRouteTabKey(option.path, option.query)
      const exists = this.tabs.find((tab) => tab.key === key)
      const { menuCache } = permissionStore()
      const menu = exists
        ? undefined
        : (Reflect.get(menuCache.pathMap, option.path) as IMenu | undefined)
      if (exists) {
        exists.title = option.title ?? exists.title
      }
      const tab = exists ?? toRouteTab(option, menu)
      if (!(await canOpenTab(tab))) return false
      if (!exists) {
        this.tabs.push(tab)
      }
      this.changeTab(tab)
      return true
    },

    /**
     * 打开首页 Tab
     */
    openHomeTab() {
      if (!this.homeTab) return
      this.changeTab(this.homeTab)
    },

    /**
     * 根据target选中 Tab,target为undefined时则选中homeTab
     * @param target Tab 操作目标
     * - undefined: 选中首页
     * - string：Tab key
     * - number：Tab 下标
     * - ITab：Tab项，通过Tab key 定位对应 Tab
     */
    changeTab(target?: TabTarget) {
      let nextKey: string | undefined
      if (typeof target === 'undefined') {
        nextKey = this.homeTab?.key
      } else if (typeof target === 'number') {
        nextKey = this.tabs[target]?.key
      } else if (typeof target === 'string') {
        nextKey = target
      } else {
        nextKey = target.key
      }
      // 首页 Tab 为虚拟 Tab,activeKey 为 undefined 时表示选中首页
      if (nextKey && nextKey === this.homeTab?.key) nextKey = undefined
      if (nextKey === this.activeKey) return
      this.activeKey = nextKey
    },

    /**
     * 关闭 Tab,关闭的是当前选中 Tab 时自动选中其左侧 Tab(无左侧 Tab 时回到首页)
     *
     * 关闭前会执行关闭守卫,守卫返回 false 时保留该 Tab
     *
     * @param target Tab 操作目标
     * - string：Tab key
     * - number：Tab 下标
     * - ITab：Tab项，通过Tab key 定位对应 Tab
     * @returns 是否已关闭
     */
    async closeTab(target: TabTarget) {
      const index = getTabIndex(this.tabs, target)
      const tab = this.tabs[index]
      if (index === -1 || !tab) return false
      if (!(await canCloseTab(tab, 'single'))) return false

      const wasActive = tab.key === this.activeKey
      this.tabs.splice(index, 1)
      // 仅当关闭的是当前选中 Tab 时切换选中项,下标 0 时回退到首页
      if (wasActive) {
        this.activeKey = index > 0 ? this.tabs[index - 1]?.key : undefined
      }
      return true
    },

    /**
     * 关闭当前选中的 Tab,并选中其左侧 Tab(无左侧 Tab 时回到首页)
     *
     * @returns 是否已关闭
     */
    async closeCurrentTab() {
      const index = this.tabs.findIndex((item) => item.key === this.activeKey)
      if (index === -1) return false
      const tab = this.tabs[index]
      if (!(await canCloseTab(tab, 'single'))) return false

      this.tabs.splice(index, 1)
      const next = index === 0 ? this.homeTab : this.tabs[index - 1]
      this.changeTab(next)
      return true
    },

    /**
     * 批量关闭 Tab,逐个执行关闭守卫,被守卫拒绝的 Tab 保留
     *
     * 固定 Tab 与关闭范围外的 Tab 不参与关闭,也不会触发守卫
     *
     * @param source 关闭来源,用于守卫上下文
     * @param match 判断 Tab 是否在关闭范围内
     * @returns 是否有 Tab 被关闭
     */
    async closeTabs(
      source: TabGuardSource,
      match: (tab: ITab, index: number) => boolean
    ) {
      const kept: ITab[] = []
      for (const [index, tab] of this.tabs.entries()) {
        if (tab.pin || !match(tab, index)) {
          kept.push(tab)
          continue
        }
        if (!(await canCloseTab(tab, source))) kept.push(tab)
      }
      if (kept.length === this.tabs.length) return false

      // 当前选中的 Tab 被关闭时回到首页,否则保持原有选中项
      const activeClosed = !kept.some((tab) => tab.key === this.activeKey)
      this.tabs = kept
      if (activeClosed) this.changeTab(undefined)
      return true
    },

    /**
     * 关闭当前 Tab 左侧的全部 Tab,固定 Tab 不参与关闭
     */
    async closeLeftTabs() {
      if (!this.activeKey) return false
      const index = getTabIndex(this.tabs, this.activeKey)
      if (index === -1) return false
      return this.closeTabs('left', (_, i) => i < index)
    },

    /**
     * 关闭当前 Tab 右侧的全部 Tab,固定 Tab 不参与关闭
     */
    async closeRightTabs() {
      if (!this.activeKey) return false
      const index = getTabIndex(this.tabs, this.activeKey)
      if (index === -1 || index === this.tabs.length - 1) return false
      return this.closeTabs('right', (_, i) => i > index)
    },

    /**
     * 关闭除当前 Tab 外的全部 Tab,固定 Tab 不参与关闭
     */
    async closeOtherTabs() {
      if (!this.activeKey) return false
      const index = getTabIndex(this.tabs, this.activeKey)
      if (index === -1) return false
      return this.closeTabs('other', (_, i) => i !== index)
    },

    /**
     * 关闭全部 Tab(固定 Tab 除外),并回到首页
     */
    async closeAllTabs() {
      return this.closeTabs('all', () => true)
    },

    /**
     * 固定 Tab,固定后排列在未固定 Tab 前面
     * @param target Tab 操作目标
     * - string：Tab key
     * - number：Tab 下标
     * - ITab：Tab项，通过Tab key 定位对应 Tab
     */
    pinTab(target: TabTarget) {
      this.togglePinTab(target, true)
    },

    /**
     * 取消固定 Tab
     * @param target Tab 操作目标
     * - string：Tab key
     * - number：Tab 下标
     * - ITab：Tab项，通过Tab key 定位对应 Tab
     */
    unpinTab(target: TabTarget) {
      this.togglePinTab(target, false)
    },

    /**
     * 切换 Tab 的固定状态,并将固定 Tab 重新排列到前面
     * @param target Tab 操作目标
     * - string：Tab key
     * - number：Tab 下标
     * - ITab：Tab项，通过Tab key 定位对应 Tab
     * @param pin 指定固定状态,不传时对当前状态取反
     */
    togglePinTab(target: TabTarget, pin?: boolean) {
      const index = getTabIndex(this.tabs, target)
      const tab = this.tabs[index]
      if (!tab) return
      const nextPin = pin ?? !tab.pin
      if (tab.pin === nextPin) return
      tab.pin = nextPin
      this.tabs = sortPinTabs(this.tabs)
    },

    /**
     * 对 Tab 列表排序,固定 Tab 始终排在未固定 Tab 前面,并保持各自原有顺序
     */
    sortTabs() {
      this.tabs = sortPinTabs(this.tabs)
    },

    /**
     * 根据操作目标获取 Tab 项
     * @param target Tab 操作目标
     * @returns 匹配到的 Tab,未匹配到时返回 undefined
     */
    _getTab(target: TabTarget) {
      if (typeof target === 'number') return this.tabs[target]
      const key = typeof target === 'string' ? target : target.key
      // 首页为虚拟 Tab,不存在于 tabs 列表中
      if (key === this.homeTab?.key) return this.homeTab
      return this.tabs.find((tab) => tab.key === key)
    },

    /**
     * 刷新指定的 Tab
     * - 目标为当前选中 Tab：先卸载页面,再重新挂载
     * - 目标为其他 Tab：仅丢弃其 KeepAlive 缓存,下次进入时重新创建
     * @param target Tab 操作目标
     * - string：Tab key
     * - number：Tab 下标
     * - ITab：Tab项，通过Tab key 定位对应 Tab
     */
    async refreshTab(target: TabTarget) {
      const tab = this._getTab(target)
      if (!tab?.componentName) return
      // 1.临时排除目标页面,使其卸载时不会重新写入 KeepAlive 缓存
      if (!this.excludes.includes(tab.componentName)) {
        this.excludes = [...this.excludes, tab.componentName]
      }
      await nextTick()
      this.excludes = this.excludes.filter((name) => name !== tab.componentName)
    },

    /**
     * 刷新当前选中的 Tab
     */
    async refreshCurrentTab() {
      const tab = this.currentTab
      if (!tab) return
      await this.refreshTab(tab)
    },
  },
})
export const useTabsStore = () => {
  const store = tabsStore()
  return { ...store, ...storeToRefs(store) }
}
