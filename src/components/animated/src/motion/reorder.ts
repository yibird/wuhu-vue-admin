/**
 * 排序/重排动画
 *
 * 元素位置变化时按弹簧归位,入场做轻微上移淡入,用于切换排序方式后的网格/列表位移。
 * 需要配合 Motion 的 layout="position" 使用,否则只有入场动画,看不到重排过程。
 *
 * 与 smooth 的区别:弹簧更紧(430 / 32 / 0.65),位移幅度更小;
 * exit 只在 AnimatePresence 内生效,不在其中的调用方(如文件管理网格)不受影响。
 */
export const reorderMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -2 },
  transition: {
    type: 'spring',
    stiffness: 430,
    damping: 32,
    mass: 0.65,
  },
}
