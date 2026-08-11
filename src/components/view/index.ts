import View from './src/index.vue'
import WViewHeader from './src/ViewHeader.vue'
import WViewContent from './src/ViewContent.vue'
import WViewFooter from './src/ViewFooter.vue'
import WViewSider from './src/ViewSider.vue'
export type {
  ViewCollapsibleProps,
  ViewContentProps,
  ViewDirection,
  ViewFooterProps,
  ViewHeaderProps,
  ViewProps,
  ViewSiderProps,
  ViewSize,
} from './src/types'

const WView = View as typeof View & {
  Header: typeof WViewHeader
  Content: typeof WViewContent
  Sider: typeof WViewSider
  Footer: typeof WViewFooter
}

WView.Header = WViewHeader
WView.Content = WViewContent
WView.Sider = WViewSider
WView.Footer = WViewFooter

export { WView, WViewHeader, WViewContent, WViewFooter, WViewSider }
