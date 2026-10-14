<template>
  <button class="tab-control tab-control-next" @click="emits('click')">
    <Icon name="i-lucide:chevrons-right" :size="20" />
  </button>
</template>
<script lang="ts" setup>
import type { TabControlEmits } from './types'

defineOptions({ name: 'TabNext' })

const emits = defineEmits<TabControlEmits>()
</script>
