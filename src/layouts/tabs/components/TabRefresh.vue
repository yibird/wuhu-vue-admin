<template>
  <button class="tab-control tab-control-refresh" @click="onClick">
    <Icon name="i-lucide:rotate-ccw" :size="18" />
  </button>
</template>
<script lang="ts" setup>
const emits = defineEmits(['click'])

const onClick = () => {
  emits('click')
}
</script>
