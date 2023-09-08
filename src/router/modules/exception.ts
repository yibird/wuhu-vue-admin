import { AppRouteRecordRaw } from '../types';

const routes: AppRouteRecordRaw[] = [
  {
    path: 'exception',
    children: [
      {
        title: 'Ok',
        path: 'ok',
        component: () => import('/@/views/exception/ok/index.vue'),
      },
      {
        title: 'Unauthorized',
        path: 'unauthorized',
        component: () => import('/@/views/exception/unauthorized/index.vue'),
      },
      {
        title: 'Forbidden',
        path: 'forbidden',
        component: () => import('/@/views/exception/forbidden/index.vue'),
      },
      {
        title: 'Not Found',
        path: 'notFound',
        component: () => import('/@/views/exception/notFound/index.vue'),
      },
      {
        title: 'Server Error',
        path: 'serverError',
        component: () => import('/@/views/exception/serverError/index.vue'),
      },
    ],
  },
];

export default routes;
