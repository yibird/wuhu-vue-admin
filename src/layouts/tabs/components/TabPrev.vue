<template>
  <button class="tab-control tab-control-prev" @click="emits('click')">
    <Icon name="i-lucide:chevrons-left" :size="20" />
  </button>
</template>
<script lang="ts" setup>
const emits = defineEmits(['click'])
</script>
