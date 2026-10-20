import type { IMenu } from '#/config'

/**
 * 审批流菜单
 *
 * 与「模板中心」平级,页面路径映射到 src/views/template/approval 下对应目录
 */
export const approvalMenus: IMenu[] = [
  {
    id: '814',
    title: '审批流',
    type: 1,
    rootId: '0',
    parentId: '0',
    level: '814',
    icon: 'i-lucide:clipboard-check',
    children: [
      {
        id: '8141',
        title: '我的审批',
        type: 2,
        rootId: '814',
        parentId: '814',
        level: '814-8141',
        icon: 'i-lucide:clipboard-list',
        path: '/template/approval/my',
      },
      {
        id: '8142',
        title: '流程分组',
        type: 2,
        rootId: '814',
        parentId: '814',
        level: '814-8142',
        icon: 'i-lucide:layers',
        path: '/template/approval/categories',
      },
      {
        id: '8143',
        title: '流程监控',
        type: 2,
        rootId: '814',
        parentId: '814',
        level: '814-8143',
        icon: 'i-lucide:activity',
        path: '/template/approval/monitor',
      },
      {
        id: '8144',
        title: '流程设计器',
        type: 3,
        rootId: '814',
        parentId: '814',
        level: '814-8144',
        icon: 'i-lucide:workflow',
        path: '/template/approval/designer',
        keepAlive: false,
      },
    ],
  },
]
