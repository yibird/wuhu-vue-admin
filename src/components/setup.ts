import { Icon } from './icon'
import { ActionButton } from './action-button'
import {
  WView,
  WViewHeader,
  WViewContent,
  WViewFooter,
  WViewSider,
} from './view'
import { withInstall } from './utils'
import type { App, Component } from 'vue'

const components: Record<string, Component> = {
  Icon,
  ActionButton,
  WView,
  WViewHeader,
  WViewContent,
  WViewFooter,
  WViewSider,
}

export const globalComponents = {
  install(app: App) {
    Object.values(components).forEach((component) => {
      withInstall(component).install(app)
    })
  },
}
