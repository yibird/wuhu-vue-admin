import type { Task } from '../components'

export const tasks: Task[] = [
  {
    id: 1,
    title: '确认新版工作台信息架构',
    description: '梳理核心指标、快捷入口和待办优先级，输出最终评审稿。',
    assignee: 'wuyanzu',
    dueDate: '2026-06-03 18:00:00',
    priority: 'urgent',
    status: 1, // 进行中
    createTime: '2025-07-09 12:00:01',
  },
  {
    id: 2,
    title: '优化任务拖拽交互',
    description: '补齐跨分组拖拽、拖拽态层级、空状态和移动端可用性。',
    assignee: 'lingengxin',
    dueDate: '2026-06-05 18:00:00',
    priority: 'high',
    status: 1, // 进行中
    createTime: '2025-07-10 09:30:00',
  },
  {
    id: 3,
    title: '整理季度数据看板口径',
    description: '校验访问数、成交额、下载数等指标口径并同步给业务侧。',
    assignee: 'gaoyuanyuan',
    dueDate: '2026-05-28 17:30:00',
    priority: 'medium',
    status: 2, // 已完成
    createTime: '2025-07-08 14:15:22',
  },
  {
    id: 4,
    title: '低代码画布属性面板方案',
    description: '确认属性配置模型、组件 schema 和历史版本恢复流程。',
    assignee: 'wuyanzu',
    dueDate: '2026-06-11 18:00:00',
    priority: 'medium',
    status: 3, // 已暂停
    createTime: '2025-07-07 18:45:10',
  },
  {
    id: 5,
    title: '修复图表主题回归问题',
    description: '检查主题切换后 ECharts 实例的刷新、销毁与重建策略。',
    assignee: 'lingengxin',
    dueDate: '2026-05-30 16:00:00',
    priority: 'urgent',
    status: 4, // 已过期
    createTime: '2025-07-05 10:00:00',
  },
  {
    id: 6,
    title: '完善全局快捷键说明',
    description: '补充搜索、锁屏、主题切换、标签页操作的默认快捷键文案。',
    assignee: 'zhouxingchi',
    dueDate: '2026-06-08 18:00:00',
    priority: 'low',
    status: 1, // 进行中
    createTime: '2025-07-11 16:20:33',
  },
  {
    id: 7,
    title: '完成任务表格列适配',
    description: '让表格视图支持负责人、截止日期、优先级和紧凑操作列。',
    assignee: 'gaoyuanyuan',
    dueDate: '2026-06-01 18:00:00',
    priority: 'high',
    status: 2, // 已完成
    createTime: '2025-07-10 11:05:47',
  },
  {
    id: 8,
    title: '评估甘特图组件接入成本',
    description: '比较开源协议、Vue 适配、虚拟滚动、任务依赖和主题能力。',
    assignee: 'wuyanzu',
    dueDate: '2026-06-15 18:00:00',
    priority: 'low',
    status: 3, // 已暂停
    createTime: '2025-07-06 13:30:15',
  },
  {
    id: 9,
    title: '检查移动端头部工具栏',
    description: '修复低宽度下搜索、面包屑和按钮组挤压的问题。',
    assignee: 'lingengxin',
    dueDate: '2026-06-04 18:00:00',
    priority: 'high',
    status: 1, // 进行中
    createTime: '2025-07-11 09:12:28',
  },
  {
    id: 10,
    title: '补齐页面性能巡检脚本',
    description: '把 bundle analyze 和核心交互 e2e 纳入日常检查链路。',
    assignee: 'zhouxingchi',
    dueDate: '2026-05-29 18:00:00',
    priority: 'medium',
    status: 4, // 已过期
    createTime: '2025-07-04 15:40:00',
  },
]
