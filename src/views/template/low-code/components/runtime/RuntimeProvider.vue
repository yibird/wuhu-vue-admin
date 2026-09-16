<template>
  <slot />
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { RUNTIME_KEY } from '../../core/runtime/keys'
import type { RuntimeApi } from '../../core/runtime'

const props = defineProps<{
  runtime: RuntimeApi
}>()

provide(RUNTIME_KEY, props.runtime)
</script>
