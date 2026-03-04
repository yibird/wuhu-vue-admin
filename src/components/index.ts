import { Icon } from './Icon'
import type { App } from 'vue'

export * from './Icon'
export * from './Loading'
export * from './AppMenu'
export * from './TablePlus'
export * from './FormPlus'
export * from './JsonView'
export * from './ErrorBoundary'

const globalComponents = [Icon]

export function setupRegisterGlobalComponents(app: App) {
  globalComponents.forEach((component) => {
    const name = component.name || (component as any).__name
    app.component(name, component)
  })
}
