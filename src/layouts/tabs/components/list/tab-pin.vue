<template>
  <button class="tab-item__pin" type="button">
    <Icon
      v-if="props.pin"
      name="i-lucide:pin"
      :size="16"
      @click.stop.prevent="onTogglePin"
    />
  </button>
</template>
<script setup lang="ts">
const props = defineProps<{ pin?: boolean }>()
const emits = defineEmits(['toggle'])
const onTogglePin = () => {
  emits('toggle')
}
</script>
