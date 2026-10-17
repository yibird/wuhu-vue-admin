<template>
  <component
    :is="as"
    ref="rootRef"
    class="w-sliding-highlight"
    @pointerover="onPointerover"
    @pointerleave="onPointerleave"
  >
    <slot />
    <Transition name="w-sliding-highlight">
      <component
        :is="pillTag"
        v-if="hoveredElement"
        class="w-sliding-highlight__container"
        :class="pillContainerClassName"
        :style="pillStyle"
        data-sliding-highlight-pill
        aria-hidden="true"
      >
        <span class="w-sliding-highlight__pill" :class="pillClassName" />
      </component>
    </Transition>
  </component>
</template>

<script setup lang="ts">
import type {
  SlidingHighlightInstance,
  SlidingHighlightProps,
  SlidingHighlightRect,
  SlidingHighlightSlots,
} from './types'

const props = withDefaults(defineProps<SlidingHighlightProps>(), {
  as: 'div',
  inset: 20,
})

defineSlots<SlidingHighlightSlots>()

const PILL_SELECTOR = '[data-sliding-highlight-pill]'

const rootRef = shallowRef<HTMLElement | null>(null)
const hoveredElement = shallowRef<HTMLElement | null>(null)
const rect = shallowRef<SlidingHighlightRect>({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
})

let resizeObserver: ResizeObserver | undefined
let frameId: number | undefined

/**
 * ul 容器内的高亮块必须渲染为 li，避免产生非法子元素
 */
const pillTag = computed(() => (props.as === 'ul' ? 'li' : 'div'))

/**
 * 高亮块几何直接写入内联样式,由 CSS transition 负责过渡
 */
const pillStyle = computed(() => ({
  transform: `translate3d(${rect.value.x}px, ${rect.value.y}px, 0)`,
  width: `${rect.value.width}px`,
  height: `${rect.value.height}px`,
}))

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
 *
 * 高亮块绝对定位在根元素内并随内容一起滚动，
 * 因此需要把根元素自身的滚动偏移加回内容坐标。
 */
const measure = () => {
  const element = hoveredElement.value
  const root = rootRef.value
  if (!element || !root) return

  const inset = props.inset
  const itemRect = element.getBoundingClientRect()
  const rootRect = root.getBoundingClientRect()
  // 绝对定位包含块是 padding box,clientLeft/clientTop 即根元素边框宽度,需从 border box 原点修正
  const offsetX = itemRect.left - (rootRect.left + root.clientLeft)
  const offsetY = itemRect.top - (rootRect.top + root.clientTop)

  rect.value = {
    x: offsetX - inset + root.scrollLeft,
    y: offsetY + root.scrollTop,
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
  padding: 0;
  margin: 0;
  pointer-events: none;
  list-style: none;
  transition:
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, width, height;
}

:global(.w-sliding-highlight-enter-from),
:global(.w-sliding-highlight-leave-to) {
  opacity: 0;
  filter: blur(8px);
}

/**
 * 进入时只做淡入与模糊收敛,
 * 避免高亮块从 (0, 0) 移动到目标位置。
 */
:global(.w-sliding-highlight-enter-active) {
  transition:
    opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

:global(.w-sliding-highlight-leave-active) {
  transition:
    opacity 0.32s cubic-bezier(0.4, 0, 1, 1),
    filter 0.32s cubic-bezier(0.4, 0, 1, 1);
}

:global(:where(.w-sliding-highlight__pill)) {
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--w-sliding-highlight-bg, rgb(var(--w-bg-fill-4)));
  border-radius: var(--w-sliding-highlight-radius, 8px);
}

@media (prefers-reduced-motion: reduce) {
  :global(:where(.w-sliding-highlight__container)),
  :global(.w-sliding-highlight-enter-active),
  :global(.w-sliding-highlight-leave-active) {
    transition: none;
  }
}
</style>
