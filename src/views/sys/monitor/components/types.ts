export type MonitorTone = 'primary' | 'success' | 'warning' | 'error' | 'info'

export type MonitorStatus = 'healthy' | 'warning' | 'offline'

export type MonitorEnvironment = 'production' | 'staging'

export interface SummaryMetricItem {
  label: string
  value: string | number
  tone: MonitorTone
}

export interface ResourceMetric {
  id: string
  title: string
  value: number
  unit: string
  detail: string
  trend: string
  icon: string
  tone: MonitorTone
  chart: number[]
}

export interface ProcessMetric {
  id: string
  name: string
  pid: number
  status: MonitorStatus
  cpu: number
  memory: string
  heap: number
  threads: number
  uptime: string
  version: string
  detail: string
}

export interface DatabaseInstance {
  id: string
  name: string
  engine: string
  version: string
  status: MonitorStatus
  qps: number
  connections: number
  maxConnections: number
  cacheHit: number
  slowQueries: number
  replication: string
}

export interface DatabaseSnapshot {
  qps: number
  connections: number
  slowQueries: number
  cacheHit: number
  instances: DatabaseInstance[]
}

export interface RedisNode {
  id: string
  name: string
  role: string
  status: MonitorStatus
  memory: string
  keys: string
  hitRate: number
  ops: number
}

export interface RedisSnapshot {
  memoryUsed: string
  memoryTotal: string
  memoryPercent: number
  connectedClients: number
  commandsPerSecond: number
  hitRate: number
  evictedKeys: number
  nodes: RedisNode[]
}

export interface QueueMetric {
  id: string
  name: string
  vhost: string
  status: MonitorStatus
  ready: number
  unacked: number
  consumers: number
  publishRate: number
  deliverRate: number
}

export interface RabbitSnapshot {
  publishRate: number
  deliverRate: number
  messagesReady: number
  consumers: number
  queues: QueueMetric[]
}

export interface SystemMonitorSnapshot {
  hostname: string
  environment: MonitorEnvironment
  region: string
  os: string
  kernel: string
  uptime: string
  updatedAt: string
  resources: ResourceMetric[]
  processes: ProcessMetric[]
  database: DatabaseSnapshot
  redis: RedisSnapshot
  rabbitmq: RabbitSnapshot
}

export interface SystemMonitorActions {
  selectProcess: [process: ProcessMetric]
  selectQueue: [queue: QueueMetric]
}
