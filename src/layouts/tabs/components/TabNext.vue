<template>
  <button class="tab-control tab-control-next" @click="emits('click')">
    <Icon name="i-lucide:chevrons-right" :size="20" />
  </button>
</template>
<script lang="ts" setup>
const emits = defineEmits(['click'])
</script>
