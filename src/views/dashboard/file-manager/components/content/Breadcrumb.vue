<script lang="ts" setup>
import { Icon } from '@/components/icon'
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
  <a-breadcrumb
    class="min-h-24 flex items-center leading-24px max-[575px]:hidden [&_.ant-breadcrumb-separator]:(inline-flex items-center leading-24px)"
  >
    <a-breadcrumb-item
      class="inline-flex items-center leading-24px [&>span]:(inline-flex items-center leading-24px)"
    >
      <button
        type="button"
        class="group h-24 inline-flex cursor-pointer items-center gap-4 border-none bg-transparent p-0 text-secondary leading-24px outline-none transition-colors hover:text-primary focus-visible:text-primary active:scale-98"
        @click="emit('resetView')"
      >
        <Icon
          name="i-lucide:folder-open"
          :size="18"
          class="shrink-0 transition-transform duration-motion-base group-hover:scale-108"
        />
        <span class="text-sm">文件管理</span>
      </button>
    </a-breadcrumb-item>

    <a-breadcrumb-item
      v-for="item in items"
      :key="item.id"
      class="inline-flex items-center leading-24px [&>span]:(inline-flex items-center leading-24px)"
    >
      <button
        type="button"
        class="group h-24 inline-flex cursor-pointer items-center gap-4 border-none bg-transparent p-0 text-primary leading-24px outline-none transition-colors hover:text-primary focus-visible:text-primary active:scale-98"
        @click="emit('changeDirectory', item.id)"
      >
        <Icon
          name="i-lucide:folder"
          :size="18"
          class="shrink-0 transition-transform duration-motion-base group-hover:-translate-y-1"
        />
        <span class="text-sm">{{ item.fileName }}</span>
      </button>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
