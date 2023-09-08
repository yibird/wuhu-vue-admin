import { AppRouteRecordRaw, Menu } from './types';
import { Component } from 'vue'

const modules = import.meta.glob("../views/**/*.vue|tsx") as Record<string, Component>;

function getPath(path: string, prefix: string = "/@/views", suffix = "index.vue") {
  path = path.startsWith("/") ? path.slice(1) : path;
  path = path.endsWith("/") ? path.slice(0, -1) : path;
  return `${prefix}/${path}/${suffix}`;
}


// // 加载模块路由
// export async function loadModuleRoutes() {
//   const modules = import.meta.glob<{ default: AppRouteRecordRaw[] }>('./modules/*.ts');
//   const modRoutes: AppRouteRecordRaw[] = [];
//   for (let key in modules) {
//     const mod = await modules[key]();
//     const routes = Array.isArray(mod.default) ? [...mod.default] : [mod.default];
//     modRoutes.push(...routes);
//   }
//   return modRoutes;
// }

export const routes: AppRouteRecordRaw[] = [
  {
    name: 'layout',
    path: '/',
    component: () => import('/@/layouts/default/index.vue'),
    redirect: '/dashboard/console',
    children: [
      {
        path: "/notFound",
        component: () => import('/@/views/exception/notFound/index.vue')
      }
    ],
  },
  {
    path: '/login',
    component: () => import('/@/views/sys/login/index.vue'),
  },
  {
    path: '/lockScreen',
    component: () => import('/@/views/setting/lockScreen/index.vue'),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/notFound",
  }
];


export function menusToRoutes(menus: Menu[]): AppRouteRecordRaw[] {
  console.log(modules);
  return menus.filter(item => item.type === 2 && item.path)
    .map(({ path }) => {
      return {
        path,
        component: modules[getPath(path, "../views")],
      };
    })
}