import { onActivated } from 'vue'
import type { Ref } from 'vue'

/**
 * 重放 .page-enter 元素的入场动画
 *
 * 用于 KeepAlive 页面重新激活、应用加载结束等场景重新触发入场动画。
 */
export function replayPageEnterAnimations(root: ParentNode = document) {
  for (const element of root.querySelectorAll<HTMLElement>('.page-enter')) {
    for (const animation of element.getAnimations()) {
      if (!(animation instanceof CSSAnimation)) continue
      if (animation.animationName !== 'w-page-enter') continue
      animation.currentTime = 0
      animation.play()
    }
  }
}

/**
 * 重放页面入场动画。
 *
 * KeepAlive 缓存的页面重新激活时不会重新挂载，CSS 入场动画不会再次播放，
 * 在页面激活时重置内部 .page-enter 元素的 w-page-enter 动画。
 *
 * @param rootRef 页面根元素引用
 */
export function usePageEnter(rootRef: Ref<HTMLElement | null | undefined>) {
  onActivated(() => {
    const root = rootRef.value
    if (!root) return

    replayPageEnterAnimations(root)
  })
}
