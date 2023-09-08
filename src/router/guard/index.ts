import { NavigationGuardWithThis, Router } from 'vue-router';

// 路由白名单
const routeWhiteList = ['/login'];

export function setupRouterGuard(router: Router) {
  createPageGuard(router);
  createPermissionGuard(router);
}

// 创建页面路由
function createPageGuard(router: Router) {
  console.log('router:', router);
}

// 创建权限守卫
function createPermissionGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('') || '';
    console.log('to:', to);

    // if (to.path === '/' && !token) {
    //   next('/login');
    //   return;
    // }
    next();
  });
}
