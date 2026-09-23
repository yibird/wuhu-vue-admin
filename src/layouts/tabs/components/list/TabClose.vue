<template>
  <button
    v-if="!props.pin"
    class="tab-item__close"
    type="button"
    @click.stop.prevent="onClose"
  >
    <Icon name="i-lucide:x" />
  </button>
</template>
<script setup lang="ts">
const props = defineProps<{ pin?: boolean }>()
const emits = defineEmits(['close'])

const onClose = () => {
  emits('close')
}
</script>
