import { defineStore } from 'pinia';
import { unref } from 'vue';
import { RouteLocationNormalized, Router } from 'vue-router';
import { usePermissionStore } from './permission';
import { useGo, useRedo } from '/@/hooks/web/usePage';
import { Menu } from '/@/router/types';

type State = {
  tabList: Menu[];
  currentTab: Menu | null;
  cacheTabList: Set<string>;
};

const initialState = (): State => {
  return {
    tabList: [],
    currentTab: null,
    cacheTabList: new Set(),
  };
};

export const useMultipleTabStore = defineStore('multipleTab', {
  state: initialState,
  getters: {
    getTabList(): Menu[] {
      return this.tabList;
    },
    getCacheTabList(): Array<string> {
      return Array.from(this.cacheTabList);
    },
    getCurrentTab(): Menu | null {
      return this.currentTab;
    },
    getCurrentIndex(): number {
      if (this.getTabList.length === 1) return -1;
      return this.tabList.findIndex((item) => item.id === this.currentTab?.id);
    },
  },
  actions: {
    // 刷新当前页面
    async refreshPage(router: Router) {
      const { currentRoute } = router;
      const route = unref(currentRoute);
      const cacheTab = this.getCacheTabList.find((item) => item === route.name);
      if (cacheTab) {
        this.cacheTabList.delete(cacheTab);
      }
      const redo = useRedo(router);
      await redo();
    },
    // 跳转对应页面
    toPage(router: Router, path?: string) {
      const go = useGo(router);
      go(path || this.currentTab?.path);
    },
    // 添加tab
    addTab(tab: Menu, router: Router) {
      const permiStore = usePermissionStore();
      const go = useGo(router);
      // const menus = permiStore.getFlatFrontMenus;
      const index = this.tabList.findIndex((item) => item.id === tab.id);
      if (index === -1) {
        this.tabList.push(tab);
      }
      this.currentTab = tab;
      go(this.currentTab.path);
    },
    addTabById(id: string) {
      const permiStore = usePermissionStore();
      const isExist = this.tabList.some((item) => item.id === Number(id));
      const tab = permiStore.getFlatFrontMenus.find((item) => item.id === Number(id));
      if (!tab) return;
      if (!isExist) {
        this.tabList.push(tab);
      }
      this.currentTab = tab;
    },
    // 关闭当前tab
    closeCurrentTab(router: Router) {
      if (this.getCurrentIndex === -1) return;
      this.tabList.splice(this.getCurrentIndex, 1);
      this.currentTab = this.tabList[this.getCurrentIndex === 0 ? 0 : this.getCurrentIndex - 1];
      this.toPage(router);
    },
    // 关闭当前tab左侧所有tab
    closeLeftTab() {
      if (this.tabList.length === 1) return;
      const index = this.tabList.findIndex((item) => item.id === this.currentTab?.id);
      if (index === -1) return;
      const tabList = this.tabList.slice(index);
      tabList.length && (this.tabList = tabList);
    },
    // 关闭当前tab右侧所有tab
    closeRightTab() {
      if (this.tabList.length === 1) return;
      const index = this.tabList.findIndex((item) => item.id === this.currentTab?.id);
      if (index === -1) return;
      const tabList = this.tabList.slice(0, index + 1);
      tabList.length && (this.tabList = tabList);
    },
    // 关闭其他tab
    closeOtherTab() {
      if (this.tabList.length === 1) return;
      const index = this.tabList.findIndex((item) => item.id === this.currentTab?.id);
      if (index === -1) return;
      this.tabList = this.tabList.slice(index, index + 1);
    },
    // 关闭所有tab
    closeAllTab(router: Router) {
      if (this.tabList.length === 1) return;
      const index = this.tabList.findIndex((item) => item.id === this.currentTab?.id);
      if (index === -1) return;
      this.tabList = this.tabList.slice(index, index + 1);
      this.toPage(router);
    },
    clearCacheTabs() {
      this.cacheTabList = new Set();
    },
  },
});
