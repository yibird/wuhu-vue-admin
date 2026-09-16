import type {
  DatabaseInstance,
  MonitorEnvironment,
  ProcessMetric,
  QueueMetric,
  RedisNode,
  ResourceMetric,
  SystemMonitorSnapshot,
} from './components/types'

const environmentMeta: Record<
  MonitorEnvironment,
  Pick<SystemMonitorSnapshot, 'hostname' | 'region'>
> = {
  production: {
    hostname: 'wuhu-prod-01',
    region: '华东 1 · 杭州',
  },
  staging: {
    hostname: 'wuhu-staging-01',
    region: '华东 1 · 上海',
  },
}

const resourceMetrics: ResourceMetric[] = [
  {
    id: 'cpu',
    title: 'CPU 使用率',
    value: 38.6,
    unit: '%',
    detail: '8 核 · 平均负载 1.54',
    trend: '+2.4% 较上次',
    icon: 'i-lucide:cpu',
    tone: 'success',
    chart: [28, 35, 31, 42, 38, 46, 40, 48, 43, 36, 39, 38],
  },
  {
    id: 'memory',
    title: '内存使用率',
    value: 64.2,
    unit: '%',
    detail: '10.28 GB / 16 GB · 可用 5.72 GB',
    trend: '-1.8% 较上次',
    icon: 'i-lucide:memory-stick',
    tone: 'warning',
    chart: [58, 60, 59, 63, 61, 66, 68, 65, 67, 64, 65, 64],
  },
  {
    id: 'disk',
    title: '磁盘使用率',
    value: 72.4,
    unit: '%',
    detail: '142.12 GB / 196.49 GB · /data',
    trend: '+0.6% 较上次',
    icon: 'i-lucide:hard-drive',
    tone: 'error',
    chart: [62, 64, 65, 66, 67, 68, 68, 69, 70, 71, 72, 72],
  },
  {
    id: 'network',
    title: '网络吞吐',
    value: 46.8,
    unit: 'MB/s',
    detail: '入站 28.4 MB/s · 出站 18.4 MB/s',
    trend: '+8.2% 较上次',
    icon: 'i-lucide:network',
    tone: 'info',
    chart: [26, 34, 31, 42, 37, 48, 44, 51, 46, 40, 43, 47],
  },
]

const processMetrics: ProcessMetric[] = [
  {
    id: 'wuhu-api',
    name: 'wuhu-api',
    pid: 18432,
    status: 'healthy',
    cpu: 12.4,
    memory: '486 MB',
    heap: 68,
    threads: 42,
    uptime: '4天 18小时',
    version: 'v2.8.4',
    detail: '主业务 API，负责认证、用户和工作流请求。',
  },
  {
    id: 'wuhu-worker',
    name: 'wuhu-worker',
    pid: 18478,
    status: 'healthy',
    cpu: 8.7,
    memory: '312 MB',
    heap: 54,
    threads: 18,
    uptime: '4天 18小时',
    version: 'v2.8.4',
    detail: '异步任务消费者，当前处理通知和数据同步任务。',
  },
  {
    id: 'gateway',
    name: 'gateway',
    pid: 17206,
    status: 'warning',
    cpu: 18.2,
    memory: '228 MB',
    heap: 82,
    threads: 26,
    uptime: '12小时 26分',
    version: 'v1.14.0',
    detail: 'API 网关，堆内存接近阈值，建议检查近期流量。',
  },
  {
    id: 'scheduler',
    name: 'scheduler',
    pid: 18502,
    status: 'healthy',
    cpu: 2.1,
    memory: '154 MB',
    heap: 43,
    threads: 12,
    uptime: '4天 18小时',
    version: 'v2.8.4',
    detail: '定时任务调度器，最近一次调度延迟 36ms。',
  },
]

const databaseInstances: DatabaseInstance[] = [
  {
    id: 'mysql-primary',
    name: '业务主库',
    engine: 'MySQL',
    version: '8.0.36',
    status: 'healthy',
    qps: 1248,
    connections: 86,
    maxConnections: 200,
    cacheHit: 99.2,
    slowQueries: 3,
    replication: '主库',
  },
  {
    id: 'mysql-replica',
    name: '业务从库',
    engine: 'MySQL',
    version: '8.0.36',
    status: 'healthy',
    qps: 832,
    connections: 42,
    maxConnections: 200,
    cacheHit: 98.8,
    slowQueries: 1,
    replication: '延迟 0.4s',
  },
  {
    id: 'postgres-report',
    name: '报表数据库',
    engine: 'PostgreSQL',
    version: '16.2',
    status: 'healthy',
    qps: 286,
    connections: 18,
    maxConnections: 100,
    cacheHit: 97.6,
    slowQueries: 0,
    replication: '独立实例',
  },
]

const redisNodes: RedisNode[] = [
  {
    id: 'redis-primary',
    name: 'redis-primary',
    role: '主节点',
    status: 'healthy',
    memory: '1.84 GB / 4 GB',
    keys: '128,420',
    hitRate: 98.7,
    ops: 4210,
  },
  {
    id: 'redis-replica-1',
    name: 'redis-replica-1',
    role: '从节点',
    status: 'healthy',
    memory: '1.79 GB / 4 GB',
    keys: '128,420',
    hitRate: 98.5,
    ops: 2180,
  },
]

const queues: QueueMetric[] = [
  {
    id: 'notification',
    name: 'notification.send',
    vhost: '/production',
    status: 'healthy',
    ready: 24,
    unacked: 6,
    consumers: 4,
    publishRate: 86.4,
    deliverRate: 84.9,
  },
  {
    id: 'workflow',
    name: 'workflow.execute',
    vhost: '/production',
    status: 'healthy',
    ready: 8,
    unacked: 2,
    consumers: 6,
    publishRate: 42.8,
    deliverRate: 42.1,
  },
  {
    id: 'dead-letter',
    name: 'events.dead-letter',
    vhost: '/production',
    status: 'warning',
    ready: 128,
    unacked: 0,
    consumers: 1,
    publishRate: 2.4,
    deliverRate: 0.8,
  },
]

function getUpdatedAt() {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date())
}

export function createMonitorSnapshot(
  environment: MonitorEnvironment = 'production'
): SystemMonitorSnapshot {
  const environmentInfo = environmentMeta[environment]
  const queueVhost = `/${environment}`

  return {
    ...environmentInfo,
    environment,
    os: 'Ubuntu 22.04.4 LTS',
    kernel: '5.15.0-92-generic',
    uptime: '4天 18小时 32分钟',
    updatedAt: getUpdatedAt(),
    resources: resourceMetrics.map((item) => ({
      ...item,
      chart: [...item.chart],
    })),
    processes: processMetrics.map((item) => ({ ...item })),
    database: {
      qps: 2366,
      connections: 146,
      slowQueries: 4,
      cacheHit: 98.9,
      instances: databaseInstances.map((item) => ({ ...item })),
    },
    redis: {
      memoryUsed: '1.84 GB',
      memoryTotal: '4 GB',
      memoryPercent: 46,
      connectedClients: 328,
      commandsPerSecond: 6390,
      hitRate: 98.7,
      evictedKeys: 0,
      nodes: redisNodes.map((item) => ({ ...item })),
    },
    rabbitmq: {
      publishRate: 131.6,
      deliverRate: 127.8,
      messagesReady: 160,
      consumers: 11,
      queues: queues.map((item) => ({ ...item, vhost: queueVhost })),
    },
  }
}

export function refreshMonitorSnapshot(
  previous: SystemMonitorSnapshot
): SystemMonitorSnapshot {
  const variation = (value: number, amount: number, min = 0, max = 100) =>
    Math.min(
      max,
      Math.max(min, Number((value + (Math.random() - 0.5) * amount).toFixed(1)))
    )

  return {
    ...previous,
    updatedAt: getUpdatedAt(),
    resources: previous.resources.map((item) => ({
      ...item,
      value: variation(item.value, 4, item.id === 'network' ? 0 : 1, 100),
      chart: [...item.chart.slice(1), variation(item.value, 8, 6, 96)],
    })),
    processes: previous.processes.map((item) => ({
      ...item,
      cpu: variation(item.cpu, 3, 0, 100),
      heap: variation(item.heap, 4, 1, 98),
    })),
    database: {
      ...previous.database,
      qps: Math.round(variation(previous.database.qps, 100, 0, 99999)),
      connections: Math.round(
        variation(previous.database.connections, 10, 0, 200)
      ),
      instances: previous.database.instances.map((item) => ({
        ...item,
        connections: Math.round(
          variation(item.connections, 6, 0, item.maxConnections)
        ),
        qps: Math.round(variation(item.qps, 80, 0, 99999)),
        cacheHit: variation(item.cacheHit, 0.8, 80, 100),
      })),
    },
    redis: {
      ...previous.redis,
      connectedClients: Math.round(
        variation(previous.redis.connectedClients, 16, 0, 99999)
      ),
      commandsPerSecond: Math.round(
        variation(previous.redis.commandsPerSecond, 240, 0, 99999)
      ),
      hitRate: variation(previous.redis.hitRate, 0.6, 80, 100),
    },
    rabbitmq: {
      ...previous.rabbitmq,
      publishRate: variation(previous.rabbitmq.publishRate, 12, 0, 99999),
      deliverRate: variation(previous.rabbitmq.deliverRate, 12, 0, 99999),
      messagesReady: Math.round(
        variation(previous.rabbitmq.messagesReady, 24, 0, 99999)
      ),
    },
  }
}
