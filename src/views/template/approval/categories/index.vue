<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <header
        class="page-enter page-enter--1 flex flex-none flex-wrap items-center gap-10 b-b-1-regular bg-container px-12 py-10 sm:px-16"
      >
        <span
          class="size-38 flex flex-none items-center justify-center rounded-8 bg-primary/12 text-primary"
        >
          <Icon name="i-lucide:layers" :size="19" />
        </span>
        <div class="min-w-0 flex-1">
          <h1 class="m-0 text-base text-main font-700">流程分组</h1>
          <p class="m-0 mt-2 text-xs text-secondary">
            按业务域管理审批流程，点击卡片进入设计器
          </p>
        </div>
        <a-button type="primary" @click="openCreate">
          <template #icon><Icon name="i-lucide:plus" /></template>
          新建分组
        </a-button>
      </header>

      <main
        class="page-enter page-enter--2 min-h-0 flex-1 grid grid-cols-1 gap-12 overflow-hidden p-12 lg:grid-cols-[260px_minmax(0,1fr)] sm:p-16"
      >
        <aside
          class="min-h-0 flex flex-col overflow-hidden rounded-8 b-1-regular bg-container"
        >
          <div class="flex-none px-12 pb-8 pt-10">
            <div class="flex items-center gap-8">
              <h2 class="m-0 text-sm text-main font-700">分组列表</h2>
              <span
                class="rounded-999 bg-secondary px-7 py-1 text-11px text-secondary"
              >
                {{ filteredCategories.length }}
              </span>
            </div>
            <a-input
              v-model:value="categoryKeyword"
              allow-clear
              class="mt-8"
              placeholder="搜索分组名称"
            >
              <template #prefix>
                <Icon name="i-lucide:search" :size="14" class="text-muted" />
              </template>
            </a-input>
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto px-8 pb-10">
            <a-spin :spinning="categoryLoading">
              <div
                v-if="!categoryLoading && filteredCategories.length === 0"
                class="py-40 text-center text-xs text-secondary"
              >
                没有匹配的分组
              </div>
              <Motion
                v-for="category in filteredCategories"
                :key="category.id"
                as="button"
                type="button"
                class="group mb-6 w-full flex items-center gap-8 rounded-7 b-1-transparent px-10 py-9 text-left transition-colors"
                :class="
                  category.id === selectedCategoryId
                    ? 'border-primary/20 bg-primary/8 text-primary'
                    : 'text-main hover:bg-hover'
                "
                :while-hover="{ x: 2 }"
                :while-press="{ scale: 0.985 }"
                :transition="categorySpring"
                @click="selectCategory(category.id)"
              >
                <span
                  class="size-28 flex flex-none items-center justify-center rounded-6"
                  :style="{
                    backgroundColor: `${category.color || '#1677ff'}1f`,
                    color: category.color || '#1677ff',
                  }"
                >
                  <Icon :name="category.icon || 'i-lucide:folder'" :size="15" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-xs font-600">
                    {{ category.name }}
                  </span>
                  <span class="mt-1 block truncate text-11px text-tertiary">
                    {{ category.definitionCount }} 个流程
                  </span>
                </span>
                <a-dropdown
                  :menu="{ items: categoryActionItems() }"
                  :trigger="['click']"
                  @menu-click="
                    (info: { key: string | number }) =>
                      handleCategoryAction(String(info.key), category)
                  "
                >
                  <span
                    class="size-22 flex items-center justify-center rounded-4 text-secondary opacity-0 transition-[opacity,background-color,color] group-hover:opacity-100 hover:(bg-container text-main)"
                    @click.stop
                  >
                    <Icon name="i-lucide:more-horizontal" :size="14" />
                  </span>
                </a-dropdown>
              </Motion>
            </a-spin>
          </div>
        </aside>

        <section class="min-h-0 flex flex-col overflow-hidden">
          <div class="min-h-0 flex-1 overflow-y-auto p-4">
            <div
              v-if="loading"
              class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            >
              <div
                v-for="index in 8"
                :key="index"
                class="h-252 rounded-8 b-1-regular bg-container p-14"
              >
                <a-skeleton active :paragraph="{ rows: 5 }" />
              </div>
            </div>

            <a-empty
              v-else-if="list.length === 0"
              class="py-72"
              description="该分组下还没有审批流程"
            />

            <div
              v-else
              class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
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
          </div>

          <footer v-if="total > 0" class="flex flex-none justify-center pt-12">
            <a-pagination
              :current="current"
              :page-size="pageSize"
              :total="total"
              show-size-changer
              @change="onPageChange"
            />
          </footer>
        </section>
      </main>

      <a-modal
        v-model:open="formOpen"
        :confirm-loading="submitting"
        :title="editingCategory ? '编辑分组' : '新建分组'"
        ok-text="保存"
        cancel-text="取消"
        destroy-on-hidden
        @ok="submitCategory"
      >
        <a-form layout="vertical" class="pt-8">
          <a-form-item label="分组名称" required>
            <a-input
              v-model:value="form.name"
              :maxlength="20"
              placeholder="请输入分组名称"
            />
          </a-form-item>
          <a-form-item label="分组描述">
            <a-textarea
              v-model:value="form.description"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :maxlength="80"
              placeholder="请输入分组描述"
            />
          </a-form-item>
          <a-form-item label="主题色">
            <a-input v-model:value="form.color" placeholder="#1677ff" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </WView>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import { Motion } from 'motion-v'
import { Icon } from '@/components'
import { useTabs } from '@/hooks'
import { ApprovalCard } from '../components'
import { useApprovalCategories } from './hooks'
import type { ApprovalCategoryResp, ApprovalDefinitionResp } from '@/apis'

const { openRouteTab } = useTabs()

const {
  categories,
  categoryLoading,
  current,
  list,
  loading,
  pageSize,
  selectedCategoryId,
  total,
  createCategory,
  duplicateDefinition,
  onPageChange,
  removeCategory,
  removeDefinition,
  selectCategory,
  updateCategory,
} = useApprovalCategories()

/** 侧边栏分组项悬停/按下的弹簧动画 */
const categorySpring = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 30,
}

const formOpen = shallowRef(false)
const submitting = shallowRef(false)
const categoryKeyword = shallowRef('')

/** 侧边栏按名称/编码/描述过滤分组 */
const filteredCategories = computed(() => {
  const keyword = categoryKeyword.value.trim().toLowerCase()
  if (!keyword) return categories.value

  return categories.value.filter((item) =>
    [item.name, item.code, item.description]
      .filter(Boolean)
      .some((text) => text!.toLowerCase().includes(keyword))
  )
})
const editingCategory = shallowRef<ApprovalCategoryResp>()
const form = reactive({
  name: '',
  description: '',
  color: '#1677ff',
})

function openCreate() {
  editingCategory.value = undefined
  form.name = ''
  form.description = ''
  form.color = '#1677ff'
  formOpen.value = true
}

function openEdit(category: ApprovalCategoryResp) {
  editingCategory.value = category
  form.name = category.name
  form.description = category.description ?? ''
  form.color = category.color ?? '#1677ff'
  formOpen.value = true
}

function categoryActionItems() {
  return [
    { key: 'edit', label: '编辑分组' },
    { key: 'remove', label: '删除分组', danger: true },
  ]
}

function handleCategoryAction(key: string, category: ApprovalCategoryResp) {
  if (key === 'edit') {
    openEdit(category)
    return
  }
  if (key === 'remove') {
    removeCategory(category)
  }
}

async function submitCategory() {
  const name = form.name.trim()
  if (!name) {
    message.warning('请输入分组名称')
    return
  }

  submitting.value = true
  try {
    if (editingCategory.value) {
      await updateCategory({
        id: editingCategory.value.id,
        name,
        description: form.description.trim(),
        color: form.color,
      })
    } else {
      await createCategory({
        name,
        description: form.description.trim(),
        color: form.color,
      })
    }
    formOpen.value = false
  } finally {
    submitting.value = false
  }
}

function openDesigner(definition: ApprovalDefinitionResp) {
  openRouteTab({
    path: '/template/approval/designer',
    title: definition.name,
    icon: definition.icon || 'i-lucide:workflow',
    query: { id: definition.id },
  })
}
</script>
