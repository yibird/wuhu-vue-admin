<template>
  <button
    :class="['tab-control tab-control-home', { 'tab-item-active': active }]"
    @click="onClick"
  >
    <Icon name="i-lucide:house" :size="18" />
  </button>
</template>
<script lang="ts" setup>
import type { TabHomeProps, TabControlEmit } from './types'

const { active = false } = defineProps<TabHomeProps>()
const emits = defineEmits<TabControlEmit>()
const onClick = () => {
  emits('click')
}
</script>
