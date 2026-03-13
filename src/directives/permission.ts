import { usePermission } from '@/composables'

import type { Directive } from 'vue'

type PermissionValue = string | string[]

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionValue>) {
    const { value } = binding
    const { hasPermission } = usePermission()
    if (!hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  },
}
