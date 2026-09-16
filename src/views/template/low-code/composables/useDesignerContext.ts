import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'
import type { DesignerApi } from './useDesigner'

const DESIGNER_KEY: InjectionKey<DesignerApi> = Symbol('low-code-designer')

export function provideDesigner(api: DesignerApi) {
  provide(DESIGNER_KEY, api)
}

export function useDesignerContext(): DesignerApi {
  const api = inject(DESIGNER_KEY)
  if (!api) {
    throw new Error('[low-code] Designer 上下文未注入')
  }
  return api
}
