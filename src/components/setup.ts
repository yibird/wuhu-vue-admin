import { Icon } from './icon'
import {
  WView,
  WViewHeader,
  WViewContent,
  WViewFooter,
  WViewSider,
} from './view'
import { Scrollbar } from './scrollbar'
import { withInstall } from './utils'
import { setModalAppContext } from './modal/src/service'
import type { App, Component } from 'vue'

const components: Record<string, Component> = {
  Icon,
  Scrollbar,
  WView,
  WViewHeader,
  WViewContent,
  WViewFooter,
  WViewSider,
}

export const globalComponents = {
  install(app: App) {
    setModalAppContext(app._context)
    Object.values(components).forEach((component) => {
      withInstall(component).install(app)
    })
  },
}
