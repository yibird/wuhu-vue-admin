// 等待元素及其子元素的所有动画完成
export function waitForAnimations(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const animations = element.getAnimations({ subtree: true })
    if (animations.length === 0) {
      resolve()
      return
    }
    Promise.allSettled(animations.map((anim) => anim.finished)).then(() =>
      resolve()
    )
  })
}
