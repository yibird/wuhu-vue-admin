<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <Toolbar
        class="page-enter page-enter--1"
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
        class="page-enter page-enter--2 min-h-0 flex-1 p-12 overflow-y-auto overflow-x-hidden sm:p-16 lg:p-20"
      >
        <div
          v-if="isLoading"
          class="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        >
          <div
            v-for="index in 12"
            :key="index"
            class="h-270 rounded-8 b-1-regular bg-container p-14"
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

        <AnimatedGroup
          v-else
          id="knowledge-base-card-list"
          reduced-motion="user"
          :items="paginatedItems"
          :get-key="(item: KnowledgeBaseItem) => item.id"
          as="div"
          class="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          motion-as="div"
          layout="position"
          motion-class="min-w-0"
        >
          <template #default="{ item }">
            <Card
              class="h-full"
              :item="item"
              :status-labels="props.config.statusLabels"
              :subject="props.config.totalText"
              @action="handleCardAction"
            />
          </template>
        </AnimatedGroup>
      </main>

      <footer
        data-testid="ai-resource-pagination"
        class="page-enter page-enter--3 flex flex-none justify-center b-t-1-regular bg-container px-12 py-10 sm:px-16"
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

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { message, Modal } from 'antdv-next'
import { AnimatedGroup } from '@/components/animated'
import { useLoading } from '@/hooks'
import Card from './card.vue'
import CreateModal from './create-modal.vue'
import Toolbar from './toolbar.vue'
import { useKnowledgeBaseList } from '../hooks'
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
      router.push({ path: props.editPath, query: { id: item.id } })
      return
    }
    message.info(`编辑「${item.name}」功能待接入`)
    return
  }

  if (props.detailPath) {
    router.push({ path: props.detailPath, query: { id: item.id } })
    return
  }

  message.info(`打开「${item.name}」详情`)
}
</script>
