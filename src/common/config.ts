import {
  MenuModeEnum,
  MenuTypeEnum,
  TopMenuAlignEnum,
  TriggerEnum,
  MixSidebarTriggerEnum,
} from '/@/enums/menuEnum';
import type {
  MenuSetting,
  MultiTabsSetting,
  HeaderSetting,
  TransitionSetting,
  ProjectConfig,
  GlobConfig,
} from '/#/config';

import {
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  PermissionModeEnum,
  SessionTimeoutProcessingEnum,
  ContentEnum,
} from '/@/enums/appEnum';
import { CacheTypeEnum } from '/@/enums/cacheEnum';

const menuSetting: MenuSetting = {
  bgColor: '',
  fixed: true,
  collapsed: false,
  canDrag: false,
  show: true,
  split: true,
  menuWidth: 200,
  collapsedWidth: 60,
  mode: MenuModeEnum.INLINE,
  type: MenuTypeEnum.SIDEBAR,
  theme: ThemeEnum.Dark,
  topMenuAlign: TopMenuAlignEnum.CENTER,
  trigger: TriggerEnum.NONE,
  accordion: true,
  closeMixSidebarOnChange: true,
  collapsedShowTitle: true,
  mixSideTrigger: MixSidebarTriggerEnum.HOVER,
  mixSideFixed: true,
};

const multiTabsSetting: MultiTabsSetting = {
  cache: true,
  show: true,
  showQuick: true,
  canDrag: true,
  showRedo: true,
  showFold: true,
  enableRightClickMenu: true,
};

const headerSetting: HeaderSetting = {
  bgColor: '#fff',
  fixed: true,
  show: true,
  theme: ThemeEnum.Light,
  showFullScreen: true,
  useLockPage: true,
  showDoc: true,
  showNotice: true,
  showSearch: true,
};

const transitionSetting: TransitionSetting = {
  enable: true,
  basicTransition: RouterTransitionEnum.FADE,
  openPageLoading: true,
  openNProgress: true,
};

export const config: ProjectConfig = {
  permissionCacheType: CacheTypeEnum.LOCAL,
  showSettingButton: true,
  showDarkModeToggle: true,
  settingButtonPosition: SettingButtonPositionEnum.HEADER,
  permissionMode: PermissionModeEnum.ROLE,
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,
  grayMode: false,
  colorWeak: false,
  themeColor: '#1890FF',

  fullContent: false,
  contentMode: ContentEnum.FULL,
  showLogo: true,
  showFooter: false,
  headerSetting,
  menuSetting,
  multiTabsSetting,
  transitionSetting,
  openKeepAlive: true,
  lockTime: 1000 * 60,
  showBreadCrumb: true,
  showBreadCrumbIcon: true,
  useErrorHandle: true,
  useOpenBackTop: true,
  canEmbedIFramePage: true,
  closeMessageOnSwitch: true,
  removeAllHttpPending: true,
};

export const globConfig: GlobConfig = {
  title: 'wuhu-vue-admin',
  apiUrl: '',
  uploadUrl: '',
  urlPrefix: '',
  shortName: 'wuhu',
};
