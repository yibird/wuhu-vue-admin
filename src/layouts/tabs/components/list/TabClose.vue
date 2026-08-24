<template>
  <button
    v-if="!props.fixed"
    class="tab-item__close"
    type="button"
    @click.stop.prevent="onClose"
  >
    <Icon name="i-lucide:x" />
  </button>
</template>
<script setup lang="ts">
const props = defineProps<{ fixed?: boolean }>()
const emits = defineEmits(['close'])

const onClose = () => {
  emits('close')
}
</script>
