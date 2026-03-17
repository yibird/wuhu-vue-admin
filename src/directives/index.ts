import { permission } from './permission'
import { copy } from './copy'
import { debounce } from './debounce'

import type { App, Directive } from 'vue'

const directives: Record<string, Directive> = {
  permission,
  debounce,
  copy,
}

export const globalDirectives = {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  },
}

export { permission, copy, debounce }
