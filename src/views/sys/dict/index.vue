<script setup lang="ts">
import { Modal, message } from 'antdv-next'
import {
  deleteDictApi,
  getDictPageListApi,
  type DictQuery,
  type DictResp,
} from '@/apis'
import { WView } from '@/components'
import { useTable } from '@/components/table-plus'
import { Content, DictForm, Header as DictHeader, Sider } from './components'
import type { DictItemFilters } from './components'

const dictFormOpen = shallowRef(false)
const editingDictId = shallowRef<string>()
const selectedId = shallowRef<string>()
const itemKeyword = shallowRef('')
const itemStatus = shallowRef<boolean | undefined>(undefined)
const itemFilters = shallowRef<DictItemFilters>({})
const dictQuery = shallowRef<DictQuery>({ pageNum: 1, pageSize: 1000 })

const {
  loading: dictLoading,
  dataSource: dictionaries,
  run: loadDictionaries,
} = useTable<DictResp, DictQuery>({
  api: () => getDictPageListApi(dictQuery.value),
  rowKey: (row) => row.id,
})

const selectedDictionary = computed(() =>
  dictionaries.value.find((item) => item.id === selectedId.value)
)

watch(
  dictionaries,
  (items) => {
    if (!items.length) {
      selectedId.value = undefined
      return
    }
    if (
      !selectedId.value ||
      !items.some((item) => item.id === selectedId.value)
    ) {
      selectedId.value = items[0].id
    }
  },
  { immediate: true }
)

watch(selectedId, () => {
  itemKeyword.value = ''
  itemStatus.value = undefined
  itemFilters.value = {}
})

function selectDictionary(item: DictResp) {
  selectedId.value = item.id
}

function openCreateDict() {
  editingDictId.value = undefined
  dictFormOpen.value = true
}

function openEditDict(item: DictResp) {
  editingDictId.value = item.id
  dictFormOpen.value = true
}

function onDictSuccess() {
  loadDictionaries(dictQuery.value)
}

function applyItemSearch() {
  itemFilters.value = {
    label: itemKeyword.value.trim() || undefined,
    status: itemStatus.value,
  }
}

function resetItemSearch() {
  itemKeyword.value = ''
  itemStatus.value = undefined
  itemFilters.value = {}
}

function deleteDictionary(item: DictResp) {
  Modal.confirm({
    title: '删除字典',
    content: `确定删除「${item.name}」及其全部明细吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteDictApi([item.id])
        if (selectedId.value === item.id) selectedId.value = undefined
        message.success('字典删除成功')
        loadDictionaries(dictQuery.value)
      } catch {
        // 业务错误已由请求层统一提示
      }
    },
  })
}
</script>

<template>
  <WView
    :full="true"
    :gap="10"
    :padding="10"
    class="bg-page"
    direction="horizontal"
  >
    <WView.Sider
      class="h-full overflow-hidden rounded-6 border-1 border-color-1 border-solid"
      width="260px"
    >
      <Sider
        :data="dictionaries"
        :loading="dictLoading"
        :selected-id="selectedId"
        @create="openCreateDict"
        @delete="deleteDictionary"
        @edit="openEditDict"
        @select="selectDictionary"
      />
    </WView.Sider>

    <WView :full="false" :gap="10" :padding="false" class="min-w-0 flex-1">
      <WView.Header
        class="shrink-0 rounded-6 border-1 border-color-1 border-solid bg-container px-14 py-10"
      >
        <DictHeader
          v-model:keyword="itemKeyword"
          v-model:status="itemStatus"
          :dictionary="selectedDictionary"
          @reset="resetItemSearch"
          @search="applyItemSearch"
        />
      </WView.Header>

      <WView.Content
        class="min-h-0 overflow-hidden rounded-6 border-1 border-color-1 border-solid bg-container"
      >
        <Content
          v-if="selectedDictionary"
          :dict-id="selectedDictionary.id"
          :filters="itemFilters"
        />
        <div v-else class="h-full flex-center">
          <a-empty description="暂无字典数据" />
        </div>
      </WView.Content>
    </WView>

    <DictForm
      v-model:open="dictFormOpen"
      :id="editingDictId"
      @success="onDictSuccess"
    />
  </WView>
</template>
