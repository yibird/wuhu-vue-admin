<script lang="ts" setup>
import { loadLucideIcon } from './lucide'
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

type InlineIcon = Awaited<ReturnType<typeof loadLucideIcon>>
const inlineIcon = shallowRef<InlineIcon>()
let requestId = 0

watch(
  () => iconName.value,
  async (name) => {
    const currentRequestId = ++requestId
    inlineIcon.value = undefined
    const icon = await loadLucideIcon(name)
    if (currentRequestId === requestId) {
      inlineIcon.value = icon
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <component
    :is="props.tag"
    class="w-icon"
    :class="iconName"
    :style="iconStyle"
  />
</template>

<style scoped>
.w-icon {
  display: inline-block;
  overflow: visible;
  vertical-align: middle;
}
</style>
