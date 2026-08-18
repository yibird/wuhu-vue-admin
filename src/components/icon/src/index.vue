<script lang="ts" setup>
import { computed, shallowRef, watch } from 'vue'
import { loadLucideIcon } from './lucide'
import type { IconProps } from './types'

const props = withDefaults(defineProps<IconProps>(), {
  decorative: true,
  mode: 'mask',
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
const inlineIcon = shallowRef<Awaited<ReturnType<typeof loadLucideIcon>>>()
let inlineIconRequest = 0

watch(
  [() => props.mode, iconName],
  async ([mode, name]) => {
    const request = ++inlineIconRequest
    inlineIcon.value = undefined

    if (mode !== 'svg') return

    const icon = await loadLucideIcon(name)
    if (request === inlineIconRequest) inlineIcon.value = icon
  },
  { immediate: true }
)

const isInlineSvg = computed(() => props.mode === 'svg')

const svgStyle = computed(() => ({
  ...iconStyle.value,
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
}))
</script>

<template>
  <svg
    v-if="isInlineSvg"
    class="w-icon w-icon--svg"
    :style="svgStyle"
    :viewBox="inlineIcon?.viewBox ?? '0 0 24 24'"
    fill="none"
    focusable="false"
    :aria-hidden="isDecorative ? 'true' : undefined"
    :aria-label="isDecorative ? undefined : props.label"
    :role="isDecorative ? undefined : 'img'"
  >
    <!-- Iconify's bundled Lucide bodies are trusted static assets. -->
    <g v-html="inlineIcon?.body" />
  </svg>
  <component
    v-else
    :is="props.tag"
    class="w-icon align-[-0.125em]"
    :class="iconName"
    :style="iconStyle"
    :aria-hidden="isDecorative ? 'true' : undefined"
    :aria-label="isDecorative ? undefined : props.label"
    :role="isDecorative ? undefined : 'img'"
  />
</template>

<style scoped>
.w-icon--svg {
  display: inline-block;
  flex: none;
  overflow: visible;
  vertical-align: middle;
}
</style>
