/**
 * 项目特有快捷方式
 *
 * 尺寸、布局、按钮、动效与交互反馈等通用快捷方式由
 * `@starweave-lab/unocss-preset` 提供,避免重复维护。
 */
export const shortcuts = {
  // Antdv 的 avatar 属性会被扫描成同名类,使用项目 token 覆盖预设实现
  avatar: 'inline-block rounded-full object-cover shrink-0 bg-muted',

  // 主题色浅底容器
  'primary-tinted':
    'bg-primary/8 text-primary border-1 border-primary/15 border-solid',

  // 交互过渡
  'motion-interactive': 'transition-all duration-200 ease-out',
  'transition-colors': 'transition-colors duration-200 ease-out',
  'transition-opacity': 'transition-opacity duration-200 ease-out',
}
