import type {
  MenuModeType,
  SiderThemeType,
  ThemeModeType,
  LocaleType,
  HeaderWidgetType,
  TabsThemeType,
  PageAnimationType,
} from '@/constant'

export interface IMenu {
  /**
   * @desc 菜单id
   * @default
   */
  id: number
  /**
   * @desc 菜单标题
   * @default
   */
  title: string
  /**
   * @desc 菜单类型,0目录、1菜单项、2子页面、3权限按钮
   * @default
   */
  type: number
  /**
   * @desc 菜单跳转路径,仅在菜单类型为1时生效
   * @default
   */
  path?: string
  /**
   * @desc 当前菜单的根节点,为空表示一级菜单
   * @default
   */
  rootId?: number | string | null
  /**
   * @desc 当前菜单的父级id,为空表示一级菜单
   * @default
   */
  parentId?: number | null
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
   * @desc 子菜单
   * @default
   */
  children?: IMenu[]
  /**
   * @desc 是否为首页,仅在menu类型为1时生效
   * @default false
   */
  home?: boolean
  /**
   * @desc 是否开启缓存
   * @default true
   */
  keepAlive?: boolean
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
  query?: Record<string, any>
  /**
   * @desc 路由参数
   */
  params?: Record<string, any>
}

export interface ITab extends Omit<IMenu, 'children' | 'id'> {
  id?: number | string
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

export interface TabsConfig {
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
   * @default TabsThemeType.Card
   */
  theme?: TabsThemeType
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
   * @desc 页面切换动画
   * @default ''
   */
  pageAnimation?: PageAnimationType
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
   * @desc icp备案号
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
  themeMode: ThemeModeType
  /**
   * @desc 主题色
   * @default ''
   */
  themeColor: string
  /**
   * @desc 语言
   * @default Locale.ZH_CN
   */
  locale: LocaleType
  /**
   * @desc 菜单模式
   */
  menuMode: MenuModeType
  /**
   * @desc 是否启用页面缓存
   * @default true
   */
  pageCache: boolean
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
  colourWeakness?: boolean
  /**
   * @desc 灰色模式
   * @default false
   */
  greyMode?: boolean
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
  tabs: TabsConfig
  footer: FooterConfig
  animation: AnimationConfig
  lockscreen: LockscreenConfig
  app: AppConfig
  copyright: CopyrightConfig
  shortcutKey: ShortcutKey
}
