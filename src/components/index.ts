import { Icon } from './Icon'
import type { App, Component } from 'vue'

export * from './Icon'
export * from './Loading'
export * from './AppMenu'
export * from './TablePlus'
export * from './FormPlus'
export * from './JsonView'
export * from './ErrorBoundary'

const components: Record<string, Component> = {
  Icon,
}

export const globalComponents = {
  install(app: App) {
    Object.keys(components).forEach((key) => {
      app.component(key, components[key])
    })
  },
}
