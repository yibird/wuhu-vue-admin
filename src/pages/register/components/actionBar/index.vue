<template>
  <div
    class="page-enter page-enter--2 absolute right-16 top-16 z-10 flex items-center gap-2 rounded-8 border-1 border-color-2 border-solid bg-container px-6 py-4 shadow-all-sm sm:right-20 sm:top-20"
  >
    <Layout class="max-xl:hidden" @change="changePlacement" />
    <Theme />
    <Translate />
  </div>
</template>

<script setup lang="ts">
import Layout from './Layout.vue'
import Theme from './Theme.vue'
import Translate from './Translate.vue'
import type { Placement } from '../types'

const emit = defineEmits<{
  change: [value: Placement]
}>()

const changePlacement = (value: Placement) => {
  emit('change', value)
}
</script>
