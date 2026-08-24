export type MonitorTone = 'primary' | 'success' | 'warning' | 'error' | 'info'

export type MonitorMetric = 'cpu' | 'memory' | 'diskIo' | 'network'

export type MonitorSeverity = 'critical' | 'warning' | 'info'

export type ServiceStatus = 'running' | 'degraded' | 'stopped'

export interface OverviewMetric {
  id: string
  title: string
  value: number
  suffix?: string
  description: string
  trend: string
  tone: MonitorTone
  icon: string
}

export interface OverviewProps {
  items: OverviewMetric[]
  loading?: boolean
}

export interface Status {
  id: string
  title: string
  value: number
  description?: string
  tone: MonitorTone
  icon: string
  trend: string
}

export interface StatusProps {
  items: Status[]
  loading?: boolean
}

export interface StatusItemProps {
  item: Status
}

export interface SysInfoType {
  id: string
  title: string
  value: string
  copyable?: boolean
}

export interface SysInfoProps {
  items: SysInfoType[]
  loading?: boolean
}

export interface SysInfoEmits {
  copy: [item: SysInfoType]
  copyAll: []
}

export interface SysMonitorData {
  time: string
  cpu: number
  memory: number
  diskIo: number
  network: number
}

export interface SysMonitorProps {
  data?: SysMonitorData[]
  loading?: boolean
}

export interface AppType {
  id: number
  title: string
  description: string
  icon: string
  version: string
  status: 'installed' | 'available'
  tone: MonitorTone
}

export interface RecommendAppProps {
  items: AppType[]
  loading?: boolean
}

export interface RecommendAppEmits {
  open: [item: AppType]
  install: [item: AppType]
}

export interface AlertItem {
  id: string
  title: string
  description: string
  time: string
  severity: MonitorSeverity
  source: string
  resolved?: boolean
}

export interface AlertCenterProps {
  items: AlertItem[]
  activeSeverity: MonitorSeverity | 'all'
  loading?: boolean
}

export interface AlertCenterEmits {
  'update:activeSeverity': [severity: MonitorSeverity | 'all']
  resolve: [item: AlertItem]
}

export interface ServiceItem {
  id: string
  name: string
  description: string
  status: ServiceStatus
  port: number
  uptime: string
  latency: number
}

export interface ServiceHealthProps {
  items: ServiceItem[]
  loading?: boolean
}

export interface ServiceHealthEmits {
  action: [item: ServiceItem, action: 'restart' | 'start' | 'stop']
}
