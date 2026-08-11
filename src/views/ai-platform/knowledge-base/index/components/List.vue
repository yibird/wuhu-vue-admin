<script setup lang="ts">
import { Modal, message } from 'antdv-next'
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useLoading } from '@/composables'
import Card from './Card.vue'
import CreateModal from './CreateModal.vue'
import Toolbar from './Toolbar.vue'
import { useKnowledgeBaseList } from '../composables/useKnowledgeBaseList'
import type {
  KnowledgeBaseAction,
  KnowledgeBaseCreateInput,
  KnowledgeBaseItem,
  KnowledgeBasePageConfig,
} from '../../types'

const props = defineProps<{
  config: KnowledgeBasePageConfig
  items: KnowledgeBaseItem[]
  editPath?: string
  detailPath?: string
}>()

const router = useRouter()
const createModalOpen = shallowRef(false)
const { isLoading } = useLoading({ delay: 220 })
const {
  currentPage,
  draftCount,
  filteredItems,
  items,
  keyword,
  onlineCount,
  pageSize,
  paginatedItems,
  sortBy,
  statusFilter,
  createItem,
  duplicateItem,
  removeItem,
  toggleItem,
} = useKnowledgeBaseList(props.items)

function clearFilters() {
  keyword.value = ''
  statusFilter.value = 'all'
  sortBy.value = 'updated-desc'
}

function paginationTotalText(total: number) {
  return `共 ${total} 个${props.config.totalText}`
}

function handleCreate() {
  createModalOpen.value = true
}

function handleCreated(input: KnowledgeBaseCreateInput) {
  const item = createItem(input)
  message.success(`已创建「${item.name}」`)
}

function handleCardAction(
  action: KnowledgeBaseAction,
  item: KnowledgeBaseItem
) {
  if (action === 'delete') {
    Modal.confirm({
      title: `删除${props.config.totalText}`,
      content: `确定删除「${item.name}」吗？删除后无法恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        removeItem(item.id)
        message.success('删除成功')
      },
    })
    return
  }

  if (action === 'duplicate') {
    duplicateItem(item.id)
    message.success('已创建副本')
    return
  }

  if (action === 'toggle') {
    const nextStatus =
      item.status === 'online'
        ? props.config.statusLabels.offline
        : props.config.statusLabels.online
    toggleItem(item.id)
    message.success(`状态已更新为「${nextStatus}」`)
    return
  }

  if (action === 'archive') {
    message.success(`已归档「${item.name}」`)
    return
  }

  if (action === 'edit') {
    if (props.editPath) {
      void router.push({ path: props.editPath, query: { id: item.id } })
      return
    }
    message.info(`编辑「${item.name}」功能待接入`)
    return
  }

  if (props.detailPath) {
    void router.push({ path: props.detailPath, query: { id: item.id } })
    return
  }

  message.info(`打开「${item.name}」详情`)
}
</script>

<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <Toolbar
        v-model:keyword="keyword"
        v-model:sort="sortBy"
        v-model:status="statusFilter"
        :config="props.config"
        :draft-count="draftCount"
        :online-count="onlineCount"
        :total="items.length"
        @create="handleCreate"
      />

      <main
        data-testid="ai-resource-scroll"
        class="min-h-0 flex-1 overflow-y-auto p-12 sm:p-16"
      >
        <div
          v-if="isLoading"
          class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
        >
          <div
            v-for="index in 12"
            :key="index"
            class="h-270 rounded-8 border-1 border-color-2 border-solid bg-container p-14"
          >
            <a-skeleton active :paragraph="{ rows: 5 }" />
          </div>
        </div>

        <a-empty
          v-else-if="paginatedItems.length === 0"
          class="h-full min-h-360 flex flex-col items-center justify-center"
          :description="props.config.emptyText"
        >
          <a-button @click="clearFilters">清除筛选</a-button>
        </a-empty>

        <div
          v-else
          class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
        >
          <Card
            v-for="item in paginatedItems"
            :key="item.id"
            :item="item"
            :status-labels="props.config.statusLabels"
            :subject="props.config.totalText"
            @action="handleCardAction"
          />
        </div>
      </main>

      <footer
        data-testid="ai-resource-pagination"
        class="flex flex-none justify-center border-t-1 border-color-2 border-t-solid bg-container px-12 py-10 sm:px-16"
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

      <CreateModal v-model:open="createModalOpen" @create="handleCreated" />
    </div>
  </WView>
</template>
