<script setup lang="ts">
import lucideIconSet from '@iconify-json/lucide/icons.json'

interface IconifyIconData {
  body: string
}

interface IconifyAliasData {
  parent: string
}

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
  }>(),
  {
    size: 18,
  }
)

const icons = lucideIconSet.icons as Record<string, IconifyIconData>
const aliases = (lucideIconSet.aliases ?? {}) as Record<
  string,
  IconifyAliasData
>
const iconName = computed(() => props.name.replace(/^i-lucide:/, ''))
const iconData = computed(() => {
  const name = iconName.value
  return icons[name] ?? icons[aliases[name]?.parent]
})
const iconStyle = computed(() => ({
  height: `${props.size}px`,
  width: `${props.size}px`,
}))
</script>

<template>
  <svg
    v-if="iconData"
    class="inline-block shrink-0 overflow-visible align-[-0.125em]"
    :style="iconStyle"
    aria-hidden="true"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g v-html="iconData.body" />
  </svg>
  <Icon v-else :name="name" :size="size" />
</template>
