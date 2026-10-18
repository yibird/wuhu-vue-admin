<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <header
        class="page-enter page-enter--1 flex flex-none flex-wrap items-center gap-10 border-b-1 border-color-2 border-b-solid bg-container px-12 py-10 sm:px-16"
      >
        <span
          class="size-38 flex flex-none items-center justify-center rounded-8 bg-primary/12 text-primary"
        >
          <Icon name="i-lucide:layers" :size="19" />
        </span>
        <div class="min-w-0 flex-1">
          <h1 class="m-0 text-base text-main font-700">流程分类</h1>
          <p class="m-0 mt-2 text-xs text-secondary">
            按业务域管理审批流程，点击卡片进入设计器
          </p>
        </div>
        <a-button type="primary" @click="openCreate">
          <template #icon><Icon name="i-lucide:plus" /></template>
          新建分类
        </a-button>
      </header>

      <main
        class="page-enter page-enter--2 min-h-0 flex-1 grid grid-cols-1 gap-12 overflow-hidden p-12 lg:grid-cols-[260px_minmax(0,1fr)] sm:p-16"
      >
        <aside
          class="min-h-0 flex flex-col overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container"
        >
          <div class="flex-none flex items-center gap-8 px-12 py-10">
            <h2 class="m-0 text-sm text-main font-700">分类列表</h2>
            <span
              class="rounded-999 bg-fill-secondary px-7 py-1 text-11px text-secondary"
            >
              {{ categories.length }}
            </span>
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto px-8 pb-10">
            <a-spin :spinning="categoryLoading">
              <Motion
                v-for="category in categories"
                :key="category.id"
                as="button"
                type="button"
                class="group mb-6 w-full flex items-center gap-8 rounded-7 border-1 border-transparent border-solid px-10 py-9 text-left transition-colors"
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
                    class="size-22 flex items-center justify-center rounded-4 text-secondary opacity-0 transition-opacity group-hover:opacity-100"
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
          <div class="flex flex-none flex-wrap items-center gap-10 pb-10">
            <div class="min-w-0 flex-1">
              <h2 class="m-0 text-sm text-main font-700">
                {{ currentCategory?.name ?? '请选择分类' }}
              </h2>
              <p class="m-0 mt-2 truncate text-xs text-secondary">
                {{ currentCategory?.description || '选择一个分类查看审批流程' }}
              </p>
            </div>
            <span class="text-xs text-secondary">共 {{ total }} 个流程</span>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-4">
            <div
              v-if="loading"
              class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            >
              <div
                v-for="index in 8"
                :key="index"
                class="h-252 rounded-8 border-1 border-color-2 border-solid bg-container p-14"
              >
                <a-skeleton active :paragraph="{ rows: 5 }" />
              </div>
            </div>

            <a-empty
              v-else-if="list.length === 0"
              class="py-72"
              description="该分类下还没有审批流程"
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
        :title="editingCategory ? '编辑分类' : '新建分类'"
        ok-text="保存"
        cancel-text="取消"
        destroy-on-hidden
        @ok="submitCategory"
      >
        <a-form layout="vertical" class="pt-8">
          <a-form-item label="分类名称" required>
            <a-input
              v-model:value="form.name"
              :maxlength="20"
              placeholder="请输入分类名称"
            />
          </a-form-item>
          <a-form-item label="分类描述">
            <a-textarea
              v-model:value="form.description"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :maxlength="80"
              placeholder="请输入分类描述"
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
  currentCategory,
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

/** 侧边栏分类项悬停/按下的弹簧动画 */
const categorySpring = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 30,
}

const formOpen = shallowRef(false)
const submitting = shallowRef(false)
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
    { key: 'edit', label: '编辑分类' },
    { key: 'remove', label: '删除分类', danger: true },
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
    message.warning('请输入分类名称')
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
