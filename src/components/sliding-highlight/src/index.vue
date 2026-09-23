<template>
  <component
    :is="as"
    ref="rootRef"
    class="w-sliding-highlight"
    @pointerover="onPointerover"
    @pointerleave="onPointerleave"
  >
    <slot />
    <AnimatePresence>
      <Motion
        v-if="visible"
        :as="pillTag"
        key="sliding-highlight-pill"
        class="w-sliding-highlight__container"
        :class="pillContainerClassName"
        data-sliding-highlight-pill
        :initial="pillInitial"
        :animate="pillAnimate"
        :exit="pillExit"
        :transition="pillTransition"
        aria-hidden="true"
      >
        <span class="w-sliding-highlight__pill" :class="pillClassName" />
      </Motion>
    </AnimatePresence>
  </component>
</template>

<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from 'motion-v'
import type {
  SlidingHighlightInstance,
  SlidingHighlightProps,
  SlidingHighlightRect,
  SlidingHighlightSlots,
} from './types'

defineOptions({ name: 'SlidingHighlight' })

const props = withDefaults(defineProps<SlidingHighlightProps>(), {
  as: 'div',
  inset: 20,
})

defineSlots<SlidingHighlightSlots>()

const PILL_SELECTOR =
  '[data-sliding-highlight-pill], .w-sliding-highlight__pill'
const SPRING = {
  type: 'spring',
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
const EASE_EXIT: [number, number, number, number] = [0.4, 0, 1, 1]

const rootRef = shallowRef<HTMLElement | null>(null)
const hoveredElement = shallowRef<HTMLElement | null>(null)
const rect = shallowRef<SlidingHighlightRect>({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
})
const reducedMotion = useReducedMotion()

let resizeObserver: ResizeObserver | undefined
let frameId: number | undefined

/**
 * ul 容器内的高亮块必须渲染为 li，避免产生非法子元素
 */
const pillTag = computed(() => (props.as === 'ul' ? 'li' : 'div'))

const visible = computed(() => !!hoveredElement.value)

/**
 * 进入时目标几何已经测量完成，
 * 因此初始值直接使用 rect，只做透明度与模糊的变化。
 */
const pillInitial = computed(() => ({
  ...rect.value,
  opacity: 0,
  ...(reducedMotion.value ? {} : { filter: 'blur(6px)' }),
}))

const pillAnimate = computed(() => ({
  ...rect.value,
  opacity: 1,
  ...(reducedMotion.value ? {} : { filter: 'blur(0px)' }),
}))

/**
 * 离开时只做透明度（配合轻微模糊）溶解，不做缩放
 */
const pillExit = computed(() => {
  if (reducedMotion.value) {
    return { opacity: 0, transition: { duration: 0 } }
  }

  return {
    opacity: 0,
    filter: 'blur(8px)',
    transition: { duration: 0.32, ease: EASE_EXIT },
  }
})

const pillTransition = computed(() => {
  if (reducedMotion.value) {
    return { duration: 0 }
  }

  const fade = { duration: 0.2, ease: EASE_OUT }

  return {
    opacity: fade,
    filter: fade,
    x: SPRING,
    y: SPRING,
    width: SPRING,
    height: SPRING,
  }
})

/**
 * 从事件目标向上查找根元素的直接子项，避免遍历整个列表
 */
const findItem = (target: EventTarget | null) => {
  const root = rootRef.value
  if (!root || !(target instanceof Element) || !root.contains(target)) {
    return null
  }

  let element: Element | null = target
  while (element && element !== root && element.parentElement !== root) {
    element = element.parentElement
  }

  if (!element || element === root) return null

  return element instanceof HTMLElement && !element.matches(PILL_SELECTOR)
    ? element
    : null
}

/**
 * 同步测量，保证高亮块首次渲染时就位于目标位置
 */
const measure = () => {
  const element = hoveredElement.value
  const root = rootRef.value
  if (!element || !root) return

  const inset = props.inset
  const itemRect = element.getBoundingClientRect()
  const rootRect = root.getBoundingClientRect()

  rect.value = {
    x: itemRect.left - rootRect.left - inset,
    y: itemRect.top - rootRect.top,
    width: itemRect.width + inset * 2,
    height: itemRect.height,
  }
}

/**
 * 将测量合并到下一帧，避免 resize / scroll 重复布局计算
 */
const scheduleMeasure = () => {
  if (frameId != null) return

  frameId = requestAnimationFrame(() => {
    frameId = undefined

    measure()
  })
}

const observe = (element: HTMLElement | null) => {
  if (!resizeObserver) return
  resizeObserver.disconnect()

  if (rootRef.value) {
    resizeObserver.observe(rootRef.value)
  }

  if (element) {
    resizeObserver.observe(element)
  }
}

const highlight = (element: HTMLElement) => {
  const root = rootRef.value
  if (!root || !root.contains(element)) return

  if (element !== hoveredElement.value) {
    hoveredElement.value = element
    observe(element)
  }

  measure()
}

const clear = () => {
  if (hoveredElement.value === null) return

  hoveredElement.value = null
  observe(null)
}

const onPointerover = (event: PointerEvent) => {
  /**
   * 指针落在子项之间的空隙时保持当前高亮，
   * 避免跨越间隙时闪动。
   */
  const item = findItem(event.target)
  if (!item || item === hoveredElement.value) return

  highlight(item)
}

const onPointerleave = clear

defineExpose<SlidingHighlightInstance>({ highlight, clear })

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(scheduleMeasure)
    if (rootRef.value) {
      resizeObserver.observe(rootRef.value)
    }
  }

  window.addEventListener('resize', scheduleMeasure, { passive: true })
  window.addEventListener('scroll', scheduleMeasure, {
    passive: true,
    capture: true,
  })
})

watch(
  () => props.inset,
  () => {
    if (hoveredElement.value) {
      measure()
    }
  }
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', scheduleMeasure)
  window.removeEventListener('scroll', scheduleMeasure, true)
  if (frameId != null) {
    cancelAnimationFrame(frameId)
    frameId = undefined
  }
})
</script>

<style scoped lang="less">
.w-sliding-highlight {
  position: relative;
  isolation: isolate;
}

/**
 * 使用 :where() 保持零权重，方便通过 pillClassName 覆盖默认视觉样式。
 */
:global(:where(.w-sliding-highlight__container)) {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  margin: 0;
  pointer-events: none;
  list-style: none;
}

:global(:where(.w-sliding-highlight__pill)) {
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--w-sliding-highlight-bg, rgb(var(--w-bg-fill-4)));
  border-radius: var(--w-sliding-highlight-radius, 8px);
}
</style>
