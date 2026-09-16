<script setup lang="ts">
import type { DictHeaderProps } from './types'

defineProps<DictHeaderProps>()
const keyword = defineModel<string>('keyword', { default: '' })
const status = defineModel<boolean | undefined>('status', {
  default: undefined,
})
const emit = defineEmits<{
  search: []
  reset: []
}>()

const statusOptions = [
  { label: '正常', value: true },
  { label: '停用', value: false },
]
</script>

<template>
  <div class="min-h-64 flex flex-wrap items-center justify-between gap-12">
    <div v-if="dictionary" class="min-w-0 flex items-center gap-10">
      <span
        class="size-36 shrink-0 flex items-center justify-center rounded-6 bg-primary/10 text-primary"
      >
        <Icon name="i-lucide:list-tree" :size="18" />
      </span>
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-8">
          <h2 class="m-0 truncate text-md text-main font-600">
            {{ dictionary.name }}
          </h2>
          <a-tag :color="dictionary.status ? 'success' : 'default'" bordered>
            {{ dictionary.status ? '正常' : '停用' }}
          </a-tag>
        </div>
        <div class="mt-3 truncate text-xs text-secondary">
          {{ dictionary.type }}
        </div>
      </div>
    </div>
    <a-empty v-else :image="false" description="请选择一个字典" />

    <div v-if="dictionary" class="min-w-0 flex flex-wrap items-center gap-8">
      <a-input
        v-model:value="keyword"
        allow-clear
        class="w-220"
        placeholder="搜索标签或值"
        @press-enter="emit('search')"
      >
        <template #prefix>
          <Icon name="i-lucide:search" class="text-muted" />
        </template>
      </a-input>
      <a-select
        v-model:value="status"
        allow-clear
        class="w-120"
        :options="statusOptions"
        placeholder="状态"
        @change="emit('search')"
      />
      <a-button @click="emit('reset')">
        <template #icon><Icon name="i-lucide:rotate-ccw" /></template>
        重置
      </a-button>
      <a-button type="primary" @click="emit('search')">
        <template #icon><Icon name="i-lucide:search" /></template>
        查询
      </a-button>
    </div>
  </div>
</template>
