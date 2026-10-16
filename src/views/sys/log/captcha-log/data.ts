import { formatLogTime } from '../data'
import type {
  CaptchaLogDetail,
  CaptchaScene,
  CaptchaType,
  LogStatus,
} from '@/apis'
import type { LogDetailField, LogDetailGroup } from '../components'

/**
 * 验证码类型展示配置
 */
export const captchaTypeMeta: Record<
  CaptchaType,
  {
    /**
     * @desc 类型名称
     */
    label: string
    /**
     * @desc 标签颜色
     */
    color: string
  }
> = {
  image: { label: '图形验证码', color: 'blue' },
  sms: { label: '短信验证码', color: 'green' },
  email: { label: '邮箱验证码', color: 'purple' },
}

/**
 * 验证码类型下拉选项
 */
export const captchaTypeOptions = (
  Object.keys(captchaTypeMeta) as CaptchaType[]
).map((value) => ({
  label: captchaTypeMeta[value].label,
  value,
}))

/**
 * 取验证码类型的展示配置
 *
 * 表格插槽里的 record 是 any,这里收敛一次类型并兜底未知类型
 *
 * @param type 验证码类型
 */
export function resolveCaptchaTypeMeta(type: CaptchaType) {
  return captchaTypeMeta[type] ?? captchaTypeMeta.image
}

/**
 * 使用场景展示配置
 */
export const captchaSceneMeta: Record<CaptchaScene, string> = {
  login: '登录',
  register: '注册',
  resetPassword: '重置密码',
  bind: '绑定账号',
}

/**
 * 使用场景下拉选项
 */
export const captchaSceneOptions = (
  Object.keys(captchaSceneMeta) as CaptchaScene[]
).map((value) => ({
  label: captchaSceneMeta[value],
  value,
}))

/**
 * 取使用场景的名称
 *
 * @param scene 使用场景
 */
export function resolveCaptchaSceneLabel(scene: CaptchaScene) {
  return captchaSceneMeta[scene] ?? scene
}

/**
 * 校验结果展示配置(与通用的成功/失败区分措辞)
 */
const captchaStatusMeta: Record<
  LogStatus,
  {
    /**
     * @desc 结果名称
     */
    label: string
    /**
     * @desc 标签颜色
     */
    color: string
  }
> = {
  1: { label: '通过', color: 'success' },
  0: { label: '未通过', color: 'error' },
}

/**
 * 校验结果下拉选项
 */
export const captchaStatusOptions = (
  Object.keys(captchaStatusMeta) as unknown as LogStatus[]
).map((value) => ({
  label: captchaStatusMeta[value].label,
  value: Number(value),
}))

/**
 * 取校验结果的展示配置
 *
 * @param status 校验结果
 */
export function resolveCaptchaStatusMeta(status: LogStatus) {
  return captchaStatusMeta[status] ?? captchaStatusMeta[0]
}

/**
 * 组装验证码日志详情的基本信息
 *
 * @param detail 日志详情
 */
export function createCaptchaDetailFields(
  detail?: CaptchaLogDetail
): LogDetailField[] {
  if (!detail) return []

  return [
    { label: '日志 ID', value: detail.id },
    { label: 'Trace ID', value: detail.traceId },
    { label: '验证码类型', value: resolveCaptchaTypeMeta(detail.type).label },
    { label: '使用场景', value: resolveCaptchaSceneLabel(detail.scene) },
    { label: '接收方', value: detail.receiver },
    { label: '验证码', value: detail.code },
    { label: '校验结果', value: resolveCaptchaStatusMeta(detail.status).label },
    { label: '校验耗时', value: `${detail.costTime} ms` },
    { label: '获取 IP', value: detail.ip },
    { label: '归属地', value: detail.location },
    { label: '发送时间', value: formatLogTime(detail.logAt) },
    { label: '过期时间', value: formatLogTime(detail.expireAt) },
    { label: '操作信息', value: detail.message, span: 2 },
  ]
}

/**
 * 组装验证码日志详情的 JSON 分块
 *
 * @param detail 日志详情
 */
export function createCaptchaDetailGroups(
  detail?: CaptchaLogDetail
): LogDetailGroup[] {
  if (!detail) return []

  return [
    {
      title: '交互数据',
      tabs: [
        { key: 'requestBody', label: '请求参数', data: detail.requestBody },
        { key: 'responseBody', label: '响应内容', data: detail.responseBody },
      ],
    },
  ]
}
