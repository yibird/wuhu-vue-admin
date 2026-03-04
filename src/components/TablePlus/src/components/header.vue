<template>
  <div class="table-plus-header flex flex-wrap justify-between gap-10 p-10">
    <div v-if="slots.headerLeft" class="flex-1">
      <slot name="headerLeft" />
    </div>
    <div class="ml-auto flex flex-wrap gap-10">
      <slot v-if="slots.headerRight" name="headerRight" />
      <Toolbar />
    </div>
  </div>
</template>
<script lang="ts" setup>
import Toolbar from './toolbar/index.vue'
import type { TablePlusSlots } from '../types'
const slots = defineSlots<TablePlusSlots>()
</script>
