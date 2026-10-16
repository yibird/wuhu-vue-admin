const sizes = {
  full: 'w-full h-full',
  'min-full': 'min-w-full min-h-full',
  'max-full': 'max-w-full max-h-full',
  'full-flex': 'w-full min-h-0 flex-1',
}
const flexLayouts = {
  'flex-center': 'flex justify-center items-center',
  'flex-x-center': 'flex justify-center',
  'flex-y-center': 'flex items-center',
  'flex-between': 'flex justify-between',
  'flex-between-center': 'flex justify-between items-center',
  'flex-center-between': 'flex justify-center items-stretch',
}

const gridLayouts = {
  'grid-center': 'grid place-content-center',
  'grid-x-center': 'grid justify-center',
  'grid-y-center': 'grid items-center',
  'grid-stretch': 'grid items-stretch',
  'grid-between': 'grid justify-between',
  'grid-between-center': 'grid justify-between items-center',
  'grid-center-between': 'grid place-content-between',
  'grid-equal-cols': 'grid grid-cols-[repeat(auto-fit,minmax(0,1fr))]',
}

const positionLayouts = {
  'absolute-center':
    'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  'absolute-x-center': 'absolute left-1/2 transform -translate-x-1/2',
  'absolute-y-center': 'absolute top-1/2 transform -translate-y-1/2',
  'fixed-center':
    'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  'fixed-x-center': 'fixed left-1/2 transform -translate-x-1/2',
  'fixed-y-center': 'fixed top-1/2 transform -translate-y-1/2',
}

const styles = {
  'primary-tinted':
    'bg-primary/8 text-primary border-1 border-primary/15 border-solid',
}

const elements = {
  // element
  button:
    'flex items-center justify-center grow-0 shrink-0 bg-transparent border-none outline-none appearance-none touch-none cursor-pointer select-none focus-visible:outline-none',

  // 重置按钮
  'reset-button':
    'p-0 m-0 bg-transparent border-none outline-none appearance-none touch-none cursor-pointer select-none focus-visible:outline-none',
}

const motions = {
  'motion-interactive':
    'transition-[background-color,border-color,box-shadow,color,transform,translate,scale,rotate] duration-motion-base ease-motion-standard motion-reduce:transition-none',
  'motion-press': 'active:scale-motion-pressed motion-reduce:active:scale-100',
}

const effects = {
  // 按压弹簧效果
  'press-spring':
    'transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95',
  // 悬浮浮起
  'float-up': 'transition-transform duration-200 ease-out hover:-translate-y-1',
  // 悬浮放大
  'scale-up': 'transition-transform duration-200 ease-out hover:scale-[1.02]',
  // 悬浮阴影
  'shadow-up': 'transition-shadow duration-200 hover:shadow-md',
  // 悬浮边框高亮
  'border-highlight': 'transition-colors duration-200 hover:border-primary',
  // 颜色过渡
  'transition-colors': 'transition-colors duration-200 ease-out',
  // 透明度过渡
  'transition-opacity': 'transition-opacity duration-200 ease-out',
  // 聚焦轮廓
  'outline-ring':
    'outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  // 禁用状态
  'disabled-effect': 'disabled:cursor-not-allowed disabled:opacity-50',
}

export const shortcuts = {
  ...sizes,
  ...flexLayouts,
  ...gridLayouts,
  ...positionLayouts,
  ...styles,
  ...elements,
  ...motions,
  ...effects,
}
