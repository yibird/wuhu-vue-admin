import type { SiderThemeType, HeaderWidgetType } from '@/constants'

import type {
  MenuMode,
  ThemeMode,
  Locale,
  TabsTheme,
  PageAnimation,
  LoadingAnimation,
  PageAnimationMode,
} from '@/config'

export type MenuType = 0 | 1 | 2 | 3

interface MenuBase {
  /**
   * @desc 菜单id
   * @default
   */
  id: string
  /**
   * @desc 菜单标题
   * @default
   */
  title: string
  /**
   * @desc 菜单类型,0目录、1菜单项、2子页面、3权限按钮
   * @default
   */
  type: MenuType
  /**
   * @desc 访问页面所需权限
   */
  permission?: string

  /**
   * @desc 当前菜单的根节点,值为 "0" 表示一级菜单
   * @default
   */
  rootId: string
  /**
   * @desc 当前菜单的父级id,值为 "0" 表示一级菜单
   * @default
   */
  parentId: string
  /**
   * @desc 菜单级别路径,由父级id和当前菜单id组成,元素之间使用 - 号分割
   */
  level?: string
  /**
   * @desc 菜单图标
   * @default
   */
  icon?: string | null
  /**
   * @desc icon 背景色
   * @default
   */
  iconBgColor?: string
  /**
   * @desc icon 形状
   * @default
   */
  iconShape?: 'round' | 'square'
  /**
   * @desc 是否为首页,仅在menu类型为1时生效
   * @default false
   */
  home?: boolean
  /**
   * @desc 是否开启页面缓存；未配置时默认开启，权限按钮不参与缓存
   * @default true
   */
  keepAlive?: boolean
  /**
   * @desc 是否为外部链接
   * @default false
   */
  isExternal?: boolean
  /**
   * @desc 外部链接打开方式
   * @default '_blank'
   */
  externalTarget?: '_blank' | '_self'
  /**
   * @desc 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * @desc 是否固定
   * @default false
   */
  fixed?: boolean
  /**
   * @desc 是否收藏
   * @default false
   */
  collect?: boolean
  /**
   * @desc 查询参数
   */
  query?: Record<string, unknown>
  /**
   * @desc 路由参数
   */
  params?: Record<string, unknown>
}

export interface MenuDirectory extends MenuBase {
  type: 0
  path?: string
  children?: IMenu[]
}

export interface MenuRoute extends MenuBase {
  type: 1 | 2
  path: string
  children?: IMenu[]
}

export interface MenuAction extends MenuBase {
  type: 3
  path?: never
  children?: never
}

export type IMenu = MenuDirectory | MenuRoute | MenuAction

export type ITab = Omit<IMenu, 'children' | 'id' | 'path' | 'type'> & {
  id: string
  /**
   * @desc 标签页名称
   * @default
   */
  name: string
  /**
   * @desc 标签页路径
   * @default
   */
  path: string
  /**
   * @desc 是否为首页
   * @default false
   */
  home?: boolean
  type: 1 | 2
}

export interface SiderConfig {
  /**
   * @desc 是否显示侧边栏
   * @default true
   */
  show: boolean
  /**
   * @desc 侧边栏主题
   * @default
   */
  theme: SiderThemeType
  /**
   * @desc 侧边菜单是否固定
   * @default false
   */
  fixed: boolean
  /**
   * @desc 侧边栏展开的宽度
   * @default 240
   */
  width: number
  /**
   * @desc 侧边菜单是否收缩
   * @default false
   */
  collapsed: boolean
  /**
   * @desc 收缩侧边栏宽度
   * @default 60
   */
  collapsedWidth: number

  /**
   * @desc 是否显示logo
   * @default true
   */
  showLogo: boolean
  /**
   * @desc 是否启用菜单搜索功能
   * @default true
   */
  showSearch: boolean
  /**
   * @desc 是否启用菜单过滤(例如星标、最近使用、收藏等菜单)
   * @default true
   */
  showAdvancedNav: boolean
}

export interface HeaderConfig {
  /**
   * @desc 是否显示header
   * @default true
   */
  show: boolean
  /**
   * @desc 是否固定header
   * @default true
   */
  fixed: boolean
  /**
   * @desc 是否显示面包屑
   * @default true
   */
  showBreadcrumb: boolean
  /**
   * @desc 是否显示面包屑图标
   * @default false
   */
  showBreadCrumbIcon: boolean
  /**
   * @desc header右侧部件
   * @default [HeaderWidget.Search,HeaderWidget.Translate,HeaderWidget.FullScreen,HeaderWidget.LockScreen,HeaderWidget.Setting]
   */
  widgets: HeaderWidgetType[]
}

export interface TabConfig {
  /**
   * @desc 是否显示标签页
   * @default true
   */
  show: boolean
  /**
   * @desc 是否显示标签页图标
   * @default true
   */
  showIcon: boolean
  /**
   * @desc 是否启用标签页拖拽
   * @default true
   */
  enableDrag: boolean
  /**
   * @desc 是否启用标签页持久化
   * @default true
   */
  enablePersist: boolean
  /**
   * @desc 标签页主题
   * @default TabsTheme.Card
   */
  theme?: TabsTheme
}

export interface FooterConfig {
  /**
   * @desc 是否显示footer
   * @default false
   */
  show: boolean
  /**
   * @desc 是否固定footer
   * @default false
   */
  fixed: boolean
}

export interface AnimationConfig {
  /**
   * @desc 是否启用页面切换进度条
   * @default true
   */
  enableProgressBar: boolean
  /**
   * @desc 是否启用页面切换loading
   * @default true
   */
  enablePageLoading?: boolean
  /**
   * @desc 页面切换 Loading 动画
   * @default LoadingAnimation.Beat
   */
  loadingAnimation?: LoadingAnimation
  /**
   * @desc 页面切换动画
   * @default PageAnimation.SlideLeft
   */
  pageAnimation?: PageAnimation

  /**
   * @desc 页面动画mode
   * @default PageAnimation.DEFAULT
   */
  pageAnimationMode?: PageAnimationMode
}

export interface LockscreenConfig {}

export interface CopyrightConfig {
  /**
   * @desc 是否显示版权信息,仅在显示footer时生效
   * @default false
   */
  show: boolean
  /**
   * @desc 公司名称
   * @default
   */
  companyName: string
  /**
   * @desc 公司主页
   * @default
   */
  companyUrl: string
  /**
   * @desc 日期
   * @default
   */
  date: string
  /**
   * @desc icp备案号
   * @default
   */
  icpNo: string
  /**
   * @desc icp备案地址
   * @default
   */
  icpUrl: string
}

export interface AppConfig {
  /**
   * @desc 应用名称
   * @default 'wuhu-react-admin'
   */
  name: string
  /**
   * @desc 应用logo
   * @default ''
   */
  logo: string
  /**
   * @desc 主题
   * @default ThemeMode.Light
   */
  themeMode: ThemeMode
  /**
   * @desc 主题色
   * @default ''
   */
  themeColor: string
  /**
   * @desc 语言
   * @default Locale.ZH_CN
   */
  locale: Locale
  /**
   * @desc 菜单模式
   */
  menuMode: MenuMode
  /**
   * @desc 是否启用页面缓存
   * @default true
   */
  pageCache: boolean
  /**
   * @desc 页面缓存实例上限
   * @default 10
   */
  pageCacheMax: number
  /**
   * @desc 显示水印
   * @default false
   */
  showWatermark: boolean
  /**
   * @desc 是否开启定时检查更新
   * @default true
   */
  checkUpdate: boolean
  /**
   * @desc 边框圆角
   * @default 2
   */
  borderRadius: number
  /**
   * @desc 色弱模式
   * @default false
   */
  colourWeakness: boolean
  /**
   * @desc 灰色模式
   * @default false
   */
  greyMode: boolean
}
export interface ShortcutKey {
  /**
   * @desc 是否启用快捷键
   * @default true
   */
  enabled: boolean
  /**
   * @desc 是否启用全局搜索快捷键(Ctrl K)
   * @default true
   */
  search: boolean
  /**
   * @desc 是否启用退出登录快捷键(Alt Q)
   * @default true
   */
  logout: boolean
  /**
   * @desc 是否启用锁定屏幕快捷键(Alt L)
   * @default true
   */
  lockScreen: boolean
}
export interface ProjectConfig {
  sider: SiderConfig
  header: HeaderConfig
  tab: TabConfig
  footer: FooterConfig
  animation: AnimationConfig
  lockscreen: LockscreenConfig
  app: AppConfig
  copyright: CopyrightConfig
  shortcutKey: ShortcutKey
}
