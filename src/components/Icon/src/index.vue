<template>
  <i v-bind="restProps" :style="getStyle" :class="iconName"></i>
</template>
<script lang="ts" setup>
  import type { IconProps } from './types'

  const { prefix, name, size = 14, color, ...restProps } = defineProps<IconProps>()

  const getStyle = computed(() => {
    return {
      fontSize: typeof size === 'number' ? `${size}px` : size,
      cursor: 'pointer',
      color
    }
  })
  const iconName = computed(() => (prefix ? `${prefix}${name}` : name))
</script>
