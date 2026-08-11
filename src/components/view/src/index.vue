<script lang="ts" setup>
import { computed, provide } from 'vue'
import { toPx } from '@/utils'
import { viewContextKey } from './context'
import type { CSSProperties } from 'vue'
import type { ViewProps } from './types'

defineOptions({
  name: 'WView',
})
const props = withDefaults(defineProps<ViewProps>(), {
  padding: true,
  full: true,
  direction: 'vertical',
})

const gap = computed(() => (props.gap === undefined ? '0px' : toPx(props.gap)))
const direction = computed(() => props.direction)

provide(viewContextKey, { direction, gap })

const style = computed(() => {
  const viewStyle: CSSProperties = {}
  if (typeof props.padding === 'boolean' && props.padding) {
    viewStyle.padding = '10px'
  } else if (typeof props.padding === 'number') {
    viewStyle.padding = `${props.padding}px`
  } else if (typeof props.padding === 'string') {
    viewStyle.padding = props.padding
  }
  if (props.gap !== undefined) {
    viewStyle.display = 'flex'
    viewStyle.flexDirection =
      props.direction === 'horizontal' ? 'row' : 'column'
    viewStyle.gap = gap.value
  }
  return viewStyle
})
</script>

<template>
  <div class="w-view" :class="{ 'w-view-full': props.full }" :style="style">
    <slot />
  </div>
</template>

<style lang="less" scoped>
.w-view {
  box-sizing: border-box;
  width: 100%;
  background-color: rgb(var(--w-bg-page));

  &-full {
    position: absolute;
    inset: 0;
    height: 100%;
    min-height: 100%;
    overflow: hidden;
  }
}
</style>
