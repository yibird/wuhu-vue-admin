<script setup lang="ts">
import type {
  WorkflowListSort,
  WorkflowListStatusFilter,
} from '../composables/useWorkflowList'

const props = defineProps<{
  draftCount: number
  ownerOptions: Array<{ label: string; value: string }>
  publishedCount: number
  total: number
}>()

const emit = defineEmits<{
  create: []
}>()

const keyword = defineModel<string>('keyword', { required: true })
const owner = defineModel<string>('owner', { required: true })
const sort = defineModel<WorkflowListSort>('sort', { required: true })
const status = defineModel<WorkflowListStatusFilter>('status', {
  required: true,
})

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '已停用', value: 'disabled' },
]

const sortOptions = [
  { label: '最近更新', value: 'updated-desc' },
  { label: '最近创建', value: 'created-desc' },
  { label: '运行次数', value: 'runs-desc' },
]
const ownerSelectOptions = computed(() => [
  { label: '全部负责人', value: 'all' },
  ...props.ownerOptions,
])
</script>

<template>
  <header
    class="border-b-1 border-color-2 border-b-solid bg-container px-16 py-16"
  >
    <div class="flex flex-wrap items-center justify-between gap-14">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-9">
          <span
            class="size-36 flex-center rounded-6 bg-primary/10 text-primary"
          >
            <Icon name="i-lucide:workflow" :size="19" />
          </span>
          <div>
            <h1 class="m-0 text-lg text-main font-700">流程列表</h1>
            <p class="m-0 mt-2 text-xs text-secondary">
              共 {{ total }} 个流程，{{ publishedCount }} 个已发布，{{
                draftCount
              }}
              个待发布
            </p>
          </div>
        </div>
      </div>

      <a-button type="primary" @click="emit('create')">
        <template #icon>
          <Icon name="i-lucide:plus" />
        </template>
        新建流程
      </a-button>
    </div>

    <div class="mt-14 flex flex-wrap items-center gap-8">
      <a-input
        v-model:value="keyword"
        allow-clear
        class="w-260 max-sm:w-full"
        placeholder="搜索名称、分类或负责人"
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
        v-model:value="owner"
        class="w-138 max-sm:flex-1"
        :options="ownerSelectOptions"
      />
      <a-select
        v-model:value="sort"
        class="ml-auto w-128 max-sm:ml-0 max-sm:w-full"
        :options="sortOptions"
      />
    </div>
  </header>
</template>
