<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import type {
  ContainerSize,
  ResizeContainerEmits,
  ResizeContainerProps,
  ResizeContainerSlots,
} from './types'

defineOptions({ name: 'ResizeContainer' })

const props = withDefaults(defineProps<ResizeContainerProps>(), {
  box: 'content-box',
  initialHeight: 0,
  initialWidth: 0,
  tag: 'div',
})

const emit = defineEmits<ResizeContainerEmits>()
defineSlots<ResizeContainerSlots>()

const containerRef = useTemplateRef<HTMLElement>('containerRef')
const { width, height } = useElementSize(
  containerRef,
  {
    width: props.initialWidth,
    height: props.initialHeight,
  },
  { box: props.box }
)

const size = computed<ContainerSize>(() => ({
  width: width.value,
  height: height.value,
}))

watch(
  [width, height],
  ([nextWidth, nextHeight], [previousWidth, previousHeight]) => {
    if (nextWidth === previousWidth && nextHeight === previousHeight) return
    emit('resize', { width: nextWidth, height: nextHeight })
  },
  { flush: 'post' }
)
</script>

<template>
  <component :is="props.tag" ref="containerRef" class="w-resize-container">
    <slot :width="size.width" :height="size.height" />
  </component>
</template>
