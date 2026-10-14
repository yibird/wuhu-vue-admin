import { autoFixSpec, formatSpecIssues, validateSpec } from '@json-render/core'
import { catalog } from './catalog'

import type { Spec } from '@json-render/core'

/**
 * 视图解析结果,成功时返回可直接渲染的 spec,失败时返回面向用户的错误说明。
 */
export interface RenderSpecResult {
  /**
   * @desc 校验通过的视图描述
   */
  spec?: Spec
  /**
   * @desc 失败原因
   */
  error?: string
}

/**
 * 解析模型输出的视图 JSON。
 * 先修复常见结构错误,再依次做结构校验与 catalog 校验,避免把非法 spec 交给渲染器。
 */
export function parseRenderSpec(raw: string): RenderSpecResult {
  const source = raw.trim()
  if (!source) return {}

  let parsed: unknown
  try {
    parsed = JSON.parse(source)
  } catch {
    return { error: '视图 JSON 尚未完整或格式错误' }
  }

  const { spec } = autoFixSpec(parsed as Spec)

  const structural = validateSpec(spec)
  if (!structural.valid) {
    return { error: formatSpecIssues(structural.issues) }
  }

  // 交给 catalog 校验会同时补齐 props 默认值
  const validated = catalog.validate(spec)
  if (!validated.success) {
    return {
      error: validated.error?.issues.map((issue) => issue.message).join('；'),
    }
  }

  return { spec: validated.data }
}
