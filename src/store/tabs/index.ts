import { defineStore } from 'pinia'
import { permissionStore } from '../permission'
import { menuToTab } from './util'

import type { TabOption, TabState } from './types'
import type { IMenu, ITab } from '#/config'

const initialState: TabState = {
  current: -1,
  tabs: [],
  topMenu: undefined,
  rootId: undefined,
  renderRouteView: true,
  cachedTabs: new Set(),
  excludeCachedTabs: new Set(),
}

export const tabsStore = defineStore('tabs', {
  state: () => initialState,
  getters: {
    currentTab(state): Maybe<ITab> {
      return this.current === -1 ? this.homeTab : state.tabs[state.current]
    },
    homeTab() {
      const flatMenus = permissionStore().flatMenus
      if (flatMenus.length === 0) return
      let menu: IMenu | null = null
      for (const item of flatMenus) {
        if (!menu && item.type === 1) {
          menu = item
        }
        if (item.home && [1, 2].includes(item.type)) {
          return menuToTab(item)
        }
      }
      return menu ? menuToTab(menu) : undefined
    },
    getCachedTabs(): string[] {
      if (this.homeTab && this.homeTab.keepAlive) {
        return [this.homeTab.name, ...Array.from(this.cachedTabs)]
      }
      return Array.from(this.cachedTabs)
    },
  },
  actions: {
    _getMenu(menu: TabOption) {
      if (typeof menu === 'object') return menu as IMenu
      const flatMenus = permissionStore().flatMenus
      return flatMenus.find((item) => String(item.id) === String(menu))
    },
    _getTabIndex(tab: TabOption) {
      if (typeof tab === 'number') return tab
      const name = typeof tab === 'string' ? tab : tab.name
      return this.tabs.findIndex((item) => item.name === name)
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
      const targetTab = menuToTab(menu)
      if (targetTab.name === this.homeTab?.name) {
        this.openHomeTab()
        return
      }
      this.tabs.push(targetTab)
      this.current = this.tabs.length - 1
    },
    openTabByName(name: string) {
      this.openTab(name)
    },
    openTabByIndex(index: number) {
      this.openTab(index)
    },
    closeTab(tab: TabOption) {
      const index = this._getTabIndex(tab)
      if (index <= this.current) {
        this.current--
      }
      this.tabs.splice(index, 1)
    },
    closeByName(name: string) {
      this.closeTab(name)
    },
    closeByIndex(index: number) {
      if (this.current < 0 || this.current > this.tabs.length - 1) return
      this.closeTab(index)
    },
    closeCurrentTab() {
      this.closeByIndex(this.current)
    },
    closeLeftTab() {
      if (this.current < 1) return
      if (this.current === -1) {
        this.tabs = []
        return
      }
      const newTabs = this.tabs.slice(this.current, this.tabs.length)
      this.tabs = [...newTabs]
      this.current = 0
    },
    closeRightTab() {
      if (this.current === this.tabs.length - 1) return
      if (this.current === -1) {
        this.tabs = []
        return
      }
      const newTabs = this.tabs.slice(this.current + 1)
      this.tabs = newTabs
    },
    closeOtherTab() {
      if (this.currentTab?.home) {
        this.current = -1
        return
      }
      if (this.tabs.length === 0 || this.current >= this.tabs.length - 1) {
        return
      }
      this.tabs = [this.tabs[this.current]!]
      this.current = 0
    },
    closeAllTab() {
      this.current = -1
      this.tabs = []
    },
    sortTabs() {},
    pinTab(tab: TabOption) {},
    unpinTab(tab: TabOption) {},
    togglePinTab(tab: TabOption) {},
    async refreshTab() {
      this.renderRouteView = false
      await new Promise((resolve) => {
        setTimeout(resolve, 200)
      })
      this.renderRouteView = true
    },

    updateCachedTabs() {
      const newCachedTabs = new Set<string>()
      for (const tab of this.tabs) {
        if (tab.keepAlive) {
          newCachedTabs.add(tab.name)
        }
      }
      this.cachedTabs = newCachedTabs
    },
  },
  persist: true,
})
