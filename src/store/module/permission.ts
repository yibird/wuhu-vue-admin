import { defineStore } from 'pinia';
import { menus } from '/@/common/menu';
import { Menu } from '/@/router/types';
import { toList } from '/@/utils/tree';

type State = {
  // 前端路由
  frontMenus: Menu[];
  // 后端路由
  backMenus: Menu[];
};

const initialState = (): State => {
  return {
    frontMenus: [],
    backMenus: [],
  };
};
export const usePermissionStore = defineStore('permission', {
  state: initialState,
  getters: {
    getBackMenus(): Menu[] {
      return this.backMenus;
    },
    getFrontMenus(): Menu[] {
      return this.frontMenus;
    },
    getFlatFrontMenus() {
      return toList(menus);
    },
  },
  actions: {
    setBackMenus(menus: Menu[]) {
      this.backMenus = menus;
    },
    setFrontMenus(menus: Menu[]) {
      this.frontMenus = menus;
    },
    buildRoutes() { },
  },
});
