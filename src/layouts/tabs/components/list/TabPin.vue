<template>
  <button class="tab-item__pin" type="button">
    <Icon
      v-if="props.fixed"
      name="i-lucide:pin"
      :size="16"
      @click.stop.prevent="onTogglePin"
    />
  </button>
</template>
<script setup lang="ts">
const props = defineProps<{ fixed?: boolean }>()
const emits = defineEmits(['toggle'])
const onTogglePin = () => {
  emits('toggle')
}
</script>
