<script setup lang="ts">
import { message, Modal } from 'antdv-next'
import { AnimatePresence, LayoutGroup, Motion, MotionConfig } from 'motion-v'
import { useLoading } from '@/composables'
import {
  cardListMotionAnimate,
  cardListMotionExit,
  cardListMotionInitial,
  cardListMotionTransition,
} from '@/styles'
import ModelCard from './ModelCard.vue'
import ModelConfigDrawer from './ModelConfigDrawer.vue'
import Toolbar from './Toolbar.vue'
import { useModelList } from '../composables/useModelList'
import type {
  ModelAction,
  ModelCreateInput,
  ModelItem,
  ModelPageConfig,
} from '../types'

const props = defineProps<{
  config: ModelPageConfig
  items: ModelItem[]
}>()

const { isLoading } = useLoading({ delay: 220 })
const createDrawerOpen = shallowRef(false)
const editingItem = shallowRef<ModelItem>()
const {
  configuredCount,
  currentPage,
  filteredItems,
  items,
  keyword,
  onlineCount,
  pageSize,
  paginatedItems,
  providerCount,
  providerFilter,
  sortBy,
  statusFilter,
  createItem,
  duplicateItem,
  removeItem,
  resetFilters,
  toggleItem,
  updateItem,
} = useModelList(props.items)

function paginationTotalText(total: number) {
  return `共 ${total} 个${props.config.totalText}`
}

function handleCreate() {
  editingItem.value = undefined
  createDrawerOpen.value = true
}

function handleEdit(item: ModelItem) {
  editingItem.value = item
  createDrawerOpen.value = true
}

function handleSaved(input: ModelCreateInput) {
  if (editingItem.value) {
    const item = updateItem(editingItem.value.id, input)
    if (item) message.success(`「${item.name}」配置已保存`)
  } else {
    const item = createItem(input)
    message.success(`已创建「${item.name}」`)
  }
}

function handleCardAction(action: ModelAction, item: ModelItem) {
  if (action === 'delete') {
    Modal.confirm({
      title: '删除模型',
      content: `确定删除「${item.name}」吗？删除后无法恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        removeItem(item.id)
        message.success('模型已删除')
      },
    })
    return
  }

  if (action === 'duplicate') {
    const duplicated = duplicateItem(item.id)
    if (duplicated) message.success(`已创建「${duplicated.name}」`)
    return
  }

  if (action === 'toggle') {
    toggleItem(item.id)
    message.success(
      item.status === 'online' ? '模型已停用' : '模型已启用，可参与路由'
    )
    return
  }

  if (action === 'test') {
    if (!item.apiKeyConfigured) {
      message.warning('请先配置 API Key，再测试模型连接')
      return
    }
    message.success(`「${item.name}」连接测试通过`)
    return
  }

  handleEdit(item)
}
</script>

<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <Toolbar
        v-model:keyword="keyword"
        v-model:provider="providerFilter"
        v-model:sort="sortBy"
        v-model:status="statusFilter"
        :config="props.config"
        :configured-count="configuredCount"
        :online-count="onlineCount"
        :provider-count="providerCount"
        :total="items.length"
        @create="handleCreate"
      />

      <main
        data-testid="model-list-scroll"
        class="min-h-0 flex-1 overflow-y-auto p-12 sm:p-16 lg:p-20"
      >
        <div
          v-if="isLoading"
          class="grid grid-cols-1 gap-12 md:grid-cols-3 2xl:grid-cols-4"
        >
          <div
            v-for="index in 10"
            :key="index"
            class="h-310 rounded-8 border-1 border-color-2 border-solid bg-container p-14"
          >
            <a-skeleton active :paragraph="{ rows: 6 }" />
          </div>
        </div>

        <a-empty
          v-else-if="paginatedItems.length === 0"
          class="h-full min-h-360 flex flex-col items-center justify-center"
          :description="props.config.emptyText"
        >
          <a-button @click="resetFilters">清除筛选</a-button>
        </a-empty>

        <MotionConfig v-else reduced-motion="user">
          <LayoutGroup id="model-card-list">
            <AnimatePresence
              as="div"
              mode="popLayout"
              :initial="false"
              class="grid grid-cols-1 gap-12 md:grid-cols-3 2xl:grid-cols-4"
            >
              <Motion
                v-for="item in paginatedItems"
                :key="item.id"
                as="div"
                layout="position"
                :initial="cardListMotionInitial"
                :animate="cardListMotionAnimate"
                :exit="cardListMotionExit"
                :transition="cardListMotionTransition"
                class="min-w-0"
              >
                <ModelCard
                  class="h-full"
                  :item="item"
                  :status-labels="props.config.statusLabels"
                  @action="handleCardAction"
                />
              </Motion>
            </AnimatePresence>
          </LayoutGroup>
        </MotionConfig>
      </main>

      <footer
        data-testid="model-list-pagination"
        class="flex flex-none justify-center border-t-1 border-color-2 border-t-solid bg-container px-12 py-10 sm:px-16"
      >
        <a-pagination
          v-if="!isLoading && filteredItems.length > 0"
          v-model:current="currentPage"
          v-model:page-size="pageSize"
          :page-size-options="[10, 20, 50, 100, 200, 500]"
          :show-total="paginationTotalText"
          :total="filteredItems.length"
          show-size-changer
        />
        <span v-else class="text-xs text-secondary">暂无分页数据</span>
      </footer>

      <ModelConfigDrawer
        v-model:open="createDrawerOpen"
        :item="editingItem"
        @save="handleSaved"
      />
    </div>
  </WView>
</template>
