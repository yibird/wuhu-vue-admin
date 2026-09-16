<template>
  <slot v-if="canRender" />
</template>

<script setup lang="ts">
import { NetworkDisconnectedError } from './NetworkDisconnectedError'

const props = defineProps<{
  online: boolean
}>()

const canRender = computed(() => {
  if (!props.online) {
    throw new NetworkDisconnectedError()
  }
  return true
})
</script>
