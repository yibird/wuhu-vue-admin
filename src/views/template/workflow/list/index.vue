<script setup lang="ts">
import { Modal, message } from 'antdv-next'
import { useRouter } from 'vue-router'
import { useLoading } from '@/composables'
import Card from './components/Card.vue'
import Toolbar from './components/Toolbar.vue'
import { useWorkflowList } from './composables/useWorkflowList'
import type { WorkflowDefinition } from '../management/types'

const router = useRouter()
const { isLoading } = useLoading({ delay: 280 })
const {
  currentPage,
  draftCount,
  filteredWorkflows,
  keyword,
  ownerFilter,
  owners,
  pageSize,
  paginatedWorkflows,
  publishedCount,
  sortBy,
  statusFilter,
  workflows,
  duplicateWorkflow,
  removeWorkflow,
  toggleWorkflow,
} = useWorkflowList()

function openDesigner(workflow?: WorkflowDefinition) {
  void router.push({
    path: '/template/workflow/designer',
    query: workflow ? { workflowId: workflow.id } : { mode: 'create' },
  })
}

function clearFilters() {
  keyword.value = ''
  statusFilter.value = 'all'
  ownerFilter.value = 'all'
}

function paginationTotalText(total: number) {
  return `共 ${total} 条流程`
}

function handleCardAction(
  key: 'delete' | 'duplicate' | 'toggle',
  workflow: WorkflowDefinition
) {
  if (key === 'delete') {
    Modal.confirm({
      title: '删除流程',
      content: `确定删除「${workflow.name}」吗？删除后无法恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        removeWorkflow(workflow.id)
        message.success('流程已删除')
      },
    })
    return
  }

  if (key === 'duplicate') {
    duplicateWorkflow(workflow.id)
    message.success('已创建流程副本')
    return
  }

  toggleWorkflow(workflow.id)
  message.success(workflow.status === 'disabled' ? '流程已启用' : '流程已停用')
}
</script>

<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <Toolbar
        class="flex-none"
        v-model:keyword="keyword"
        v-model:owner="ownerFilter"
        v-model:sort="sortBy"
        v-model:status="statusFilter"
        :draft-count="draftCount"
        :owner-options="owners"
        :published-count="publishedCount"
        :total="workflows.length"
        @create="openDesigner()"
      />

      <main class="min-h-0 flex-1 overflow-y-auto p-12 sm:p-16">
        <div
          v-if="isLoading"
          class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
        >
          <div
            v-for="index in 12"
            :key="index"
            class="h-292 rounded-8 border-1 border-color-2 border-solid bg-container p-14"
          >
            <a-skeleton active :paragraph="{ rows: 6 }" />
          </div>
        </div>

        <a-empty
          v-else-if="paginatedWorkflows.length === 0"
          class="py-72"
          description="没有符合筛选条件的流程"
        >
          <a-button @click="clearFilters">清除筛选</a-button>
        </a-empty>

        <div
          v-else
          class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
        >
          <Card
            v-for="workflow in paginatedWorkflows"
            :key="workflow.id"
            :workflow="workflow"
            @action="handleCardAction"
            @open="openDesigner"
          />
        </div>
      </main>

      <footer
        v-if="!isLoading && filteredWorkflows.length > 0"
        class="flex flex-none justify-center border-t-1 border-color-2 border-t-solid px-12 py-10 sm:px-16"
      >
        <a-pagination
          v-model:current="currentPage"
          v-model:page-size="pageSize"
          :page-size-options="[12, 24, 36]"
          :show-total="paginationTotalText"
          :total="filteredWorkflows.length"
          show-size-changer
        />
      </footer>
    </div>
  </WView>
</template>
