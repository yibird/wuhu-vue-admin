import type { IRoute } from './types'

export const routes: IRoute[] = [
  {
    name: 'index',
    path: '/',
    redirect: '/dashboard/analysis',
    component: () => import('@/layouts/index.vue'),
    children: [],
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
    meta: { public: true },
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('@/pages/register/index.vue'),
    meta: { public: true },
  },
  {
    name: 'forbidden',
    path: '/403',
    component: () =>
      import('@/components/exception').then((m) => m.NotAuthorized),
  },
  {
    name: 'lowCodeRuntime',
    path: '/template/low-code/runtime',
    component: () => import('@/views/template/low-code/runtime/index.vue'),
    meta: { title: '低代码运行时' },
  },
  {
    name: '404',
    path: '/:catchAll(.*)',
    component: () => import('@/components/exception').then((m) => m.NotFound),
  },
]
