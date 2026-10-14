<template>
  <button class="tab-control tab-control-refresh" @click="emits('click')">
    <Icon name="i-lucide:rotate-ccw" :size="18" />
  </button>
</template>
<script lang="ts" setup>
defineOptions({ name: 'TabRefresh' })
const emits = defineEmits(['click'])
</script>
