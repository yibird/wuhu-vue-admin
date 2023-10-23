import {
  MenuModeEnum,
  MenuTypeEnum,
  TopMenuAlignEnum,
  TriggerEnum,
  MixSidebarTriggerEnum,
} from '/@/enums/menuEnum';

import {
  ThemeEnum,
  SettingButtonPositionEnum,
  RouterTransitionEnum,
  PermissionModeEnum,
} from '/@/enums/appEnum';

import { CacheTypeEnum } from '/@/enums/cacheEnum';

export interface MenuItem {
  /**
   * @desc 菜单项Id
   * @default
   */
  id: number;
  /**
   * @desc 菜单名称
   * @default
   */
  name: string;
  /**
   * @desc 菜单类型,0目录、1菜单、2权限按钮
   * @default
   */
  type: number;
  /**
   * @desc 当前菜单项父菜单Id
   * @default
   */
  parentId?: number | null;
  /**
   * @desc 菜单路由Path,以 / 开头表示内部路由,https表示外链
   * @default
   */
  path: string;
  /**
   * @desc 父级层级路径,以'-'分割父级id
   * @default
   */
  levelPath: string;
  /**
   * @desc 菜单路径参数
   * @default
   */
  paramPath?: string;
  /**
   * @desc 菜单Icon
   * @default
   */
  icon?: string;
  /**
   * @desc 是否隐藏菜单
   * @default
   */
  hidden?: boolean;
  /**
   * @desc 是否禁用菜单
   * @default
   */
  disabled?: boolean;
  /**
   * @desc 排序序号
   * @default
   */
  orderNo?: number;
  /**
   * @desc  菜单路由元信息
   * @default
   */
  meta?: Partial<RouteMeta>;
}

// 菜单设置
export interface MenuSetting {
  // 菜单背景色
  bgColor: string;
  // 是否固定菜单
  fixed: boolean;
  // 菜单收缩状态
  collapsed: boolean;
  // 是否允许拖拽
  canDrag: boolean;
  // 是否显示菜单
  show: boolean;
  // 是否显示分割菜单
  split: boolean;
  // 菜单宽度
  menuWidth: number;
  // inline模式下收缩菜单的宽度
  collapsedWidth: number;
  // 菜单模式
  mode: MenuModeEnum;
  // 菜单类型
  type: MenuTypeEnum;
  // 菜单主题
  theme: ThemeEnum;
  // 顶部菜单排列方式
  topMenuAlign: TopMenuAlignEnum;
  // 折叠触发器位置
  trigger: TriggerEnum;
  // 菜单展开或收缩时是否启用手风琴效果
  accordion: boolean;
  // 关闭最小化侧边栏菜单是否触发onChange函数
  closeMixSidebarOnChange: boolean;
  // 收缩菜单时是否显示title
  collapsedShowTitle: boolean;
  // 修改 Menu 子菜单的触发方式
  mixSideTrigger: MixSidebarTriggerEnum;
  // 最小化侧边栏菜单是否固定
  mixSideFixed: boolean;
}

// 多个tabs配置
export interface MultiTabsSetting {
  // 是否开启缓存
  cache: boolean;
  // 是否显示
  show: boolean;
  showQuick: boolean;
  // 是否允许拖拽
  canDrag: boolean;
  // 是否允许撤销
  showRedo: boolean;
  // 是否允许折叠
  showFold: boolean;
  // 是否启用右击菜单
  enableRightClickMenu: boolean;
}

// 头部设置
export interface HeaderSetting {
  // 头部背景色
  bgColor: string;
  // 是否固定头部
  fixed: boolean;
  // 是否显示头部
  show: boolean;
  // 头部主题
  theme: ThemeEnum;
  // 是否显示打开全屏按钮
  showFullScreen: boolean;
  // 是否显示锁定屏幕
  useLockPage: boolean;
  // 是否显示文档按钮
  showDoc: boolean;
  // 是否显示消息中心按钮
  showNotice: boolean;
  // 是否显示搜索按钮
  showSearch: boolean;
}

// 动画配置
export interface TransitionSetting {
  // 是否打开页面切换动画
  enable: boolean;
  // 路由基本切换动画名称
  basicTransition: RouterTransitionEnum;
  // 是否打开页面切换加载
  openPageLoading: boolean;
  // 是否打开顶部进度条
  openNProgress: boolean;
}

// 项目配置
export interface ProjectConfig {
  // 权限缓存类型
  permissionCacheType: CacheTypeEnum;
  // 是否显示配置按钮
  showSettingButton: boolean;
  // 是否显示主题切换按钮
  showDarkModeToggle: boolean;
  // 配置按钮的显示位置
  settingButtonPosition: SettingButtonPositionEnum;
  // 权限模式
  permissionMode: PermissionModeEnum;
  // 会话超时处理
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum;
  // 网站灰色模式
  grayMode: boolean;
  // 是否开启色弱模式
  colorWeak: boolean;
  // 主题颜色
  themeColor: string;

  // 主界面是否全屏显示,不显示菜单和顶部
  fullContent: boolean;
  // 内容宽度
  contentMode: ContentEnum;
  // 是否显示logo
  showLogo: boolean;
  // 是否显示footer
  showFooter: boolean;
  // 头部设置
  headerSetting: HeaderSetting;
  // 菜单设置
  menuSetting: MenuSetting;
  // 多tabs设置
  multiTabsSetting: MultiTabsSetting;
  // 动画设置
  transitionSetting: TransitionSetting;
  // page是否使用Keepalive
  openKeepAlive: boolean;
  // 锁屏时间
  lockTime: number;
  // 是否显示面包屑
  showBreadCrumb: boolean;
  // 是否显示面包屑icon
  showBreadCrumbIcon: boolean;
  // 使用错误处理程序插件
  useErrorHandle: boolean;
  // 是否使用BackTop
  useOpenBackTop: boolean;
  // 是否可以嵌入iframe页面
  canEmbedIFramePage: boolean;
  // 切换界面时是否删除未关闭的消息并通知
  closeMessageOnSwitch: boolean;
  // 切换接口时是否取消已发送但未响应的http请求
  removeAllHttpPending: boolean;
}

// 全局配置
export interface GlobConfig {
  // 网站名称
  title: string;
  // 服务接口url
  apiUrl: string;
  // 上传接口url
  uploadUrl?: string;
  // 服务接口url前缀
  urlPrefix?: string;
  // 项目缩写
  shortName: string;
}

// 全局环境变量配置
export interface GlobEnvConfig {
  // 网站标题
  VITE_GLOB_APP_TITLE: string;
  // 服务接口url
  VITE_GLOB_API_URL: string;
  // 上传url
  VITE_GLOB_UPLOAD_URL?: string;
  // 服务接口url前缀
  VITE_GLOB_API_URL_PREFIX?: string;
  // 项目缩写
  VITE_GLOB_APP_SHORT_NAME: string;
}
