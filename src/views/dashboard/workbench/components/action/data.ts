import type { WorkbenchAction } from './types'

export const workbenchActions: WorkbenchAction[] = [
  {
    id: 'create-project',
    icon: 'i-lucide:plus-circle',
    name: '新建项目',
    desc: '创建交付空间',
    tone: 'bg-primary/10',
    text: 'text-primary',
    action: 'create-project',
  },
  {
    id: 'tasks',
    icon: 'i-lucide:clipboard-check',
    name: '创建任务',
    desc: '分配负责人',
    tone: 'bg-success/10',
    text: 'text-success',
    path: '/dashboard/task',
  },
  {
    id: 'reviews',
    icon: 'i-lucide:file-search',
    name: '需求评审',
    desc: '查看待评审',
    tone: 'bg-warning/10',
    text: 'text-warning',
    path: '/template/workflow/list',
  },
  {
    id: 'team-sync',
    icon: 'i-lucide:message-square-plus',
    name: '团队同步',
    desc: '进入团队会话',
    tone: 'bg-info/10',
    text: 'text-info',
    path: '/template/chat',
  },
  {
    id: 'files',
    icon: 'i-lucide:folder-open',
    name: '文件管理',
    desc: '访问团队文件',
    tone: 'bg-warning/10',
    text: 'text-warning',
    path: '/dashboard/file-manager',
  },
  {
    id: 'articles',
    icon: 'i-lucide:newspaper',
    name: '文章管理',
    desc: '维护内容资产',
    tone: 'bg-success/10',
    text: 'text-success',
    path: '/template/article/list',
  },
  {
    id: 'workflow-monitor',
    icon: 'i-lucide:activity',
    name: '流程监控',
    desc: '查看运行状态',
    tone: 'bg-error/10',
    text: 'text-error',
    path: '/template/workflow/monitor',
  },
  {
    id: 'agents',
    icon: 'i-lucide:bot',
    name: 'Agent',
    desc: '管理智能助手',
    tone: 'bg-info/10',
    text: 'text-info',
    path: '/ai-platform/agent',
  },
  {
    id: 'notices',
    icon: 'i-lucide:bell',
    name: '通知公告',
    desc: '查看最新通知',
    tone: 'bg-primary/10',
    text: 'text-primary',
    path: '/sys/notice/list',
  },
]

/** 默认在工作台固定的快捷入口数量 */
const DEFAULT_ACTION_COUNT = 4

export const defaultWorkbenchActionIds = workbenchActions
  .slice(0, DEFAULT_ACTION_COUNT)
  .map((item) => item.id)
