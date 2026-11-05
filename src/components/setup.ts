import { Icon } from './icon'
import { ActionButton } from './action-button'
import { View, ViewHeader, ViewContent, ViewFooter, ViewSider } from './view'
import type { App, Component } from 'vue'

const components: Record<string, Component> = {
  Icon,
  ActionButton,
  View,
  ViewHeader,
  ViewContent,
  ViewFooter,
  ViewSider,
}

export const globalComponents = {
  install(app: App) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component)
    })
  },
}
