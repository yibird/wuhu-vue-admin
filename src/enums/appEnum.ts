// 主题
export enum ThemeEnum {
  Light = "light",
  Dark = "dark",
}

// 导航栏模式
export enum NavbarModeEnum {
  Left = "left",
  LeftMix = "leftMix",
  Top = "top",
  TopMix = "topMix",
}

// 导航栏风格
export enum NavbarStyleEnum {
  DarkSidebar = "dark-sidebar",
  LightSidebar = "light-sidebar",
  DarkTopBar = "dark-topBar",
}

// 系统主题
export enum SysThemeEnum {
  Red = "#F53F3F",
  OrangeRed = "#F77234",
  Orange = "#FF7D00",
  Gold = "#F7BA1E",
  Yellow = "#FADC19",
  lightGreen = "#9FDB1D",
  Green = "#00B42A",
  Cyan = "#14C9C9",
  Blue = "#3491FA",
  ArcoBlue = "#165DFF",
  Purple = "#722ED1",
  PinkPurple = "#D91AD9",
  Magenta = "#F5319D",
  Gray = "#86909C",
}

// 语言
export enum LanguageEnum {
  // 中文简体
  ZH_CN = "zh_CN",
  // 英语
  EN_US = "en_US",
}

// 权限模式
export enum PermissionModeEnum {
  // role
  ROLE = "ROLE",
  // black
  BACK = "BACK",
  // route mapping
  ROUTE_MAPPING = "ROUTE_MAPPING",
}

// 路由过渡
export enum RouterTransitionEnum {
  ZOOM_FADE = "zoom-fade",
  ZOOM_OUT = "zoom-out",
  FADE_SIDE = "fade-slide",
  FADE = "fade",
  FADE_BOTTOM = "fade-bottom",
  FADE_SCALE = "fade-scale",
}

export enum ContentEnum {
  // auto width
  FULL = "full",
  // fixed width
  FIXED = "fixed",
}

export enum SettingButtonPositionEnum {
  AUTO = "auto",
  HEADER = "header",
  FIXED = "fixed",
}

// Session超时处理
export enum SessionTimeoutProcessingEnum {
  // 路由跳转
  ROUTE_JUMP,
  // 页面覆盖
  PAGE_COVERAGE,
}
