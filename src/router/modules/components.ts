import { AppRouteRecordRaw } from '../types';

const routes: AppRouteRecordRaw[] = [
  {
    path: 'components',
    children: [
      {
        path: 'button',
        component: () => import('/@/views/components/button/index.vue'),
      },
      {
        path: 'table',
        component: () => import('/@/views/components/table/index.vue'),
      },
      {
        path: 'form',
        component: () => import('/@/views/components/form/index.vue'),
      },
    ],
  },
];

export default routes;
