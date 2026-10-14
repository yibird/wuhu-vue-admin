<template>
  <button class="tab-control tab-control-prev" @click="emits('click')">
    <Icon name="i-lucide:chevrons-left" :size="20" />
  </button>
</template>
<script lang="ts" setup>
import type { TabControlEmits } from './types'

defineOptions({ name: 'TabPrev' })

const emits = defineEmits<TabControlEmits>()
</script>
