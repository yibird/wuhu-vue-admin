<template>
  <div class="flex gap-10">
    <n-button v-if="showSearch" type="primary" @click="onSearch">{{
      searchText
    }}</n-button>
    <n-button v-if="showReset" @click="onReset">{{ resetText }}</n-button>
  </div>
</template>
<script setup lang="ts">
import type { QueryButtonProps } from './types'

const {
  showSearch = true,
  showReset = true,
  searchText = '搜索',
  resetText = '重置',
  onSearch,
  onReset,
} = defineProps<QueryButtonProps>()
</script>
