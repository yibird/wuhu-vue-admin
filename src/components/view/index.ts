import View from './src/index.vue'
import WViewHeader from './src/view-header.vue'
import WViewContent from './src/view-content.vue'
import WViewFooter from './src/view-footer.vue'
import WViewSider from './src/view-sider.vue'
export type {
  WViewProps,
  WViewSiderProps,
  WViewHeaderProps,
  WViewContentProps,
  WViewFooterProps,
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
