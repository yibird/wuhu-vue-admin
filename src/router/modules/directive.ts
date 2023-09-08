import { AppRouteRecordRaw } from '../types';

const routes: AppRouteRecordRaw[] = [
    {
        path: 'directive',
        children: [
            {
                path: 'click',
                component: () => import('/@/views/dashboard/console/index.vue'),
            }
        ]
    },
]
export default routes;
