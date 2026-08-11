import type {
  AlertItem,
  AppType,
  MonitorMetric,
  OverviewMetric,
  ServiceItem,
  Status,
  SysInfoType,
  SysMonitorData,
} from '../components/types'

export const overviewItems: OverviewMetric[] = [
  {
    id: 'sites',
    title: '网站',
    value: 12,
    description: '运行中 11 个',
    trend: '+2 本周',
    tone: 'primary',
    icon: 'i-lucide:globe-2',
  },
  {
    id: 'databases',
    title: '数据库',
    value: 6,
    description: '主从同步正常',
    trend: '99.98%',
    tone: 'success',
    icon: 'i-lucide:database',
  },
  {
    id: 'jobs',
    title: '计划任务',
    value: 28,
    description: '2 个待重试',
    trend: '+4 今日',
    tone: 'warning',
    icon: 'i-lucide:calendar-clock',
  },
  {
    id: 'apps',
    title: '应用',
    value: 9,
    description: '3 个有更新',
    trend: '稳定',
    tone: 'info',
    icon: 'i-lucide:boxes',
  },
]

export const statusItems: Status[] = [
  {
    id: 'liquidChart-1',
    title: 'CPU',
    value: 32.8,
    description: '1.3 / 4 核',
    tone: 'success',
    icon: 'i-lucide:cpu',
    trend: '近 5 分钟 +3.2%',
  },
  {
    id: 'liquidChart-2',
    title: '内存',
    value: 64.2,
    description: '4.73 GB / 7.38 GB',
    tone: 'warning',
    icon: 'i-lucide:memory-stick',
    trend: '缓存占用偏高',
  },
  {
    id: 'liquidChart-3',
    title: '负载',
    value: 38.6,
    description: '1.54 / 4',
    tone: 'primary',
    icon: 'i-lucide:gauge',
    trend: '运行流畅',
  },
  {
    id: 'liquidChart-4',
    title: '磁盘',
    value: 72.4,
    description: '142.12 GB / 196.49 GB',
    tone: 'error',
    icon: 'i-lucide:hard-drive',
    trend: '建议清理日志',
  },
]

export const sysInfoItems: SysInfoType[] = [
  {
    id: 'host',
    title: '主机名称',
    value: 'iZ8vbbyz2u3851c1bqee25Z',
    copyable: true,
  },
  {
    id: 'os',
    title: '发行版本',
    value: 'Ubuntu 22.04.4 LTS',
  },
  {
    id: 'kernel',
    title: '内核版本',
    value: '5.15.0-92-generic',
  },
  {
    id: 'arch',
    title: '系统类型',
    value: 'x86_64',
  },
  {
    id: 'address',
    title: '主机地址',
    value: '172.16.0.166',
    copyable: true,
  },
  {
    id: 'boot',
    title: '启动时间',
    value: '2026-05-28 16:11:06',
  },
  {
    id: 'runtime',
    title: '运行时间',
    value: '4天 18小时 32分钟',
  },
]

export const appItems: AppType[] = [
  {
    id: 1,
    title: 'Redis',
    description: '高性能的开源键值数据库',
    icon: 'i-lucide:database-zap',
    version: '7.2.5',
    status: 'installed',
    tone: 'error',
  },
  {
    id: 2,
    title: 'Halo',
    description: '强大易用的开源建站工具',
    icon: 'i-lucide:panel-top',
    version: '2.15.2',
    status: 'installed',
    tone: 'primary',
  },
  {
    id: 3,
    title: 'MaxKB',
    description: '基于 LLM 的知识库问答系统',
    icon: 'i-lucide:brain-circuit',
    version: '1.10.1',
    status: 'available',
    tone: 'success',
  },
  {
    id: 4,
    title: 'MeterSphere',
    description: '测试管理和接口测试工具',
    icon: 'i-lucide:shield-check',
    version: '3.1.0',
    status: 'available',
    tone: 'warning',
  },
  {
    id: 5,
    title: 'AList',
    description: '多存储文件列表和私人网盘',
    icon: 'i-lucide:folder-cloud',
    version: '3.41.0',
    status: 'installed',
    tone: 'info',
  },
]

export const alertItems: AlertItem[] = [
  {
    id: 'alert-disk',
    title: '磁盘使用率超过 70%',
    description: '/var/log 增长较快，建议清理 7 天前日志。',
    time: '10:42',
    severity: 'critical',
    source: 'disk-monitor',
  },
  {
    id: 'alert-job',
    title: '备份任务连续失败',
    description: 'backup-daily 已连续 2 次失败，最近错误为连接超时。',
    time: '09:18',
    severity: 'warning',
    source: 'scheduler',
  },
  {
    id: 'alert-app',
    title: '应用更新可用',
    description: 'Halo 与 AList 有新版本，建议在低峰期更新。',
    time: '08:35',
    severity: 'info',
    source: 'app-center',
  },
]

export const serviceItems: ServiceItem[] = [
  {
    id: 'nginx',
    name: 'Nginx',
    description: '入口网关与静态资源服务',
    status: 'running',
    port: 80,
    uptime: '4天 18小时',
    latency: 18,
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: '业务主库',
    status: 'running',
    port: 3306,
    uptime: '4天 18小时',
    latency: 24,
  },
  {
    id: 'redis',
    name: 'Redis',
    description: '缓存与队列',
    status: 'degraded',
    port: 6379,
    uptime: '3天 7小时',
    latency: 62,
  },
  {
    id: 'worker',
    name: 'Queue Worker',
    description: '异步任务消费者',
    status: 'stopped',
    port: 9201,
    uptime: '已停止',
    latency: 0,
  },
]

export const metricLabels: Record<MonitorMetric, string> = {
  cpu: 'CPU',
  memory: '内存',
  diskIo: '磁盘 IO',
  network: '网络',
}

export const monitorData: SysMonitorData[] = [
  { time: '08:00', cpu: 24, memory: 52, diskIo: 28, network: 35 },
  { time: '09:00', cpu: 31, memory: 56, diskIo: 34, network: 42 },
  { time: '10:00', cpu: 29, memory: 58, diskIo: 41, network: 38 },
  { time: '11:00', cpu: 38, memory: 61, diskIo: 48, network: 45 },
  { time: '12:00', cpu: 44, memory: 63, diskIo: 52, network: 51 },
  { time: '13:00', cpu: 36, memory: 64, diskIo: 46, network: 48 },
  { time: '14:00', cpu: 42, memory: 66, diskIo: 58, network: 56 },
  { time: '15:00', cpu: 39, memory: 65, diskIo: 64, network: 61 },
  { time: '16:00', cpu: 48, memory: 67, diskIo: 72, network: 58 },
  { time: '17:00', cpu: 35, memory: 64, diskIo: 61, network: 49 },
  { time: '18:00', cpu: 32, memory: 62, diskIo: 55, network: 44 },
  { time: '19:00', cpu: 28, memory: 60, diskIo: 43, network: 39 },
]
