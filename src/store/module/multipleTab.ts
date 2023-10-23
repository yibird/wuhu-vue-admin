import { defineStore } from 'pinia';
import { reactive, unref } from 'vue';
import { RouteLocationNormalized, Router } from 'vue-router';
import { usePermissionStore } from './permission';
import { useGo, useRedo } from '/@/hooks/web/usePage';
import { MenuItem } from '/@/router/types';
import { useRouter } from 'vue-router';

interface State {
  /**
   * @desc tab列表项数组
   * @default []
   */
  tabItems: MenuItem[];
  /**
   * @desc 当前选中tab索引
   * @default -1
   */
  current: number;
  cacheTabItems: Set<string>;
}

const initialState = (): State => {
  return {
    tabItems: [],
    current: -1,
    cacheTabItems: new Set(),
  };
};

export const useMultipleTabStore = defineStore('multipleTab', {
  state: initialState,
  getters: {
    getTabItems(): MenuItem[] {
      return this.tabItems;
    },
    getCacheTabItems(): Array<string> {
      return Array.from(this.cacheTabItems);
    },
    getCurrent(): number {
      return this.current;
    },
    getCurrentTab(): MenuItem | undefined {
      const itemsLen = this.getTabItems.length;
      if (
        this.getCurrent === -1 ||
        itemsLen === 0 ||
        this.getCurrent > itemsLen
      ) {
        return;
      }
      return this.getTabItems[this.current];
    },
  },
  actions: {
    // 跳转对应页面
    toPage(router: Router) {
      if (!this.getCurrentTab) return;
      const { push } = router;
      push(this.getCurrentTab.path);
    },

    // 刷新当前页面
    async refreshPage(router: Router) {
      // const { currentRoute } = router;
      // const route = unref(currentRoute);
      // const cacheTab = this.getTabItems.find(
      //   (item) => item.name === route.name,
      // );
      // if (cacheTab) {
      //   this.cacheTabList.delete(cacheTab);
      // }
      // const redo = useRedo(router);
      // await redo();
    },
    // 根据索引选择tab
    handleChangeTab(index: number, router: Router) {
      if (index < 0 || index > this.tabItems.length - 1) return;
      this.current = index;
      this.toPage(router);
    },
    // 添加tab
    handleAddTab(tabItem: MenuItem, router: Router) {
      const { tabItems, current } = this;
      const index = tabItems.findIndex((item) => item.id === tabItem.id);
      if (index === -1) {
        this.tabItems.push(tabItem);
      }
      this.handleChangeTab(index > -1 ? index : current + 1, router);
    },
    // 根据索引关闭tab
    handleCloseTab(index: number, router: Router) {
      const { tabItems, current } = this;
      if (index < 0 || index > tabItems.length - 1) return;
      this.tabItems.splice(index, 1);
      this.current = index <= current ? index - 1 : current;
      this.toPage(router);
    },
    // 关闭当前tab
    handleCloseCurrentTab(router: Router) {
      if (this.getCurrent === -1) return;
      const { current } = this;
      this.tabItems.splice(current, 1);
      this.current = current === 0 ? 0 : current - 1;
      this.toPage(router);
    },
    // 关闭当前tab左侧所有tab
    handleCloseLeftTab() {
      const { tabItems, current } = this;
      if (tabItems.length === 1) return;
      this.tabItems = tabItems.slice(current);
      this.current = 0;
    },
    // 关闭当前tab右侧所有tab
    handleCloseRightTab() {
      const { tabItems, current } = this;
      if (tabItems.length === 1 || current === tabItems.length - 1) return;
      this.tabItems = this.tabItems.slice(0, current + 1);
    },
    // 关闭其他tab
    handleCloseOtherTab() {
      const { tabItems, current } = this;
      if (tabItems.length === 1) return;
      this.tabItems = tabItems.filter((_, index) => index === current);
      this.current = 0;
    },
    // 关闭所有tab
    handleCloseAllTab() {
      this.tabItems = [];
      this.current = 0;
    },
    clearCacheTabs() {
      this.cacheTabItems = new Set();
    },
  },
});
