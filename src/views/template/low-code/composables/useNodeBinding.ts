import { computed, inject } from 'vue'
import type { Ref } from 'vue'
import { componentRegistry } from '../core/registry'
import { FORM_CONTEXT_KEY, RUNTIME_KEY } from '../core/runtime/keys'
import { getLayout, mergeStyle, resolveNodeStyle } from '../core/runtime/style'
import { resolveComponentByType } from './useComponentResolver'
import type { ComponentSchema, LayoutMode } from '../core/schema/types'

function handlerKey(name: string) {
  return `on${name.charAt(0).toUpperCase()}${name.slice(1)}`
}

/**
 * 节点渲染绑定：设计器画布与 Runtime 共用同一套 Props/绑定/事件解析逻辑，
 * 保证「设计器复用真实 Runtime」。
 */
export function useNodeBinding(
  node: ComponentSchema,
  parentLayout: Ref<LayoutMode>,
  mode: 'runtime' | 'design' = 'runtime'
) {
  const runtime = inject(RUNTIME_KEY)
  if (!runtime) {
    throw new Error(
      '[low-code] Runtime 未注入，请使用 SchemaRenderer/Canvas 容器渲染节点'
    )
  }
  const form = inject(FORM_CONTEXT_KEY, undefined)

  const definition = computed(() => componentRegistry.getDefinition(node.type))
  const component = computed(() => resolveComponentByType(node.type))

  const resolvedProps = computed(() => {
    const props = runtime.resolveProps(node)
    const model = definition.value?.model
    if (form && model) {
      const name = props.name
      if (name !== undefined && name !== null && name !== '') {
        const modelValue = form.model.value?.[String(name)]
        if (modelValue !== undefined) {
          props[model.prop] = modelValue
        }
      }
    }
    return props
  })

  const listeners = computed(() => {
    const result: Record<string, (payload?: unknown) => void> = {}
    for (const event of definition.value?.events ?? []) {
      result[handlerKey(event.name)] = (payload?: unknown) => {
        runtime.dispatch(node, event.name, payload)
      }
    }
    const model = definition.value?.model
    if (form && model) {
      const existing = result[model.event]
      result[model.event] = (payload?: unknown) => {
        const name = resolvedProps.value.name
        if (name !== undefined && name !== null && name !== '') {
          form.model.value[String(name)] = payload
        }
        existing?.(payload)
      }
    }
    return result
  })

  const style = computed(() =>
    resolveNodeStyle(node, {
      device: runtime.device.value,
      parentLayout: parentLayout.value,
    })
  )

  const layout = computed(() =>
    getLayout(mergeStyle(node.style, runtime.device.value))
  )

  const acceptsChildren = computed(() => !!definition.value?.acceptsChildren)
  const slotName = computed(() => definition.value?.slot ?? 'default')

  const visible = computed(() => {
    if (!node.visible) return true
    if (mode === 'design') return true
    return Boolean(runtime.evaluate(node.visible, { fallback: true }))
  })

  /** 设计模式下 visible 表达式的结果（用于画布状态提示） */
  const conditionHidden = computed(() => {
    if (!node.visible) return false
    return !runtime.evaluate(node.visible, { fallback: true })
  })

  const disabled = computed(() =>
    node.disabled
      ? Boolean(runtime.evaluate(node.disabled, { fallback: false }))
      : false
  )

  return {
    runtime,
    definition,
    component,
    resolvedProps,
    listeners,
    style,
    layout,
    acceptsChildren,
    slotName,
    visible,
    conditionHidden,
    disabled,
  }
}
