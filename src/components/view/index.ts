import { default as ViewComponent } from './src/index.vue'
import ViewHeader from './src/view-header.vue'
import ViewContent from './src/view-content.vue'
import ViewFooter from './src/view-footer.vue'
import ViewSider from './src/view-sider.vue'
export type {
  ViewProps,
  ViewSiderProps,
  ViewHeaderProps,
  ViewContentProps,
  ViewFooterProps,
} from './src/types'

const View = ViewComponent as typeof ViewComponent & {
  Header: typeof ViewHeader
  Content: typeof ViewContent
  Sider: typeof ViewSider
  Footer: typeof ViewFooter
}

View.Header = ViewHeader
View.Content = ViewContent
View.Sider = ViewSider
View.Footer = ViewFooter

export { View, ViewHeader, ViewContent, ViewFooter, ViewSider }
