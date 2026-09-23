<script lang="ts" setup>
import type { IconProps } from './types'

defineOptions({
  name: 'Icon',
})

const props = withDefaults(defineProps<IconProps>(), {
  size: 14,
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

<style scoped>
.w-icon {
  display: inline-block;
  overflow: visible;
  vertical-align: middle;
}
</style>
