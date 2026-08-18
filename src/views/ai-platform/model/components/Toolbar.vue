<script setup lang="ts">
import { computed } from 'vue'
import { providerOptions } from '../data'
import type { ModelPageConfig, ModelProvider } from '../types'
import type {
  ModelProviderFilter,
  ModelStatusFilter,
} from '../composables/useModelList'
import type { ModelSort } from '../types'

const props = defineProps<{
  config: ModelPageConfig
  configuredCount: number
  onlineCount: number
  providerCount: number
  total: number
}>()

const emit = defineEmits<{
  create: []
}>()

const keyword = defineModel<string>('keyword', { required: true })
const provider = defineModel<ModelProviderFilter>('provider', {
  required: true,
})
const sort = defineModel<ModelSort>('sort', { required: true })
const status = defineModel<ModelStatusFilter>('status', { required: true })

const providerSelectOptions = computed(() => [
  { label: '全部供应商', value: 'all' },
  ...providerOptions.map((option) => ({
    label: option.label,
    value: option.value as ModelProvider,
  })),
])
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
    class="flex-none border-b-1 border-color-2 border-b-solid bg-container px-16 py-16 lg:px-20"
  >
    <div class="flex flex-wrap items-start justify-between gap-14">
      <div class="min-w-0">
        <div class="flex min-w-0 items-center gap-10">
          <span
            class="size-40 flex flex-none items-center justify-center rounded-10 bg-primary/10 text-primary"
          >
            <Icon :name="props.config.icon" :size="21" />
          </span>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-8">
              <h1 class="m-0 truncate text-lg text-main font-700">
                {{ props.config.title }}
              </h1>
              <a-tag :bordered="false" color="blue">LLM</a-tag>
            </div>
            <div
              class="mt-4 flex flex-wrap items-center gap-x-12 gap-y-4 text-xs text-secondary"
            >
              <span>{{ props.total }} 个模型</span>
              <span class="inline-flex items-center gap-4">
                <i class="size-6 rounded-full bg-success" />
                {{ props.onlineCount }} 个已启用
              </span>
              <span>{{ props.providerCount }} 家供应商</span>
              <span>{{ props.configuredCount }} 个已配置密钥</span>
            </div>
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

    <p class="m-0 mt-12 max-w-800 text-sm leading-22 text-regular">
      {{ props.config.subtitle }}
    </p>

    <div class="mt-14 flex flex-wrap items-center gap-8">
      <a-input
        v-model:value="keyword"
        allow-clear
        class="w-360 max-sm:w-full"
        :placeholder="props.config.searchPlaceholder"
      >
        <template #prefix>
          <Icon name="i-lucide:search" class="text-placeholder" />
        </template>
      </a-input>
      <a-select
        v-model:value="provider"
        class="w-150 max-sm:flex-1"
        :options="providerSelectOptions"
      />
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
