<template>
  <svg
    v-if="symbolId"
    class="inline-block shrink-0 overflow-visible align-[-0.125em]"
    :style="iconStyle"
    aria-hidden="true"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <use :href="`#${symbolId}`" />
  </svg>
  <Icon v-else :name="name" :size="size" />
</template>

<script setup lang="ts">
import { ensureSymbol } from '../sprite'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
  }>(),
  {
    size: 18,
  }
)

const iconName = computed(() => props.name.replace(/^i-lucide:/, ''))
const symbolId = shallowRef<string>()
const iconStyle = computed(() => ({
  height: `${props.size}px`,
  width: `${props.size}px`,
}))

watch(
  iconName,
  (name) => {
    symbolId.value = ensureSymbol(name)
  },
  { immediate: true }
)
</script>
