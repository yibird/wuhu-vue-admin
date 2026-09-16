import type { InjectionKey, Ref } from 'vue'
import type { RuntimeApi } from './runtime'

/** Form 容器向子控件暴露的上下文：自动双向绑定表单模型 */
export interface FormRuntimeContext {
  model: Ref<Record<string, unknown>>
}

export const FORM_CONTEXT_KEY: InjectionKey<FormRuntimeContext> = Symbol(
  'low-code-form-context'
)

/** Runtime API 注入 key */
export const RUNTIME_KEY: InjectionKey<RuntimeApi> = Symbol('low-code-runtime')
