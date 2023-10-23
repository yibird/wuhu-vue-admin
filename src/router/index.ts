import { Menu } from '/@/router/types';
import { Router, createRouter, createWebHashHistory } from 'vue-router';
import type { App } from 'vue';
import { routes } from './routes';
import { menus } from '/@/common/menu';
import { menusToRoutes } from './routes';
import { toList } from '/@/utils/tree';
export { setupRouterGuard } from './guard';
export type * from './types';

export const router = createRouter({
  history: createWebHashHistory(),
  // @ts-ignore
  routes,
});

// 动态加载路由
function dynamicLoadRoutes(menus: Menu[]) {
  const routes = menusToRoutes(toList(menus));
  routes.forEach(({ path, component }) => {
    router.addRoute('layout', { path, component });
  });
}

export async function setupRouter(app: App<Element>) {
  dynamicLoadRoutes(menus);
  app.use(router);
}
