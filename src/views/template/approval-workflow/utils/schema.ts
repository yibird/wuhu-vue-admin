import type { ApprovalWorkflowSchema } from '../types'

interface ParsedApprovalWorkflowSchema {
  schema?: ApprovalWorkflowSchema
  error?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isApprovalWorkflowSchema(
  value: unknown
): value is ApprovalWorkflowSchema {
  if (!isRecord(value)) return false
  return isRecord(value.settings) && Array.isArray(value.nodes)
}

export function parseApprovalWorkflowSchema(
  value: string
): ParsedApprovalWorkflowSchema {
  try {
    const parsed: unknown = JSON.parse(value)
    if (!isApprovalWorkflowSchema(parsed)) {
      return { error: 'Schema 必须包含 settings 对象和 nodes 数组' }
    }
    return { schema: parsed }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Schema 解析失败',
    }
  }
}
