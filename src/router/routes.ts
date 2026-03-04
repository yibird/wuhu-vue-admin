import type { IRoute } from './types';

export const routes: IRoute[] = [
  {
    name: 'index',
    path: '/',
    component: () => import('@/layouts/index.vue'),
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    name: '404',
    path: '/:catchAll(.*)',
    component: () => import(`@/components/Exception/src/not-found.vue`),
  },
];
