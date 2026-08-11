<template>
  <button class="tab-control tab-control-next" @click="onClick">
    <Icon name="i-lucide:chevrons-right" :size="20" />
  </button>
</template>
<script lang="ts" setup>
import type { TabControlEmit } from './types'

const emits = defineEmits<TabControlEmit>()
const onClick = () => {
  emits('click')
}
</script>
