import type { IRoute } from './types'

export const routes: IRoute[] = [
  {
    name: 'index',
    path: '/',
    redirect: '/dashboard/analysis',
    component: () => import('@/layouts/index.vue'),
    children: [
      {
        /**
         * 外链菜单不是业务路由,它的 URL 由地址栏直接承载(形如 `/https://example.com`)。
         * 这条记录只负责让这类地址命中布局,内容区由 LayoutContent 中的 IframeView 接管。
         *
         * 首段限定为 http:/https:,因此普通未知路径仍会落到顶层 404,不会被这条吞掉。
         * 第二段的 `(.*)` 会吸收 URL 中 `//` 之后的部分,参数值本身不使用
         * (最终地址由 useIframe 从 route.fullPath 还原,能保留双斜杠)。
         */
        name: 'externalLink',
        path: ':scheme(https?:)/:rest(.*)',
        // 仅为消除 vue-router 的缺组件告警;isIframe 为真时内容区由 IframeView 接管,
        // RouterView 不会渲染,因此这里不需要下发 src。
        component: () => import('@/layouts/content/components/iframe-view.vue'),
      },
    ],
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
