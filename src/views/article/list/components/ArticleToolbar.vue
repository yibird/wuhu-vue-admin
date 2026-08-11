<script setup lang="ts">
import { computed } from 'vue'
import type { ArticleSort } from '../../types'
import type { ArticleStatusFilter } from '../composables/useArticleList'

const props = defineProps<{
  categories: string[]
  draftCount: number
  publishedCount: number
  total: number
}>()

const emit = defineEmits<{
  create: []
}>()

const keyword = defineModel<string>('keyword', { required: true })
const status = defineModel<ArticleStatusFilter>('status', { required: true })
const category = defineModel<string>('category', { required: true })
const sort = defineModel<ArticleSort>('sort', { required: true })

const categoryOptions = computed(() => [
  { label: '全部分类', value: 'all' },
  ...props.categories.map((item) => ({ label: item, value: item })),
])

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '已归档', value: 'archived' },
]

const sortOptions = [
  { label: '最近更新', value: 'updated-desc' },
  { label: '最近创建', value: 'created-desc' },
  { label: '浏览最多', value: 'views-desc' },
  { label: '标题升序', value: 'title-asc' },
]
</script>

<template>
  <header
    class="flex-none border-b-1 border-color-2 border-b-solid bg-container px-16 py-16"
  >
    <div class="flex flex-wrap items-center justify-between gap-14">
      <div class="flex min-w-0 items-center gap-10">
        <span
          class="size-38 flex-center flex-none rounded-8 bg-primary/10 text-primary"
        >
          <Icon name="i-lucide:newspaper" :size="20" />
        </span>
        <div class="min-w-0">
          <h1 class="m-0 truncate text-lg text-main font-700">文章列表</h1>
          <p class="m-0 mt-2 text-xs text-secondary">
            共 {{ props.total }} 篇，{{ props.publishedCount }} 篇已发布，{{
              props.draftCount
            }}
            篇草稿
          </p>
        </div>
      </div>

      <a-button type="primary" @click="emit('create')">
        <template #icon>
          <Icon name="i-lucide:plus" />
        </template>
        新建文章
      </a-button>
    </div>

    <div class="mt-14 flex flex-wrap items-center gap-8">
      <a-input
        v-model:value="keyword"
        allow-clear
        class="w-320 max-sm:w-full"
        placeholder="搜索标题、摘要、标签或作者"
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
        v-model:value="category"
        class="w-128 max-sm:flex-1"
        :options="categoryOptions"
      />
      <a-select
        v-model:value="sort"
        class="ml-auto w-128 max-sm:ml-0 max-sm:flex-1"
        :options="sortOptions"
      />
    </div>
  </header>
</template>
