// 菜单模式
export enum MenuModeEnum {
  // 垂直模式
  VERTICAL = "vertical",
  // 水平模式
  HORIZONTAL = "horizontal",
  // 内嵌(行内)模式
  INLINE = "inline",
}

// 菜单类型
export enum MenuTypeEnum {
  // 侧边栏菜单
  SIDEBAR = "sidebar",
  // 小型菜单(收缩型菜单)
  MIX = "mix",
  // 顶部菜单
  TOP_MENU = "top-menu",
}

// 折叠触发器位置
export enum TriggerEnum {
  // 不显示
  NONE = "NONE",
  // 菜单底部
  FOOTER = "FOOTER",
  // 头部
  HEADER = "HEADER",
}

// 顶部菜单排列方向
export enum TopMenuAlignEnum {
  CENTER = "center",
  START = "start",
  END = "end",
}

// 修改 Menu 子菜单的触发方式
export enum MixSidebarTriggerEnum {
  CLICK = "click",
  HOVER = "hover",
}
