import { faker } from '@faker-js/faker'
import type {
  SysCaptchaLogDetail,
  SysCaptchaLog,
  CaptchaScene,
  CaptchaType,
  SysClientLogDetail,
  SysClientLog,
  SysLoginLogDetail,
  SysLoginLog,
  LogLevel,
  LogStatus,
  SysOperationLogDetail,
  SysOperationLog,
} from '@/apis'

const COUNT = 88
const DAYS = 14

const usernames = [
  'admin',
  'zhouxuepeng',
  'wangfang',
  'lijing',
  'chenyu',
  'ops-bot',
] as const

const locations = [
  '中国|广东省|深圳市|电信',
  '中国|浙江省|杭州市|联通',
  '中国|北京市|北京市|移动',
  '中国|上海市|上海市|电信',
  '中国|四川省|成都市|联通',
] as const

const browsers = [
  'Chrome 139.0.0.0',
  'Edge 138.0.3168.62',
  'Firefox 141.0.2',
  'Safari 18.6',
] as const

const systems = [
  'Windows 11',
  'macOS 15.6',
  'Ubuntu 24.04.1',
  'iOS 18.6.2',
] as const

const modules = [
  '用户管理',
  '角色管理',
  '部门管理',
  '菜单管理',
  '字典管理',
  '文件管理',
  '系统日志',
] as const

const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const
const uris = [
  '/api/sys/user/getPageList',
  '/api/sys/user/create',
  '/api/sys/role/update',
  '/api/sys/dept/getPageList',
  '/api/sys/menu/del',
  '/api/sys/dict/getRecord',
] as const

const clientSources = [
  'request',
  'router',
  'component',
  'window.error',
  'unhandledrejection',
] as const

const clientMessages = [
  '接口请求失败,已触发重试',
  '组件渲染异常,已降级为骨架屏',
  '路由懒加载资源加载超时',
  '页面停留时长埋点上报',
  'WebSocket 连接断开,等待重连',
] as const

const clientLevels: LogLevel[] = ['debug', 'info', 'info', 'warn', 'error']

const captchaTypes: CaptchaType[] = ['image', 'sms', 'email']
const captchaScenes: CaptchaScene[] = [
  'login',
  'register',
  'resetPassword',
  'bind',
]

/** 生成近两周内的日志时间 */
function createLogAt() {
  return faker.date.recent({ days: DAYS }).toISOString()
}

/** 生成可读的 traceId */
function createTraceId() {
  const groups = [
    faker.string.hexadecimal({ length: 8, prefix: '' }),
    faker.string.hexadecimal({ length: 4, prefix: '' }),
    faker.string.hexadecimal({ length: 4, prefix: '' }),
    faker.string.hexadecimal({ length: 4, prefix: '' }),
    faker.string.hexadecimal({ length: 12, prefix: '' }),
  ]
  return groups.join('-')
}

function createRequestHeaders(traceId: string, host = 'api.wuhu-admin.top') {
  return {
    Host: host,
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.***.signature',
    'User-Agent': `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) ${faker.helpers.arrayElement(browsers)}`,
    'X-Request-Id': faker.string.uuid(),
    'X-Trace-Id': traceId,
  }
}

/* ---------------- 登录日志 ---------------- */

function createLoginLog(_: unknown, index: number): SysLoginLog {
  const status: LogStatus = index % 6 === 0 ? 0 : 1

  return {
    id: `8100${String(index + 1).padStart(4, '0')}`,
    traceId: createTraceId(),
    ip: faker.internet.ipv4(),
    location: faker.helpers.arrayElement(locations),
    logAt: createLogAt(),
    username: faker.helpers.arrayElement(usernames),
    os: faker.helpers.arrayElement(systems),
    browser: faker.helpers.arrayElement(browsers),
    status,
    message:
      status === 1
        ? '登录成功'
        : faker.helpers.arrayElement(['密码错误', '验证码错误', '账号已停用']),
    costTime: faker.number.int({ min: 16, max: 320 }),
  }
}

export const loginLogDataSource: SysLoginLog[] = Array.from(
  { length: COUNT },
  createLoginLog
).sort((a, b) => b.logAt.localeCompare(a.logAt))

/**
 * 取登录日志详情
 *
 * @param id 日志主键
 */
export function findLoginLog(id: string): SysLoginLogDetail | undefined {
  const row = loginLogDataSource.find((item) => item.id === id)
  if (!row) return undefined

  return {
    ...row,
    requestHeaders: createRequestHeaders(row.traceId),
    requestBody: {
      username: row.username,
      password: '******',
      captcha: faker.string.numeric(4),
      captchaKey: faker.string.uuid(),
      rememberMe: faker.datatype.boolean(),
      clientInfo: { browser: row.browser, os: row.os },
    },
    responseBody:
      row.status === 1
        ? {
            code: 200,
            message: '登录成功',
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.***.signature',
              refreshToken: faker.string.alphanumeric({ length: 32 }),
              expiresIn: 7200,
              userInfo: {
                id: '1001',
                username: row.username,
                roles: ['admin'],
              },
            },
          }
        : { code: 400, message: row.message, data: null },
  }
}

/* ---------------- 操作日志 ---------------- */

function createOperationLog(_: unknown, index: number): SysOperationLog {
  const module = faker.helpers.arrayElement(modules)

  return {
    id: `8200${String(index + 1).padStart(4, '0')}`,
    traceId: createTraceId(),
    ip: faker.internet.ipv4(),
    location: faker.helpers.arrayElement(locations),
    logAt: createLogAt(),
    username: faker.helpers.arrayElement(usernames),
    module,
    message: `${faker.helpers.arrayElement(['查询', '新增', '修改', '删除'])}${module.replace('管理', '')}`,
    method: faker.helpers.arrayElement(methods),
    uri: faker.helpers.arrayElement(uris),
    os: faker.helpers.arrayElement(systems),
    browser: faker.helpers.arrayElement(browsers),
    status: index % 7 === 0 ? 0 : 1,
    costTime: faker.number.int({ min: 8, max: 860 }),
  }
}

export const operationLogDataSource: SysOperationLog[] = Array.from(
  { length: COUNT },
  createOperationLog
).sort((a, b) => b.logAt.localeCompare(a.logAt))

/**
 * 取操作日志详情
 *
 * @param id 日志主键
 */
export function findOperationLog(
  id: string
): SysOperationLogDetail | undefined {
  const row = operationLogDataSource.find((item) => item.id === id)
  if (!row) return undefined

  return {
    ...row,
    requestHeaders: createRequestHeaders(row.traceId),
    requestBody: {
      current: 1,
      pageSize: 10,
      filters: { module: row.module, dataStatus: true },
      deptIds: ['1', '3', '7'],
      sort: [{ field: 'createdAt', order: 'desc' }],
    },
    responseHeaders: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Trace-Id': row.traceId,
      'X-Response-Time': `${row.costTime}ms`,
    },
    responseBody:
      row.status === 1
        ? {
            code: 200,
            message: '请求成功',
            data: {
              total: faker.number.int({ min: 20, max: 400 }),
              list: [
                {
                  id: '1',
                  name: `${row.module}示例数据`,
                  dataStatus: true,
                  createdAt: createLogAt(),
                },
                {
                  id: '2',
                  name: '第二条示例数据',
                  dataStatus: false,
                  createdAt: createLogAt(),
                },
              ],
            },
          }
        : { code: 500, message: '服务异常,请稍后重试', data: null },
  }
}

/* ---------------- 客户端日志 ---------------- */

function createClientLog(_: unknown, index: number): SysClientLog {
  return {
    id: `8300${String(index + 1).padStart(4, '0')}`,
    traceId: createTraceId(),
    ip: faker.internet.ipv4(),
    location: faker.helpers.arrayElement(locations),
    logAt: createLogAt(),
    level: clientLevels[index % clientLevels.length],
    message: faker.helpers.arrayElement(clientMessages),
    url: `http://localhost:5555${faker.helpers.arrayElement(uris).replace('/api', '')}`,
    source: faker.helpers.arrayElement(clientSources),
    username: faker.helpers.arrayElement(usernames),
    os: faker.helpers.arrayElement(systems),
    browser: faker.helpers.arrayElement(browsers),
  }
}

export const clientLogDataSource: SysClientLog[] = Array.from(
  { length: COUNT },
  createClientLog
).sort((a, b) => b.logAt.localeCompare(a.logAt))

/**
 * 取客户端日志详情
 *
 * @param id 日志主键
 */
export function findClientLog(id: string): SysClientLogDetail | undefined {
  const row = clientLogDataSource.find((item) => item.id === id)
  if (!row) return undefined

  const stack =
    row.level === 'error'
      ? [
          'at TaskSummaryCard (src/views/dashboard/task/components/card/item.vue:42:18)',
          'at renderComponentRoot (node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js:4602:16)',
          'at ReactiveEffect.componentUpdateFn (node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js:4836:11)',
        ]
      : []

  return {
    ...row,
    error: {
      name: row.level === 'error' ? 'TypeError' : 'AppWarning',
      message: row.message,
      stack,
    },
    context: {
      route: { path: '/dashboard/analysis', name: 'Analysis', params: {} },
      device: { browser: row.browser, os: row.os, viewport: '1600x900' },
      user: { id: '1001', username: row.username, roles: ['admin'] },
      payload: {
        requestId: faker.string.uuid(),
        retryCount: faker.number.int({ min: 0, max: 3 }),
        duration: faker.number.int({ min: 80, max: 4200 }),
      },
    },
  }
}

/* ---------------- 验证码日志 ---------------- */

function maskCode(code: string) {
  if (code.length <= 2) return code
  return `${code.slice(0, 1)}${'*'.repeat(code.length - 2)}${code.slice(-1)}`
}

function createCaptchaLog(_: unknown, index: number): SysCaptchaLog {
  const type = captchaTypes[index % captchaTypes.length]
  const status: LogStatus = index % 4 === 0 ? 0 : 1
  const receiver =
    type === 'sms'
      ? faker.phone.number()
      : type === 'email'
        ? faker.internet.email()
        : `session-${faker.string.alphanumeric({ length: 12 })}`
  const logAt = createLogAt()
  const code = faker.string.numeric(type === 'image' ? 4 : 6)

  return {
    id: `8400${String(index + 1).padStart(4, '0')}`,
    traceId: createTraceId(),
    ip: faker.internet.ipv4(),
    location: faker.helpers.arrayElement(locations),
    logAt,
    type,
    scene: faker.helpers.arrayElement(captchaScenes),
    receiver,
    code: maskCode(code),
    status,
    message:
      status === 1
        ? '验证码校验通过'
        : faker.helpers.arrayElement([
            '验证码错误',
            '验证码已过期',
            '验证码已使用',
          ]),
    costTime: faker.number.int({ min: 6, max: 220 }),
    expireAt: new Date(new Date(logAt).getTime() + 5 * 60 * 1000).toISOString(),
  }
}

export const captchaLogDataSource: SysCaptchaLog[] = Array.from(
  { length: COUNT },
  createCaptchaLog
).sort((a, b) => b.logAt.localeCompare(a.logAt))

/**
 * 取验证码日志详情
 *
 * @param id 日志主键
 */
export function findCaptchaLog(id: string): SysCaptchaLogDetail | undefined {
  const row = captchaLogDataSource.find((item) => item.id === id)
  if (!row) return undefined

  return {
    ...row,
    requestBody: {
      type: row.type,
      scene: row.scene,
      receiver: row.receiver,
      captchaKey: faker.string.uuid(),
      input: row.code,
    },
    responseBody:
      row.status === 1
        ? {
            code: 200,
            message: '验证通过',
            data: { verified: true, expireAt: row.expireAt },
          }
        : { code: 400, message: row.message, data: { verified: false } },
  }
}
