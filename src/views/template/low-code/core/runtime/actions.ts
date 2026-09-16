import { message } from 'antdv-next'
import type { ValueSchema } from '../schema/types'
import type { RuntimeApi } from './runtime'

export interface ActionParamField {
  key: string
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'switch'
    | 'select'
    | 'json'
    | 'variable'
    | 'query'
    | 'workflow'
    | 'page'
  description?: string
  placeholder?: string
  options?: { label: string; value: string | number | boolean }[]
  defaultValue?: unknown
}

export interface ActionContext {
  params: Record<string, unknown>
  runtime: RuntimeApi
  env: Record<string, unknown>
}

export type ActionHandler = (
  context: ActionContext
) => unknown | Promise<unknown>

export interface ActionTypeDefinition {
  type: string
  label: string
  description?: string
  icon?: string
  params: ActionParamField[]
  handler: ActionHandler
}

/**
 * ActionRegistry：Action 类型的注册表。
 * ActionSchema 描述实例（参数），ActionTypeDefinition 描述能力（参数定义 + 执行器）。
 */
class ActionRegistry {
  private readonly items = new Map<string, ActionTypeDefinition>()

  register(definition: ActionTypeDefinition) {
    this.items.set(definition.type, definition)
  }

  has(type: string) {
    return this.items.has(type)
  }

  get(type: string) {
    return this.items.get(type)
  }

  list() {
    return [...this.items.values()]
  }
}

export const actionRegistry = new ActionRegistry()

export function parseValueSchema(value: unknown): ValueSchema | undefined {
  if (!value || typeof value !== 'object') return undefined
  const candidate = value as { type?: string; value?: unknown }
  if (candidate.type === 'value' || candidate.type === 'expression') {
    return candidate as ValueSchema
  }
  return undefined
}

let installed = false

/** 注册内置 Action 类型（幂等） */
export function setupBuiltinActions() {
  if (installed) return
  installed = true

  actionRegistry.register({
    type: 'setVariable',
    label: '设置变量',
    description: '更新应用运行时的变量值',
    icon: 'i-lucide:variable',
    params: [
      {
        key: 'name',
        label: '变量名',
        type: 'variable',
        placeholder: '例如 username',
      },
      {
        key: 'value',
        label: '变量值',
        type: 'text',
        description: '支持表达式，例如 queries.users.data',
      },
    ],
    handler: ({ params, runtime }) => {
      const name = String(params.name ?? '')
      if (!name) return
      runtime.setVariable(name, params.value)
    },
  })

  actionRegistry.register({
    type: 'setVariables',
    label: '批量设置变量',
    description: '通过对象表达式批量更新变量',
    icon: 'i-lucide:braces',
    params: [
      {
        key: 'values',
        label: '变量对象',
        type: 'json',
        description: '例如 { loading: true, count: variables.count + 1 }',
      },
    ],
    handler: ({ params, runtime }) => {
      const values = params.values
      if (values && typeof values === 'object') {
        runtime.setVariables(values as Record<string, unknown>)
      }
    },
  })

  actionRegistry.register({
    type: 'runQuery',
    label: '执行查询',
    description: '重新执行指定查询并写入查询结果',
    icon: 'i-lucide:database-zap',
    params: [
      { key: 'query', label: '查询', type: 'query' },
      {
        key: 'params',
        label: '临时参数',
        type: 'json',
        description: '覆盖查询默认参数',
      },
    ],
    handler: async ({ params, runtime }) => {
      const queryId = String(params.query ?? '')
      if (!queryId) return
      await runtime.runQuery(
        queryId,
        (params.params as Record<string, unknown>) ?? undefined
      )
    },
  })

  actionRegistry.register({
    type: 'runWorkflow',
    label: '执行工作流',
    description: '触发一个已定义的工作流',
    icon: 'i-lucide:workflow',
    params: [{ key: 'workflow', label: '工作流', type: 'workflow' }],
    handler: async ({ params, runtime }) => {
      const workflowId = String(params.workflow ?? '')
      if (!workflowId) return
      await runtime.runWorkflow(workflowId)
    },
  })

  actionRegistry.register({
    type: 'showMessage',
    label: '消息提示',
    description: '展示全局消息',
    icon: 'i-lucide:message-circle',
    params: [
      {
        key: 'type',
        label: '提示类型',
        type: 'select',
        options: [
          { label: '成功', value: 'success' },
          { label: '信息', value: 'info' },
          { label: '警告', value: 'warning' },
          { label: '错误', value: 'error' },
        ],
        defaultValue: 'success',
      },
      { key: 'content', label: '提示内容', type: 'text' },
      {
        key: 'duration',
        label: '持续时间(s)',
        type: 'number',
        defaultValue: 2,
      },
    ],
    handler: ({ params }) => {
      const type = String(params.type ?? 'info')
      const content = String(params.content ?? '')
      const duration = Number(params.duration ?? 2)
      const handler = message[type as 'success' | 'info' | 'warning' | 'error']
      if (typeof handler === 'function') handler({ content, duration })
    },
  })

  actionRegistry.register({
    type: 'navigate',
    label: '页面跳转',
    description: '路由跳转到指定页面',
    icon: 'i-lucide:route',
    params: [
      {
        key: 'path',
        label: '目标路径',
        type: 'text',
        placeholder: '/dashboard',
      },
      { key: 'query', label: '查询参数', type: 'json' },
    ],
    handler: ({ params, runtime }) => {
      const path = String(params.path ?? '')
      if (!path) return
      runtime.navigate(
        path,
        (params.query as Record<string, unknown>) ?? undefined
      )
    },
  })

  actionRegistry.register({
    type: 'openUrl',
    label: '打开链接',
    description: '在新窗口或当前窗口打开链接',
    icon: 'i-lucide:external-link',
    params: [
      { key: 'url', label: '链接地址', type: 'text' },
      {
        key: 'target',
        label: '打开方式',
        type: 'select',
        options: [
          { label: '新窗口', value: '_blank' },
          { label: '当前窗口', value: '_self' },
        ],
        defaultValue: '_blank',
      },
    ],
    handler: ({ params }) => {
      const url = String(params.url ?? '')
      if (!url) return
      window.open(url, String(params.target ?? '_blank'))
    },
  })

  actionRegistry.register({
    type: 'copy',
    label: '复制文本',
    description: '复制内容到剪贴板',
    icon: 'i-lucide:clipboard-copy',
    params: [{ key: 'text', label: '复制内容', type: 'textarea' }],
    handler: async ({ params }) => {
      const text = String(params.text ?? '')
      if (!text) return
      await navigator.clipboard.writeText(text)
      message.success('已复制到剪贴板')
    },
  })
}
