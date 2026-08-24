import { defineStore, storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import { permissionStore } from '../permission'
import { menuToTab } from './util'

import type { TabOption, TabState } from './types'
import type { IMenu, ITab } from '#/config'

const initialState = (): TabState => ({
  current: -1,
  tabs: [],
  topMenu: undefined,
  rootId: undefined,
  renderRouteView: true,
  cachedTabs: [],
})

export const tabStore = defineStore('tab', {
  state: initialState,
  getters: {
    currentTab(state): Maybe<ITab> {
      return this.current === -1 ? this.homeTab : state.tabs[state.current]
    },
    homeTab(): Maybe<ITab> {
      const { flatMenus, flatMenusCache } = permissionStore()
      if (flatMenus.length === 0) return undefined
      let result: ITab | undefined
      for (const [, menu] of flatMenusCache) {
        if (menu.home && [1, 2].includes(menu.type)) {
          result = menuToTab(menu)
          break
        }
      }
      if (!result) {
        const first = flatMenus.find((m) => m.type === 1)
        if (first) result = menuToTab(first)
      }
      return result
    },
    getCachedTabs(): string[] {
      const homeName = this.homeTab?.keepAlive ? this.homeTab.name : undefined
      return homeName ? [homeName, ...this.cachedTabs] : [...this.cachedTabs]
    },
  },
  actions: {
    _getMenu(menu: TabOption) {
      if (typeof menu === 'object') return menu as IMenu
      const { flatMenus } = permissionStore()
      return flatMenus.find((item) => String(item.id) === String(menu))
    },
    _getTabIndex(tab: TabOption) {
      if (typeof tab === 'number') return tab
      const name = typeof tab === 'string' ? tab : tab.name
      return this.tabs.findIndex((item) => item.name === name)
    },
    _getTabName(tab: TabOption) {
      if (typeof tab === 'number') return this.tabs[tab]?.name
      return typeof tab === 'string' ? tab : tab.name
    },
    _setCurrentIndex(name?: string) {
      if (!name) {
        this.current = -1
        return
      }
      const index = this.tabs.findIndex((tab) => tab.name === name)
      this.current = index
    },
    _getNextTabNameAfterClose(index: number) {
      if (index !== this.current) return this.currentTab?.name
      return this.tabs[index - 1]?.name ?? this.tabs[index + 1]?.name
    },
    openHomeTab() {
      this.current = -1
    },
    openTab(tab: TabOption) {
      const index = this._getTabIndex(tab)
      if (index !== -1) {
        this.current = index
        return
      }
      const menu = this._getMenu(tab)
      if (!menu) return
      if (menu.isExternal && menu.externalTarget === '_blank') {
        window.open(menu.path, '_blank')
        return
      }
      const targetTab = menuToTab(menu)
      if (targetTab.name === this.homeTab?.name) {
        this.openHomeTab()
        return
      }
      this.tabs.push(targetTab)
      this._sortTabsInPlace(targetTab)
    },
    openTabByName(name: string) {
      this.openTab(name)
    },
    openTabByIndex(index: number) {
      this.openTab(index)
    },
    closeTab(tab: TabOption) {
      const index = this._getTabIndex(tab)
      if (index < 0 || index >= this.tabs.length) return
      if (this.tabs[index]?.fixed) return

      const nextName = this._getNextTabNameAfterClose(index)
      this.tabs.splice(index, 1)
      this._setCurrentIndex(nextName)
      // 更新缓存
      this._updateCachedTabs()
    },
    closeByName(name: string) {
      this.closeTab(name)
    },
    closeByIndex(index: number) {
      this.closeTab(index)
    },
    closeCurrentTab() {
      this.closeByIndex(this.current)
    },
    closeLeftTab() {
      if (this.current === -1) {
        this.closeAllTab()
        return
      }

      const currentName = this.currentTab?.name
      this.tabs = this.tabs.filter((tab, index) => {
        return tab.fixed || index >= this.current
      })
      this._setCurrentIndex(currentName)
      this._updateCachedTabs()
    },
    closeRightTab() {
      if (this.current === -1) {
        this.closeAllTab()
        return
      }

      const currentName = this.currentTab?.name
      this.tabs = this.tabs.filter((tab, index) => {
        return tab.fixed || index <= this.current
      })
      this._setCurrentIndex(currentName)
      this._updateCachedTabs()
    },
    closeOtherTab() {
      if (this.current === -1 || this.currentTab?.home) {
        this.closeAllTab()
        return
      }

      const currentName = this.currentTab?.name
      this.tabs = this.tabs.filter((tab) => {
        return tab.fixed || tab.name === currentName
      })
      this._setCurrentIndex(currentName)
      this._updateCachedTabs()
    },
    closeAllTab() {
      const currentName = this.currentTab?.fixed
        ? this.currentTab.name
        : undefined
      this.tabs = this.tabs.filter((tab) => tab.fixed)
      this._setCurrentIndex(currentName)
      this._updateCachedTabs()
    },
    /**
     * 原地排序，减少数组重建
     */
    _sortTabsInPlace(activeTab?: TabOption) {
      const activeName =
        activeTab === undefined
          ? this.currentTab?.name
          : this._getTabName(activeTab)
      // 将 fixed 项移动到最前面，其余项保持相对顺序
      this.tabs.sort((a, b) => {
        if (a.fixed === b.fixed) return 0
        return a.fixed ? -1 : 1
      })

      this._setCurrentIndex(activeName)
    },
    sortTabs(activeTab?: TabOption) {
      this._sortTabsInPlace(activeTab)
    },
    pinTab(tab: TabOption) {
      const index = this._getTabIndex(tab)
      const targetTab = this.tabs[index]
      if (!targetTab) return
      targetTab.fixed = true
      this._sortTabsInPlace()
    },
    unpinTab(tab: TabOption) {
      const index = this._getTabIndex(tab)
      const targetTab = this.tabs[index]
      if (!targetTab) return
      targetTab.fixed = false
      this._sortTabsInPlace()
    },
    togglePinTab(tab: TabOption, fixed?: boolean) {
      const index = this._getTabIndex(tab)
      const targetTab = this.tabs[index]
      if (!targetTab) return
      if (fixed ?? !targetTab.fixed) {
        this.pinTab(index)
        return
      }
      this.unpinTab(index)
    },
    /**
     * 显式重建 route-view，避免通过 _t query 生成额外 KeepAlive 缓存。
     */
    async refreshTab() {
      this.renderRouteView = false
      await nextTick()
      this.renderRouteView = true
    },
    _updateCachedTabs() {
      this.cachedTabs = this.tabs
        .filter((tab) => tab.keepAlive)
        .map((tab) => tab.name)
    },
  },
})

export const useTabStore = () => {
  const store = tabStore()
  return { ...store, ...storeToRefs(store) }
}
