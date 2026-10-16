/**
 * 日志模块公共类型
 *
 * 日志是只读流水,不分页以外的写操作,因此不继承 BaseResp,只声明各自用到的字段。
 */

/**
 * 日志类型
 */
export type LogKind = 'login' | 'operation' | 'client' | 'captcha'

/**
 * 执行结果状态(1:成功,0:失败)
 */
export type LogStatus = 1 | 0

/**
 * 客户端日志级别
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/**
 * 日志中的 JSON 负载(请求头、请求体等)
 */
export type LogJson =
  | string
  | number
  | boolean
  | null
  | LogJson[]
  | { [key: string]: LogJson }

/**
 * 日志列表公共字段
 */
export interface LogRespBase {
  /**
   * @desc 主键
   */
  id: string
  /**
   * @desc 链路追踪 ID
   */
  traceId: string
  /**
   * @desc 来源 IP
   */
  ip: string
  /**
   * @desc IP 归属地
   */
  location: string
  /**
   * @desc 日志时间
   */
  logAt: string
}

/**
 * 日志查询公共参数
 */
export interface LogQueryBase {
  /**
   * @desc 页码
   */
  current: number
  /**
   * @desc 每页条数
   */
  pageSize: number
  /**
   * @desc 起始时间
   */
  startTime?: string
  /**
   * @desc 结束时间
   */
  endTime?: string
}

/* ---------------- 登录日志 ---------------- */

/**
 * 登录日志
 */
export interface LoginLogResp extends LogRespBase {
  /**
   * @desc 登录账号
   */
  username: string
  /**
   * @desc 终端系统
   */
  os: string
  /**
   * @desc 浏览器
   */
  browser: string
  /**
   * @desc 登录结果(1:成功,0:失败)
   */
  status: LogStatus
  /**
   * @desc 操作信息
   */
  message: string
  /**
   * @desc 登录耗时(毫秒)
   */
  costTime: number
}

/**
 * 登录日志详情
 */
export interface LoginLogDetail extends LoginLogResp {
  /**
   * @desc 请求头
   */
  requestHeaders: LogJson
  /**
   * @desc 请求参数(密码等敏感字段已脱敏)
   */
  requestBody: LogJson
  /**
   * @desc 响应内容
   */
  responseBody: LogJson
}

/**
 * 登录日志查询参数
 */
export interface LoginLogQuery extends LogQueryBase {
  /**
   * @desc 登录账号
   */
  username?: string
  /**
   * @desc 来源 IP
   */
  ip?: string
  /**
   * @desc 登录结果
   */
  status?: LogStatus
}

/* ---------------- 操作日志 ---------------- */

/**
 * 操作日志
 */
export interface OperationLogResp extends LogRespBase {
  /**
   * @desc 操作人
   */
  username: string
  /**
   * @desc 所属模块
   */
  module: string
  /**
   * @desc 操作描述
   */
  message: string
  /**
   * @desc 请求方法
   */
  method: string
  /**
   * @desc 请求 URI
   */
  uri: string
  /**
   * @desc 终端系统
   */
  os: string
  /**
   * @desc 浏览器
   */
  browser: string
  /**
   * @desc 执行结果(1:成功,0:失败)
   */
  status: LogStatus
  /**
   * @desc 耗时(毫秒)
   */
  costTime: number
}

/**
 * 操作日志详情
 */
export interface OperationLogDetail extends OperationLogResp {
  /**
   * @desc 请求头
   */
  requestHeaders: LogJson
  /**
   * @desc 请求参数
   */
  requestBody: LogJson
  /**
   * @desc 响应头
   */
  responseHeaders: LogJson
  /**
   * @desc 响应内容
   */
  responseBody: LogJson
}

/**
 * 操作日志查询参数
 */
export interface OperationLogQuery extends LogQueryBase {
  /**
   * @desc 操作人
   */
  username?: string
  /**
   * @desc 操作描述关键字
   */
  message?: string
  /**
   * @desc 请求方法
   */
  method?: string
  /**
   * @desc 执行结果
   */
  status?: LogStatus
}

/* ---------------- 客户端日志 ---------------- */

/**
 * 客户端日志
 *
 * 由前端上报,记录浏览器侧的异常与关键链路信息。
 */
export interface ClientLogResp extends LogRespBase {
  /**
   * @desc 日志级别
   */
  level: LogLevel
  /**
   * @desc 日志内容
   */
  message: string
  /**
   * @desc 页面地址
   */
  url: string
  /**
   * @desc 来源模块
   */
  source: string
  /**
   * @desc 登录账号
   */
  username: string
  /**
   * @desc 终端系统
   */
  os: string
  /**
   * @desc 浏览器
   */
  browser: string
}

/**
 * 客户端日志详情
 */
export interface ClientLogDetail extends ClientLogResp {
  /**
   * @desc 异常信息(名称、描述与调用栈)
   */
  error: LogJson
  /**
   * @desc 上报上下文(路由、设备、用户与业务参数)
   */
  context: LogJson
}

/**
 * 客户端日志查询参数
 */
export interface ClientLogQuery extends LogQueryBase {
  /**
   * @desc 日志级别
   */
  level?: LogLevel
  /**
   * @desc 日志内容关键字
   */
  message?: string
  /**
   * @desc 来源模块
   */
  source?: string
}

/* ---------------- 验证码日志 ---------------- */

/**
 * 验证码类型
 */
export type CaptchaType = 'image' | 'sms' | 'email'

/**
 * 验证码用途
 */
export type CaptchaScene = 'login' | 'register' | 'resetPassword' | 'bind'

/**
 * 验证码日志
 */
export interface CaptchaLogResp extends LogRespBase {
  /**
   * @desc 验证码类型
   */
  type: CaptchaType
  /**
   * @desc 使用场景
   */
  scene: CaptchaScene
  /**
   * @desc 接收方(手机号、邮箱或会话标识)
   */
  receiver: string
  /**
   * @desc 验证码(已脱敏)
   */
  code: string
  /**
   * @desc 校验结果(1:通过,0:失败)
   */
  status: LogStatus
  /**
   * @desc 操作信息
   */
  message: string
  /**
   * @desc 校验耗时(毫秒)
   */
  costTime: number
  /**
   * @desc 过期时间
   */
  expireAt: string
}

/**
 * 验证码日志详情
 */
export interface CaptchaLogDetail extends CaptchaLogResp {
  /**
   * @desc 请求参数
   */
  requestBody: LogJson
  /**
   * @desc 响应内容
   */
  responseBody: LogJson
}

/**
 * 验证码日志查询参数
 */
export interface CaptchaLogQuery extends LogQueryBase {
  /**
   * @desc 验证码类型
   */
  type?: CaptchaType
  /**
   * @desc 使用场景
   */
  scene?: CaptchaScene
  /**
   * @desc 校验结果
   */
  status?: LogStatus
}
