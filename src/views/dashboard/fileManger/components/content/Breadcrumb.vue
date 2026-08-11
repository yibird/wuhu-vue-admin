<script lang="ts" setup>
import { Icon } from '@/components'
import type { FileBreadcrumbItem } from '../types'

defineProps<{
  items: FileBreadcrumbItem[]
}>()

const emit = defineEmits<{
  changeDirectory: [id: string]
  resetView: []
}>()
</script>

<template>
  <a-breadcrumb class="file-breadcrumb max-[575px]:hidden">
    <a-breadcrumb-item class="file-breadcrumb__item">
      <button
        type="button"
        class="group h-24 inline-flex cursor-pointer items-center gap-4 border-none bg-transparent p-0 text-secondary leading-24px outline-none transition-colors hover:text-primary focus-visible:text-primary active:scale-98"
        @click="emit('resetView')"
      >
        <Icon
          name="i-lucide:folder-open"
          :size="18"
          class="shrink-0 transition-transform duration-180 group-hover:scale-108"
        />
        <span class="text-sm">文件管理</span>
      </button>
    </a-breadcrumb-item>

    <a-breadcrumb-item
      v-for="item in items"
      :key="item.id"
      class="file-breadcrumb__item"
    >
      <button
        type="button"
        class="group h-24 inline-flex cursor-pointer items-center gap-4 border-none bg-transparent p-0 text-primary leading-24px outline-none transition-colors hover:text-primary focus-visible:text-primary active:scale-98"
        @click="emit('changeDirectory', item.id)"
      >
        <Icon
          name="i-lucide:folder"
          :size="18"
          class="shrink-0 transition-transform duration-180 group-hover:-translate-y-1"
        />
        <span class="text-sm">{{ item.fileName }}</span>
      </button>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<style scoped>
.file-breadcrumb {
  display: flex;
  align-items: center;
  min-height: 24px;
  line-height: 24px;
}

.file-breadcrumb :deep(.ant-breadcrumb-separator),
.file-breadcrumb :deep(.file-breadcrumb__item),
.file-breadcrumb :deep(.file-breadcrumb__item > span) {
  display: inline-flex;
  align-items: center;
  line-height: 24px;
}
</style>
