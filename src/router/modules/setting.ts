import { AppRouteRecordRaw } from '../types';

const routes: AppRouteRecordRaw[] = [
  {
    path: 'setting',
    children: [
      {
        path: 'account',
        component: () => import('/@/views/setting/account/index.vue'),
      },
    ],
  },
];
export default routes;
