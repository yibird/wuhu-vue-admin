import { AppRouteRecordRaw } from '../types';

const routes: AppRouteRecordRaw[] = [
  {
    path: 'dashboard',
    children: [
      {
        path: 'console',
        component: () => import('/@/views/dashboard/console/index.vue'),
      },
      {
        path: 'monitor',
        component: () => import('/@/views/dashboard/monitor/index.vue'),
      },
      {
        path: 'workplace',
        component: () => import('/@/views/dashboard/workplace/index.vue'),
      },
    ],
  },
];
export default routes;
