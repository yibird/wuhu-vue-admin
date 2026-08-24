import { permission } from './permission'
import { copy } from './copy'
import { debounce } from './debounce'
import { throttle } from './throttle'
import { clickOutside } from './clickOutside'
import { ellipsisTooltip } from './ellipsisTooltip'

import type { App, Directive } from 'vue'

const directives: Record<string, Directive> = {
  permission,
  debounce,
  throttle,
  copy,
  clickOutside,
  ellipsisTooltip,
}

export const globalDirectives = {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  },
}

export { permission, copy, debounce, throttle, clickOutside, ellipsisTooltip }
