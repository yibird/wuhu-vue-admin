<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <header
        class="page-enter page-enter--1 flex flex-none flex-wrap items-center gap-10 border-b-1 border-color-2 border-b-solid bg-container px-12 py-10 sm:px-16"
      >
        <span
          class="size-38 flex flex-none items-center justify-center rounded-8 bg-primary/12 text-primary"
        >
          <Icon name="i-lucide:clipboard-check" :size="19" />
        </span>
        <div class="min-w-0 flex-1">
          <h1 class="m-0 text-base text-main font-700">我的审批</h1>
          <p class="m-0 mt-2 text-xs text-secondary">
            共 {{ total }} 个审批流，点击卡片进入流程设计器
          </p>
        </div>

        <a-input-search
          v-model:value="keyword"
          allow-clear
          class="w-full sm:w-220"
          placeholder="搜索审批名称/编码"
          @search="search"
        />
        <a-select
          v-model:value="categoryId"
          allow-clear
          class="w-full sm:w-150"
          placeholder="全部分组"
          :options="categoryOptions"
          @change="search"
        />
        <a-select
          v-model:value="state"
          allow-clear
          class="w-full sm:w-130"
          placeholder="全部状态"
          :options="stateOptions"
          @change="search"
        />
        <a-button @click="reset">重置</a-button>
        <a-button type="primary" @click="createDefinition">
          <template #icon><Icon name="i-lucide:plus" /></template>
          新建审批
        </a-button>
      </header>

      <main
        class="page-enter page-enter--2 min-h-0 flex-1 overflow-y-auto p-12 sm:p-16"
      >
        <div
          v-if="loading"
          class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <div
            v-for="index in 10"
            :key="index"
            class="h-252 rounded-8 border-1 border-color-2 border-solid bg-container p-14"
          >
            <a-skeleton active :paragraph="{ rows: 5 }" />
          </div>
        </div>

        <a-empty
          v-else-if="list.length === 0"
          class="py-72"
          description="还没有审批流，先创建一个吧"
        >
          <a-button type="primary" @click="createDefinition">
            新建审批
          </a-button>
        </a-empty>

        <div
          v-else
          class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <ApprovalCard
            v-for="definition in list"
            :key="definition.id"
            :definition="definition"
            @open="openDesigner"
            @duplicate="duplicateDefinition"
            @remove="removeDefinition"
          />
        </div>
      </main>

      <footer
        v-if="total > 0"
        class="page-enter page-enter--3 flex flex-none justify-center border-t-1 border-color-2 border-t-solid bg-container px-12 py-10"
      >
        <a-pagination
          :current="current"
          :page-size="pageSize"
          :page-size-options="[12, 24, 36]"
          :show-total="paginationTotalText"
          :total="total"
          show-size-changer
          @change="onPageChange"
        />
      </footer>
    </div>
  </WView>
</template>

<script setup lang="ts">
import { Icon } from '@/components'
import { useTabs } from '@/hooks'
import { ApprovalCard } from '../components'
import { definitionStateOptions } from '../shared'
import { useApprovalList } from './hooks'
import type { ApprovalDefinitionResp } from '@/apis'

const { openRouteTab } = useTabs()

const {
  categories,
  categoryId,
  current,
  keyword,
  list,
  loading,
  pageSize,
  state,
  total,
  duplicateDefinition,
  onPageChange,
  removeDefinition,
  reset,
  search,
} = useApprovalList()

const categoryOptions = computed(() =>
  categories.value.map((category) => ({
    label: category.name,
    value: category.id,
  }))
)

const stateOptions = definitionStateOptions.map((item) => ({
  label: item.label,
  value: item.value,
}))

function openDesigner(definition: ApprovalDefinitionResp) {
  openRouteTab({
    path: '/template/approval/designer',
    title: definition.name,
    icon: definition.icon || 'i-lucide:workflow',
    query: { id: definition.id },
  })
}

function createDefinition() {
  openRouteTab({
    path: '/template/approval/designer',
    title: '新建审批流',
    icon: 'i-lucide:plus',
    query: { mode: 'create' },
  })
}

function paginationTotalText(value: number) {
  return `共 ${value} 个审批流`
}
</script>
