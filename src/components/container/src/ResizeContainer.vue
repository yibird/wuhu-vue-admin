<script setup lang="ts">
import { useElementSize } from '@vueuse/core'

import type {
  ResizeContainerEmits,
  ResizeContainerProps,
  ResizeContainerSlots,
} from './types.ts'

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
  {
    box: props.box,
  }
)

watch(
  [width, height],
  ([nextWidth, nextHeight]) => {
    emit('resize', {
      width: nextWidth,
      height: nextHeight,
    })
  },
  {
    flush: 'post',
  }
)
</script>

<template>
  <component :is="props.tag" ref="containerRef" class="w-resize-container">
    <slot :width="width" :height="height" />
  </component>
</template>
