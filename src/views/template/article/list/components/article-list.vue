<template>
  <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
    <ArticleToolbar
      v-model:category="categoryFilter"
      v-model:keyword="keyword"
      v-model:sort="sortBy"
      v-model:status="statusFilter"
      :categories="categories"
      :draft-count="draftCount"
      :published-count="publishedCount"
      :total="items.length"
      @create="createArticle"
    />

    <main class="min-h-0 flex-1 overflow-y-auto p-12 sm:p-16">
      <div
        v-if="isLoading"
        class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      >
        <div
          v-for="index in 10"
          :key="index"
          class="h-286 rounded-8 b-1-regular bg-container p-14"
        >
          <a-skeleton active :paragraph="{ rows: 6 }" />
        </div>
      </div>

      <a-empty
        v-else-if="paginatedItems.length === 0"
        class="h-full min-h-360 flex flex-col items-center justify-center"
        description="没有符合条件的文章"
      >
        <a-button @click="clearFilters">清除筛选</a-button>
      </a-empty>

      <AnimatedGroup
        v-else
        id="article-card-list"
        reduced-motion="user"
        :items="paginatedItems"
        :get-key="(item: ArticleItem) => item.id"
        as="div"
        class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        motion-as="div"
        layout="position"
        motion-class="min-w-0"
      >
        <template #default="{ item }">
          <ArticleCard :item="item" @action="handleCardAction" />
        </template>
      </AnimatedGroup>
    </main>

    <footer
      class="flex flex-none justify-center b-t-1-regular bg-container px-12 py-10 sm:px-16"
    >
      <a-pagination
        v-if="!isLoading && filteredItems.length > 0"
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :page-size-options="[12, 24, 36]"
        :show-total="paginationTotalText"
        :total="filteredItems.length"
        show-size-changer
      />
      <span v-else class="text-xs text-secondary">暂无分页数据</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { message, Modal } from 'antdv-next'
import { useLoading } from '@/hooks'
import { AnimatedGroup } from '@/components/animated'
import { articleItems } from '../../data'
import ArticleCard from './article-card.vue'
import ArticleToolbar from './article-toolbar.vue'
import { useArticleList } from '../hooks'
import type { ArticleAction, ArticleItem } from '../../types'

const router = useRouter()
const { isLoading } = useLoading({ delay: 220 })
const {
  categories,
  categoryFilter,
  currentPage,
  draftCount,
  filteredItems,
  items,
  keyword,
  pageSize,
  paginatedItems,
  publishedCount,
  sortBy,
  statusFilter,
  archiveItem,
  clearFilters,
  duplicateItem,
  publishItem,
  removeItem,
} = useArticleList(articleItems)

function openEditor(id: string) {
  router.push({ path: '/template/article/editor', query: { id } })
}

function createArticle() {
  router.push({ path: '/template/article/editor', query: { create: '1' } })
}

function paginationTotalText(total: number) {
  return '共 ' + total + ' 篇文章'
}

function handleCardAction(action: ArticleAction, item: ArticleItem) {
  if (action === 'delete') {
    Modal.confirm({
      title: '删除文章',
      content: '确定删除「' + item.title + '」吗？删除后无法恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        removeItem(item.id)
        message.success('文章已删除')
      },
    })
    return
  }

  if (action === 'duplicate') {
    duplicateItem(item.id)
    message.success('文章副本已创建')
    return
  }

  if (action === 'archive') {
    archiveItem(item.id)
    message.success(
      item.status === 'archived' ? '文章已移出归档' : '文章已归档'
    )
    return
  }

  if (action === 'publish') {
    publishItem(item.id)
    message.success('文章已发布')
    return
  }

  openEditor(item.id)
}
</script>
