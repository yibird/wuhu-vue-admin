import { waitForAnimations } from '@/utils'

import type { Ref } from 'vue'

const RollType = {
  LEFT: 'left',
  RIGHT: 'right',
  AUTO: 'auto',
} as const

const WRAPPER_CLASS_NAME = '.layout-tabs-list__wrapper'
const ITEM_CLASS = 'layout-tab-item'

type Target = HTMLElement | Ref<HTMLElement | undefined>
type RollType = (typeof RollType)[keyof typeof RollType]

/**
 * 滚动到指定索引
 * @param target 滚动目标元素
 * @param current 当前索引
 * @returns 滚动到指定索引的方法
 */
export function useRoll(target: Target, current?: number | Ref<number>) {
  const offset = ref(0)

  /**
   * 滚动到指定索引
   * @param target 滚动目标元素
   * @param type 滚动类型
   * @param index 目标索引
   * @returns 滚动到指定索引的方法
   */
  function rollPage(target: Target, type: RollType, index?: number) {
    const targetEl = isRef(target) ? target.value : target
    if (!targetEl) return
    const wrapperEl = targetEl.querySelector(WRAPPER_CLASS_NAME) as HTMLElement
    if (!wrapperEl) return

    const outerWidth = targetEl.offsetWidth
    const liItems = targetEl.getElementsByClassName(
      ITEM_CLASS
    ) as HTMLCollectionOf<HTMLElement>

    switch (type) {
      case RollType.LEFT:
        if (Math.abs(offset.value) <= 0) return
        const prefLeft = -offset.value - outerWidth
        for (let i = 0, len = liItems.length; i < len; i++) {
          const li = liItems[i]
          if (!li) return
          const left = li.offsetLeft
          if (left >= prefLeft) {
            wrapperEl.style.transform = `translateX(${-left}px)`
            offset.value = -left
            return
          }
        }
        break
      case RollType.RIGHT:
        for (let i = 0, len = liItems.length; i < len; i++) {
          const li = liItems[i]
          if (!li) return
          const left = li.offsetLeft
          const liOuterWidth = li.offsetWidth
          if (left + liOuterWidth > outerWidth - offset.value) {
            wrapperEl.style.transform = `translateX(${-left}px)`
            offset.value = -left
            return
          }
        }
        break
      case RollType.AUTO:
        if (typeof index !== 'number' || index < 0 || index >= liItems.length) {
          return
        }
        const thisLi = liItems[index]
        if (!thisLi) return
        const thisLiLeft = thisLi.offsetLeft
        const thisLiOuterWidth = thisLi.offsetWidth
        if (thisLiLeft < -offset.value) {
          wrapperEl.style.transform = `translateX(${-thisLiLeft}px)`
          offset.value = -thisLiLeft
        } else if (thisLiLeft + thisLiOuterWidth > outerWidth - offset.value) {
          const newOffset = -(thisLiLeft + thisLiOuterWidth - outerWidth)
          wrapperEl.style.transform = `translateX(${newOffset}px)`
          offset.value = newOffset
        }
        break
    }
  }

  watch(
    () => unref(current),
    async (newCurrent) => {
      const targetEl = isRef(target) ? target.value : target
      if (!targetEl) return
      if (typeof newCurrent === 'number') {
        await waitForAnimations(targetEl)
        rollPage(target, RollType.AUTO, newCurrent)
      }
    },
    { immediate: true }
  )

  return {
    rollAuto: (index: number) => rollPage(target, RollType.AUTO, index),
    rollLeft: () => rollPage(target, RollType.LEFT),
    rollRight: () => rollPage(target, RollType.RIGHT),
  }
}
