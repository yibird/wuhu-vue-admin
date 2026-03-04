<template>
  <aside
    :class="[
      'w-300 min-w-300 flex flex-col border-border/50 h-full border-r-1 border-solid border-[#E8E8E8] transition-all',
      { 'w-60 min-w-60': collapsed },
    ]"
  >
    <Header v-model:collapsed="collapsed" />
    <List :items="items" />
  </aside>
</template>
<script setup lang="ts">
import type { SiderProps } from '../types'
import Header from './header.vue'
import List from './list.vue'

const { items = [] } = defineProps<SiderProps>()
const collapsed = ref(false)
</script>
