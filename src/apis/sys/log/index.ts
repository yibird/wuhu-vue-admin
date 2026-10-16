import { getBaseApi } from '@/apis/util'
import type {
  CaptchaLogDetail,
  CaptchaLogQuery,
  CaptchaLogResp,
  ClientLogDetail,
  ClientLogQuery,
  ClientLogResp,
  LoginLogDetail,
  LoginLogQuery,
  LoginLogResp,
  LogKind,
  OperationLogDetail,
  OperationLogQuery,
  OperationLogResp,
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

const loginApi = getBaseApi<LoginLogResp, LoginLogDetail>(LOG_PREFIX.login)
const operationApi = getBaseApi<OperationLogResp, OperationLogDetail>(
  LOG_PREFIX.operation
)
const clientApi = getBaseApi<ClientLogResp, ClientLogDetail>(LOG_PREFIX.client)
const captchaApi = getBaseApi<CaptchaLogResp, CaptchaLogDetail>(
  LOG_PREFIX.captcha
)

/**
 * 登录日志分页列表
 *
 * @param query 查询参数
 */
export function getLoginLogPageListApi(query: LoginLogQuery) {
  return loginApi.getPageListApi<LoginLogQuery>(query)
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
export function getOperationLogPageListApi(query: OperationLogQuery) {
  return operationApi.getPageListApi<OperationLogQuery>(query)
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
export function getClientLogPageListApi(query: ClientLogQuery) {
  return clientApi.getPageListApi<ClientLogQuery>(query)
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
export function getCaptchaLogPageListApi(query: CaptchaLogQuery) {
  return captchaApi.getPageListApi<CaptchaLogQuery>(query)
}

/**
 * 验证码日志详情
 *
 * @param id 日志主键
 */
export function getCaptchaLogRecordApi(id: string) {
  return captchaApi.getRecordApi<{ id: string }>({ id })
}
