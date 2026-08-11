import type { IRoute } from './types'
import { NotAuthorized, NotFound } from '@/components'

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
    component: NotAuthorized,
  },
  {
    name: '404',
    path: '/:catchAll(.*)',
    component: NotFound,
  },
]
