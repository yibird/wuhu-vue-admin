<script lang="ts" setup>
import type { FileCategory, FileCategoryStats } from '../types'
import Capacity from './Capacity.vue'
import FileList from './FileList.vue'

defineProps<{
  activeCategory: FileCategory
  stats: FileCategoryStats
  usedSize: number
  totalSize: number
}>()

defineEmits<{
  'update:activeCategory': [category: FileCategory]
}>()
</script>

<template>
  <div
    class="file-manager-sider h-full min-h-0 grid grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-6 border-1 border-color-1 border-solid bg-container shadow-[var(--w-shadow-elevated)] max-[1199px]:(h-auto grid-cols-[minmax(0,1fr)_260px] grid-rows-none overflow-visible) max-[767px]:(grid-cols-1 grid-rows-[auto_auto])"
  >
    <FileList
      :active-category="activeCategory"
      :stats="stats"
      @update:active-category="$emit('update:activeCategory', $event)"
    />
    <Capacity :used-size="usedSize" :total-size="totalSize" />
  </div>
</template>
