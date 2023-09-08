import { App } from 'vue';
import Icon from './Icon'
import Space from './Space'
import Button from './Button'

const components: Component[] = [
  Icon,
  Space,
  Button
]

/**
 * 注册全局组件
 * @param app Vue实例
 */
export function setupRegisterGlobComponent(app: App<Element>) {
  components.forEach(comp => app.use(comp))
}
