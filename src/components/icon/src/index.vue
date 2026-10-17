<template>
  <component
    :is="props.tag"
    class="w-icon"
    :class="iconName"
    :style="iconStyle"
    :role="props.label ? 'img' : undefined"
    :aria-label="props.label"
    :aria-hidden="props.label ? undefined : 'true'"
  />
</template>

<script lang="ts" setup>
import type { IconProps } from './types'

defineOptions({
  name: 'Icon',
})

const props = withDefaults(defineProps<IconProps>(), {
  // 与 presetIcons 生成的 width/height:1em 一致:未显式传 size 时跟随所在文字大小
  size: '1em',
  tag: 'i',
})

const iconName = computed(() =>
  props.prefix ? `${props.prefix}${props.name}` : props.name
)
const iconSize = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size
)
const iconStyle = computed(() => {
  const size = iconSize.value
  return {
    width: size,
    height: size,
    fontSize: size,
    color: props.color,
  }
})
</script>

<style scoped>
.w-icon {
  display: inline-block;
  overflow: visible;
  vertical-align: middle;
}
</style>
