import type {
  Project,
  ProjectLogo,
  ProjectLogoTone,
  WorkbenchAction,
  WorkbenchMember,
} from './components/types'

export interface ProjectLogoOption extends ProjectLogo {
  label: string
  class: string
}

export const projectLogoOptions: ProjectLogoOption[] = [
  {
    label: '业务中台',
    icon: 'i-lucide:building-2',
    tone: 'primary',
    class: 'border-primary/30 bg-primary-tint text-primary',
  },
  {
    label: '产品体验',
    icon: 'i-lucide:panels-top-left',
    tone: 'info',
    class: 'border-info/30 bg-info-tint text-info',
  },
  {
    label: '流程自动化',
    icon: 'i-lucide:workflow',
    tone: 'success',
    class: 'border-success/30 bg-success-tint text-success',
  },
  {
    label: '安全治理',
    icon: 'i-lucide:shield-check',
    tone: 'warning',
    class: 'border-warning/30 bg-warning-tint text-warning',
  },
  {
    label: '创新项目',
    icon: 'i-lucide:rocket',
    tone: 'error',
    class: 'border-error/30 bg-error-tint text-error',
  },
  {
    label: '数据洞察',
    icon: 'i-lucide:chart-spline',
    tone: 'neutral',
    class: 'border-color-2 bg-fill-tertiary text-main',
  },
]

export const workbenchMembers: WorkbenchMember[] = [
  {
    name: '张三',
    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
  },
  {
    name: '李四',
    src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  },
  {
    name: '王五',
    src: 'https://gw.alipayobjects.com/zos/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  },
  {
    name: '赵六',
    src: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
  },
]

export const workbenchActions: WorkbenchAction[] = [
  {
    id: 'create-project',
    icon: 'i-lucide:plus-circle',
    name: '新建项目',
    desc: '创建交付空间',
    tone: 'icon-primary-soft',
    text: 'text-primary',
    action: 'create-project',
  },
  {
    id: 'tasks',
    icon: 'i-lucide:clipboard-check',
    name: '创建任务',
    desc: '分配负责人',
    tone: 'bg-success-tint',
    text: 'text-success',
    path: '/dashboard/task',
  },
  {
    id: 'reviews',
    icon: 'i-lucide:file-search',
    name: '需求评审',
    desc: '查看待评审',
    tone: 'bg-warning-tint',
    text: 'text-warning',
    path: '/template/workflow/list',
  },
  {
    id: 'team-sync',
    icon: 'i-lucide:message-square-plus',
    name: '团队同步',
    desc: '进入团队会话',
    tone: 'bg-info-tint',
    text: 'text-info',
    path: '/template/chat',
  },
  {
    id: 'files',
    icon: 'i-lucide:folder-open',
    name: '文件管理',
    desc: '访问团队文件',
    tone: 'bg-warning-tint',
    text: 'text-warning',
    path: '/dashboard/fileManger',
  },
  {
    id: 'articles',
    icon: 'i-lucide:newspaper',
    name: '文章管理',
    desc: '维护内容资产',
    tone: 'bg-success-tint',
    text: 'text-success',
    path: '/article/list',
  },
  {
    id: 'workflow-monitor',
    icon: 'i-lucide:activity',
    name: '流程监控',
    desc: '查看运行状态',
    tone: 'bg-error-tint',
    text: 'text-error',
    path: '/template/workflow/monitor',
  },
  {
    id: 'agents',
    icon: 'i-lucide:bot',
    name: 'Agent',
    desc: '管理智能助手',
    tone: 'bg-info-tint',
    text: 'text-info',
    path: '/ai-platform/agent',
  },
  {
    id: 'notices',
    icon: 'i-lucide:bell',
    name: '通知公告',
    desc: '查看最新通知',
    tone: 'icon-primary-soft',
    text: 'text-primary',
    path: '/sys/notice',
  },
]

export const defaultWorkbenchActionIds = workbenchActions
  .slice(0, 4)
  .map((item) => item.id)

export const initialProjects: Project[] = [
  {
    id: 1,
    logo: { icon: 'i-lucide:building-2', tone: 'primary' },
    name: '企业运营中台',
    describe: '统一客户运营、触达任务和数据看板，减少跨系统切换成本。',
    master: '产品负责人：林舟',
    createAt: '2026-05-08',
    dueAt: '06-18',
    progress: 78,
    status: '推进中',
    statusClass: 'bg-primary-tint text-primary',
    members: workbenchMembers,
  },
  {
    id: 2,
    logo: { icon: 'i-lucide:panels-top-left', tone: 'info' },
    name: '移动端体验优化',
    describe: '梳理核心页面响应式布局、触控热区和弱网加载策略。',
    master: '体验负责人：沈一',
    createAt: '2026-05-14',
    dueAt: '06-10',
    progress: 56,
    status: '待联调',
    statusClass: 'bg-warning-tint text-warning',
    members: workbenchMembers.slice(0, 3),
  },
  {
    id: 3,
    logo: { icon: 'i-lucide:workflow', tone: 'success' },
    name: '工作流设计器',
    describe: '支持节点编排、参数配置、运行日志和模板复用。',
    master: '研发负责人：周辰',
    createAt: '2026-05-20',
    dueAt: '06-24',
    progress: 42,
    status: '设计中',
    statusClass: 'bg-info-tint text-info',
    members: workbenchMembers.slice(1),
  },
  {
    id: 4,
    logo: { icon: 'i-lucide:shield-check', tone: 'warning' },
    name: '权限与审计升级',
    describe: '补齐菜单权限、操作审计和异常访问追踪能力。',
    master: '安全负责人：许安',
    createAt: '2026-05-22',
    dueAt: '06-30',
    progress: 31,
    status: '有风险',
    statusClass: 'bg-error-tint text-error',
    members: workbenchMembers.slice(0, 2),
  },
]

export function getProjectLogoOption(logo: ProjectLogo) {
  return (
    projectLogoOptions.find(
      (item) => item.icon === logo.icon && item.tone === logo.tone
    ) ?? projectLogoOptions[0]
  )
}

export function getProjectLogoByTone(tone: ProjectLogoTone) {
  return (
    projectLogoOptions.find((item) => item.tone === tone) ??
    projectLogoOptions[0]
  )
}
