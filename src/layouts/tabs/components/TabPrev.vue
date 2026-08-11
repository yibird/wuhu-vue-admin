<template>
  <button class="tab-control tab-control-prev" @click="onClick">
    <Icon name="i-lucide:chevrons-left" :size="20" />
  </button>
</template>
<script lang="ts" setup>
import type { TabControlEmit } from './types'

const emits = defineEmits<TabControlEmit>()
const onClick = () => {
  emits('click')
}
</script>
