import Icon from './src/index.vue'
import type { App } from 'vue'

export type * from './src/types'

Icon.install = (app: App) => {
  app.component('Icon', Icon)
}
export { Icon }
export default Icon
