import { computed, reactive, ref, toValue } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { evaluateExpression, expressionFunctions } from '../expression'
import { componentRegistry } from '../registry'
import { actionRegistry, parseValueSchema } from './actions'
import { executeQuery } from './datasource'
import { createPermissionChecker } from './permissions'
import { runWorkflow as executeWorkflow } from './workflow'
import type { WorkflowRunResult } from './workflow'
import { structuredCloneSafe } from '../schema'
import type {
  ApplicationSchema,
  ComponentSchema,
  PageSchema,
  QuerySchema,
} from '../schema/types'
import type { DeviceKind } from './style'
import type { PermissionUser } from './permissions'

export interface QueryState {
  data: unknown
  loading: boolean
  error: string | null
  updatedAt: number | null
}

export interface RuntimeOptions {
  schema: ApplicationSchema
  page?: PageSchema | Ref<PageSchema> | ComputedRef<PageSchema>
  device?: DeviceKind | Ref<DeviceKind>
  user?: PermissionUser
  routeParams?: Record<string, string>
  navigate?: (path: string, query?: Record<string, unknown>) => void
  onWorkflowRun?: (workflowId: string, result: WorkflowRunResult) => void
}

export interface EvaluateOptions {
  fallback?: unknown
  /** 额外作用域（例如工作流 loop 的 item、事件 payload） */
  scope?: Record<string, unknown>
}

export interface RuntimeApi {
  readonly schema: ApplicationSchema
  readonly app: Record<string, unknown>
  readonly page: ComputedRef<Record<string, unknown>>
  readonly variables: Record<string, unknown>
  readonly queries: Record<string, QueryState>
  readonly user: Record<string, unknown>
  readonly device: Ref<DeviceKind>
  evaluate: (expression: string, options?: EvaluateOptions) => unknown
  resolveValue: (value: unknown, fallback?: unknown) => unknown
  resolveProps: (node: ComponentSchema) => Record<string, unknown>
  setVariable: (name: string, value: unknown) => void
  setVariables: (values: Record<string, unknown>) => void
  runQuery: (
    id: string,
    overrideParams?: Record<string, unknown>
  ) => Promise<unknown>
  runAction: (id: string, env?: Record<string, unknown>) => Promise<unknown>
  runWorkflow: (id: string) => Promise<WorkflowRunResult>
  navigate: (path: string, query?: Record<string, unknown>) => void
  dispatch: (
    node: ComponentSchema,
    eventName: string,
    payload?: unknown
  ) => Promise<void>
  can: (resource: string, action: string) => boolean
  canAccessPage: (pageId: string) => boolean
  refreshAutoQueries: () => Promise<void>
  dispose: () => void
}

const QUERY_INITIAL: QueryState = {
  data: null,
  loading: false,
  error: null,
  updatedAt: null,
}

function cloneDefault(value: unknown) {
  if (Array.isArray(value))
    return value.map((item) => structuredCloneSafe(item))
  if (value && typeof value === 'object') {
    return structuredCloneSafe(value as Record<string, unknown>)
  }
  return value
}

/**
 * Runtime：解析并执行 Application Schema。
 * 设计器画布与运行时页面复用同一个 Runtime，保证「所见即所得」。
 */
export function createRuntime(options: RuntimeOptions): RuntimeApi {
  const { schema } = options
  const pageRef = computed(() => toValue(options.page) ?? schema.pages[0])
  const device = (
    options.device && typeof options.device === 'object'
      ? options.device
      : ref(options.device ?? 'pc')
  ) as Ref<DeviceKind>
  const routeParams = options.routeParams ?? {}
  const user = reactive<Record<string, unknown>>(
    (options.user as Record<string, unknown> | undefined) ?? {
      id: 'anonymous',
      name: '用户',
      role: 'admin',
    }
  )

  const permissionChecker = computed(() =>
    createPermissionChecker(schema.permissions, user as PermissionUser)
  )

  const page = computed<Record<string, unknown>>(() => {
    const current = pageRef.value
    return {
      id: current?.id,
      name: current?.name,
      path: current?.path,
      params: routeParams,
    }
  })

  const app = {
    id: schema.app.id,
    name: schema.app.name,
    version: schema.app.version,
  }

  const variables = reactive<Record<string, unknown>>({})

  const queries = reactive<Record<string, QueryState>>({})
  for (const query of schema.queries) {
    queries[query.id] = reactive({ ...QUERY_INITIAL })
  }

  function buildScope(extra?: Record<string, unknown>) {
    const scope: Record<string, unknown> = {
      app,
      page: page.value,
      variables,
      queries,
      user,
      functions: expressionFunctions,
    }
    if (extra) Object.assign(scope, extra)
    return scope
  }

  function evaluate(
    expression: string,
    evaluateOptions: EvaluateOptions = {}
  ): unknown {
    if (!expression) return evaluateOptions.fallback
    return evaluateExpression(expression, {
      fallback: evaluateOptions.fallback,
      scope: buildScope(evaluateOptions.scope),
      functions: expressionFunctions,
      silent: true,
    })
  }

  function resolveValue(value: unknown, fallback?: unknown): unknown {
    const schemaValue = parseValueSchema(value)
    if (!schemaValue) return value
    if (schemaValue.type === 'value') return schemaValue.value
    return evaluate(schemaValue.value, { fallback })
  }

  function resolveProps(node: ComponentSchema) {
    const resolved: Record<string, unknown> = {}
    const definition = componentRegistry.getDefinition(node.type)
    if (definition) {
      for (const [key, value] of Object.entries(definition.defaultProps)) {
        resolved[key] = cloneDefault(value)
      }
      for (const field of definition.props) {
        if (
          field.defaultValue !== undefined &&
          resolved[field.key] === undefined
        ) {
          resolved[field.key] = cloneDefault(field.defaultValue)
        }
      }
    }
    Object.assign(resolved, node.props ?? {})
    if (node.bindings) {
      for (const [key, expression] of Object.entries(node.bindings)) {
        if (!expression) continue
        resolved[key] = evaluate(expression, { fallback: node.props?.[key] })
      }
    }
    return resolved
  }

  function setVariable(name: string, value: unknown) {
    if (!name) return
    variables[name] = value
  }

  function setVariables(values: Record<string, unknown>) {
    Object.assign(variables, values)
  }

  function resolveQueryParams(
    query: QuerySchema,
    override?: Record<string, unknown>
  ) {
    const params: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(query.params ?? {})) {
      params[key] = resolveValue(value)
    }
    if (override) Object.assign(params, override)
    return params
  }

  async function runQuery(
    id: string,
    overrideParams?: Record<string, unknown>
  ) {
    const query = schema.queries.find((item) => item.id === id)
    if (!query) return undefined
    let state = queries[id]
    if (!state) {
      state = reactive({ ...QUERY_INITIAL })
      queries[id] = state
    }
    state.loading = true
    state.error = null
    try {
      const dataSource = schema.dataSources.find(
        (source) => source.id === query.dataSourceId
      )
      const raw = await executeQuery({
        query,
        dataSource,
        params: resolveQueryParams(query, overrideParams),
        resolveValue,
      })
      let data = raw
      if (query.transform) {
        data = evaluate(query.transform, {
          fallback: raw,
          scope: { _: raw, ...queries, variables },
        })
      }
      state.data = data
      state.updatedAt = Date.now()
      return data
    } catch (error) {
      state.error = error instanceof Error ? error.message : '查询失败'
      if (query.strict) throw error
      return undefined
    } finally {
      state.loading = false
    }
  }

  async function runAction(id: string, env: Record<string, unknown> = {}) {
    const action = schema.actions.find((item) => item.id === id)
    if (!action) return undefined
    const definition = actionRegistry.get(action.type)
    if (!definition) {
      console.warn(`[low-code] 未注册的 Action 类型: ${action.type}`)
      return undefined
    }
    const params: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(action.params ?? {})) {
      params[key] = resolveValue(value)
    }
    return definition.handler({ params, runtime, env })
  }

  async function runWorkflow(id: string): Promise<WorkflowRunResult> {
    const workflow = schema.workflows.find((item) => item.id === id)
    if (!workflow) {
      return { status: 'error', logs: [], error: new Error('工作流不存在') }
    }
    const result = await executeWorkflow(workflow, runtime)
    options.onWorkflowRun?.(id, result)
    if (result.status === 'error') {
      console.warn(`[low-code] 工作流执行失败: ${workflow.name}`, result)
    }
    return result
  }

  async function dispatch(
    node: ComponentSchema,
    eventName: string,
    payload?: unknown
  ) {
    const event = node.events?.find((item) => item.name === eventName)
    if (!event || event.enabled === false) return
    const env = { event: payload, $event: payload }
    for (const actionId of event.actions) {
      await runAction(actionId, env)
    }
  }

  const intervalTimers: number[] = []

  async function refreshAutoQueries() {
    const tasks = schema.queries
      .filter((query) => query.trigger === 'pageLoad')
      .map((query) => runQuery(query.id))
    for (const query of schema.queries) {
      if (!query.interval) continue
      const timer = window.setInterval(() => {
        runQuery(query.id)
      }, query.interval)
      intervalTimers.push(timer)
    }
    await Promise.all(tasks)
  }

  function navigate(path: string, query?: Record<string, unknown>) {
    if (options.navigate) {
      options.navigate(path, query)
      return
    }
    console.warn(`[low-code] 未配置路由跳转能力: ${path}`, query)
  }

  const runtime: RuntimeApi = {
    schema,
    app,
    page,
    variables,
    queries,
    user,
    device,
    evaluate,
    resolveValue,
    resolveProps,
    setVariable,
    setVariables,
    runQuery,
    runAction,
    runWorkflow,
    navigate,
    dispatch,
    can: (resource, action) => permissionChecker.value.can(resource, action),
    canAccessPage: (pageId) => permissionChecker.value.canAccessPage(pageId),
    refreshAutoQueries,
    dispose: () => {
      intervalTimers.forEach((timer) => window.clearInterval(timer))
      intervalTimers.length = 0
    },
  }

  // 初始化变量（表达式变量可引用 queries/app/user）
  for (const variable of schema.variables) {
    variables[variable.name] = variable.initial
      ? resolveValue(variable.initial)
      : undefined
  }

  return runtime
}
