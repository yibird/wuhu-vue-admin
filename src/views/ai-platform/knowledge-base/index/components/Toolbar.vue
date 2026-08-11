<script setup lang="ts">
import { computed } from 'vue'
import type { KnowledgeBasePageConfig, KnowledgeBaseSort } from '../../types'
import type { KnowledgeBaseStatusFilter } from '../composables/useKnowledgeBaseList'

const props = defineProps<{
  config: KnowledgeBasePageConfig
  draftCount: number
  onlineCount: number
  total: number
}>()

const emit = defineEmits<{
  create: []
}>()

const keyword = defineModel<string>('keyword', { required: true })
const sort = defineModel<KnowledgeBaseSort>('sort', { required: true })
const status = defineModel<KnowledgeBaseStatusFilter>('status', {
  required: true,
})

const statusOptions = computed(() => [
  { label: '全部状态', value: 'all' },
  { label: props.config.statusLabels.online, value: 'online' },
  { label: props.config.statusLabels.draft, value: 'draft' },
  { label: props.config.statusLabels.offline, value: 'offline' },
])

const sortOptions = [
  { label: '最近更新', value: 'updated-desc' },
  { label: '最近创建', value: 'created-desc' },
  { label: '名称升序', value: 'name-asc' },
]
</script>

<template>
  <header
    class="flex-none border-b-1 border-color-2 border-b-solid bg-container px-16 py-16"
  >
    <div class="flex flex-wrap items-center justify-between gap-14">
      <div class="min-w-0">
        <div class="flex min-w-0 items-center gap-10">
          <span
            class="size-38 flex-center flex-none rounded-8 bg-primary/10 text-primary"
          >
            <Icon :name="props.config.icon" :size="20" />
          </span>
          <div class="min-w-0">
            <h1 class="m-0 truncate text-lg text-main font-700">
              {{ props.config.title }}
            </h1>
            <p class="m-0 mt-2 text-xs text-secondary">
              共 {{ props.total }} 个{{ props.config.totalText }}，{{
                props.onlineCount
              }}
              个{{ props.config.activeText }}，{{ props.draftCount }} 个{{
                props.config.draftText
              }}
            </p>
          </div>
        </div>
      </div>

      <a-button type="primary" @click="emit('create')">
        <template #icon>
          <Icon name="i-lucide:plus" />
        </template>
        {{ props.config.createText }}
      </a-button>
    </div>

    <p class="m-0 mt-12 max-w-760 text-sm text-regular">
      {{ props.config.subtitle }}
    </p>

    <div class="mt-14 flex flex-wrap items-center gap-8">
      <a-input
        v-model:value="keyword"
        allow-clear
        class="w-320 max-sm:w-full"
        :placeholder="props.config.searchPlaceholder"
      >
        <template #prefix>
          <Icon name="i-lucide:search" class="text-placeholder" />
        </template>
      </a-input>
      <a-select
        v-model:value="status"
        class="w-128 max-sm:flex-1"
        :options="statusOptions"
      />
      <a-select
        v-model:value="sort"
        class="ml-auto w-128 max-sm:ml-0 max-sm:flex-1"
        :options="sortOptions"
      />
    </div>
  </header>
</template>
