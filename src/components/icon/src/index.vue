<script lang="ts" setup>
import { computed } from 'vue'
import type { IconProps } from './types'

const props = withDefaults(defineProps<IconProps>(), {
  decorative: true,
  size: 14,
  tag: 'i',
})

defineOptions({
  name: 'Icon',
})

const iconStyle = computed(() => {
  return {
    fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
    color: props.color,
  }
})

const iconName = computed(() =>
  props.prefix ? `${props.prefix}${props.name}` : props.name
)

const isDecorative = computed(() => props.decorative || !props.label)
</script>

<template>
  <component
    :is="props.tag"
    class="w-icon align-[-0.125em]"
    :class="iconName"
    :style="iconStyle"
    :aria-hidden="isDecorative ? 'true' : undefined"
    :aria-label="isDecorative ? undefined : props.label"
    :role="isDecorative ? undefined : 'img'"
  />
</template>
