import type { MenuResp } from '@/apis'

function createBase(id: string, sort: number) {
  return {
    id,
    dataStatus: true,
    deleted: false,
    version: 1,
    sort,
    createdBy: '系统管理员',
    createdAt: new Date(Date.now() - sort * 86_400_000).toISOString(),
  }
}

function createMenu(
  id: string,
  name: string,
  type: MenuResp['type'],
  path: string,
  component: string,
  perms: string,
  icon: string,
  sort: number,
  status = true
): MenuResp {
  return {
    ...createBase(id, sort),
    name,
    type,
    path,
    component,
    perms,
    icon,
    status,
  }
}

export const menuDataSource: MenuResp[] = [
  createMenu(
    '1',
    '仪表盘',
    1,
    '/dashboard',
    '',
    '',
    'i-lucide:layout-dashboard',
    1
  ),
  createMenu(
    '11',
    '分析页',
    2,
    '/dashboard/analysis',
    'dashboard/analysis/index',
    'dashboard:analysis:view',
    'i-lucide:chart-spline',
    1
  ),
  createMenu(
    '12',
    '工作台',
    2,
    '/dashboard/workbench',
    'dashboard/workbench/index',
    'dashboard:workbench:view',
    'i-lucide:briefcase-business',
    2
  ),
  createMenu('7', '系统管理', 1, '/sys', '', '', 'i-lucide:cog', 2),
  createMenu(
    '71',
    '用户管理',
    2,
    '/sys/user',
    'sys/user/index',
    'sys:user:list',
    'i-lucide:user',
    1
  ),
  createMenu('711', '用户新增', 3, '', '', 'sys:user:create', '', 1),
  createMenu('712', '用户编辑', 3, '', '', 'sys:user:update', '', 2),
  createMenu('713', '用户删除', 3, '', '', 'sys:user:del', '', 3),
  createMenu(
    '73',
    '角色管理',
    2,
    '/sys/role',
    'sys/role/index',
    'sys:role:list',
    'i-lucide:shield-check',
    3
  ),
  createMenu('731', '角色新增', 3, '', '', 'sys:role:create', '', 1),
  createMenu(
    '74',
    '部门管理',
    2,
    '/sys/dept',
    'sys/dept/index',
    'sys:dept:list',
    'i-lucide:building-2',
    4
  ),
  createMenu(
    '75',
    '菜单管理',
    2,
    '/sys/menu',
    'sys/menu/index',
    'sys:menu:list',
    'i-lucide:list-tree',
    5
  ),
  createMenu(
    '76',
    '通知公告',
    2,
    '/sys/notice',
    'sys/notice/index',
    'sys:notice:list',
    'i-lucide:bell',
    6
  ),
  createMenu(
    '78',
    '字典管理',
    2,
    '/sys/dict',
    'sys/dict/index',
    'sys:dict:list',
    'i-lucide:book-type',
    7
  ),
  createMenu(
    '781',
    '参数配置',
    2,
    '/sys/config',
    'sys/config/index',
    'sys:config:list',
    'i-lucide:component',
    8
  ),
  createMenu(
    '79',
    '系统监控',
    2,
    '/sys/monitor',
    'sys/monitor/index',
    'sys:monitor:view',
    'i-lucide:activity',
    9
  ),
  createMenu(
    '80',
    '日志管理',
    2,
    '/sys/log',
    'sys/log/index',
    'sys:log:view',
    'i-lucide:file-text',
    10,
    false
  ),
  createMenu(
    '8',
    '模板中心',
    1,
    '/template',
    '',
    '',
    'i-lucide:layout-template',
    3
  ),
  createMenu(
    '821',
    '流程列表',
    2,
    '/template/workflow/list',
    'template/workflow/list/index',
    'workflow:list:view',
    'i-lucide:list-tree',
    1
  ),
  createMenu(
    '822',
    '流程监控',
    2,
    '/template/workflow/monitor',
    'template/workflow/monitor/index',
    'workflow:monitor:view',
    'i-lucide:activity',
    2
  ),
  createMenu(
    '834',
    '报表设计器',
    2,
    '/template/report-designer',
    'template/report-designer/index',
    'report:designer:view',
    'i-lucide:gantt-chart',
    3
  ),
  createMenu(
    '10',
    'Ai开发',
    1,
    '/ai-platform',
    '',
    '',
    'i-lucide:brain-circuit',
    4
  ),
  createMenu(
    '100',
    '模型列表',
    2,
    '/ai-platform/model',
    'ai-platform/model/index',
    'ai:model:list',
    'i-lucide:cpu',
    1
  ),
  createMenu(
    '101',
    'Agent',
    2,
    '/ai-platform/agent',
    'ai-platform/agent/index',
    'ai:agent:list',
    'i-lucide:bot',
    2
  ),
  createMenu(
    '103',
    '知识库',
    2,
    '/ai-platform/knowledge-base',
    'ai-platform/knowledge-base/index',
    'ai:knowledge:list',
    'i-lucide:library-big',
    3
  ),
  createMenu(
    '9',
    '外部链接',
    1,
    '/external-link',
    '',
    '',
    'i-lucide:external-link',
    5
  ),
  createMenu(
    '91',
    'Trae AI',
    2,
    'https://www.trae.ai',
    '',
    'external:trae',
    'i-lucide:globe',
    1
  ),
]

export function findMenu(id: string) {
  return menuDataSource.find((item) => item.id === id)
}
