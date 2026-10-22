import { getBaseApi } from '@/apis/util'
import type {
  SysCaptchaLogDetail,
  SysCaptchaLogQuery,
  SysCaptchaLog,
  SysClientLogDetail,
  SysClientLogQuery,
  SysClientLog,
  SysLoginLogDetail,
  SysLoginLogQuery,
  SysLoginLog,
  LogKind,
  SysOperationLogDetail,
  SysOperationLogQuery,
  SysOperationLog,
} from './types'

/**
 * 各类型日志的接口前缀
 */
const LOG_PREFIX: Record<LogKind, string> = {
  login: '/sys/log/login',
  operation: '/sys/log/operation',
  client: '/sys/log/client',
  captcha: '/sys/log/captcha',
}

const loginApi = getBaseApi<SysLoginLog, SysLoginLogDetail>(LOG_PREFIX.login)
const operationApi = getBaseApi<SysOperationLog, SysOperationLogDetail>(
  LOG_PREFIX.operation
)
const clientApi = getBaseApi<SysClientLog, SysClientLogDetail>(
  LOG_PREFIX.client
)
const captchaApi = getBaseApi<SysCaptchaLog, SysCaptchaLogDetail>(
  LOG_PREFIX.captcha
)

/**
 * 登录日志分页列表
 *
 * @param query 查询参数
 */
export function getLoginLogPageListApi(query: SysLoginLogQuery) {
  return loginApi.getPageListApi<SysLoginLogQuery>(query)
}

/**
 * 登录日志详情
 *
 * @param id 日志主键
 */
export function getLoginLogRecordApi(id: string) {
  return loginApi.getRecordApi<{ id: string }>({ id })
}

/**
 * 操作日志分页列表
 *
 * @param query 查询参数
 */
export function getOperationLogPageListApi(query: SysOperationLogQuery) {
  return operationApi.getPageListApi<SysOperationLogQuery>(query)
}

/**
 * 操作日志详情
 *
 * @param id 日志主键
 */
export function getOperationLogRecordApi(id: string) {
  return operationApi.getRecordApi<{ id: string }>({ id })
}

/**
 * 客户端日志分页列表
 *
 * @param query 查询参数
 */
export function getClientLogPageListApi(query: SysClientLogQuery) {
  return clientApi.getPageListApi<SysClientLogQuery>(query)
}

/**
 * 客户端日志详情
 *
 * @param id 日志主键
 */
export function getClientLogRecordApi(id: string) {
  return clientApi.getRecordApi<{ id: string }>({ id })
}

/**
 * 验证码日志分页列表
 *
 * @param query 查询参数
 */
export function getCaptchaLogPageListApi(query: SysCaptchaLogQuery) {
  return captchaApi.getPageListApi<SysCaptchaLogQuery>(query)
}

/**
 * 验证码日志详情
 *
 * @param id 日志主键
 */
export function getCaptchaLogRecordApi(id: string) {
  return captchaApi.getRecordApi<{ id: string }>({ id })
}
