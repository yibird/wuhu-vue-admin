<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <header
        class="flex flex-none flex-wrap items-center gap-12 border-b-1 border-color-2 border-b-solid bg-container px-14 py-10"
      >
        <a-button type="text" title="返回我的审批" @click="goBack">
          <template #icon><Icon name="i-lucide:arrow-left" /></template>
        </a-button>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-8">
            <h1 class="m-0 truncate text-base text-main font-700">
              {{ schema.settings.name || '新建审批流' }}
            </h1>
            <a-tag
              :color="
                schema.settings.state === 'published' ? 'success' : 'default'
              "
            >
              {{ schema.settings.state === 'published' ? '已发布' : '草稿' }}
            </a-tag>
          </div>
          <p class="m-0 mt-2 text-xs text-secondary">
            基础信息、表单设计、流程设计和扩展配置会随审批流一起保存
          </p>
        </div>
        <a-button @click="schemaOpen = true">
          <template #icon><Icon name="i-lucide:braces" /></template>
          Schema
        </a-button>
        <a-button :loading="saveBusy" @click="handleSave">
          <template #icon><Icon name="i-lucide:save" /></template>
          保存草稿
        </a-button>
        <a-button type="primary" :loading="publishBusy" @click="handlePublish">
          <template #icon><Icon name="i-lucide:rocket" /></template>
          发布
        </a-button>
      </header>

      <div
        class="flex-none border-b-1 border-color-2 border-b-solid bg-container px-14 py-10"
      >
        <a-steps
          :current="step"
          :items="stepItems"
          class="mx-auto max-w-900"
          size="small"
        />
      </div>

      <main
        class="min-h-0 flex-1 p-12 sm:p-16"
        :class="step === 2 ? 'overflow-hidden' : 'overflow-y-auto'"
      >
        <a-spin :spinning="loading" class="h-full min-h-0">
          <BasicInfoStep
            v-show="step === 0"
            :schema="schema"
            :category-id="categoryId"
            :categories="categories"
            @update:schema="applySchema"
            @update:category-id="categoryId = $event"
          />

          <FormDesignStep
            v-show="step === 1"
            :schema="schema"
            @update:schema="applySchema"
          />

          <FlowDesignStep
            v-show="step === 2"
            :schema="schema"
            :templates="templates"
            :users="users"
            @update:schema="applySchema"
          />

          <ExtensionStep
            v-show="step === 3"
            :schema="schema"
            :users="users"
            @update:schema="applySchema"
          />
        </a-spin>
      </main>

      <footer
        class="flex flex-none items-center justify-end gap-10 border-t-1 border-color-2 border-t-solid bg-container px-14 py-10"
      >
        <div class="flex items-center gap-8">
          <a-button :disabled="step === 0" @click="goPrev">上一步</a-button>
          <a-button
            v-if="step < stepItems.length - 1"
            type="primary"
            @click="goNext"
          >
            下一步
          </a-button>
          <a-button
            v-else
            type="primary"
            :loading="publishBusy"
            @click="handlePublish"
          >
            发布审批流
          </a-button>
        </div>
      </footer>

      <SchemaModal v-model:open="schemaOpen" :schema="schema" />
    </div>
  </WView>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@/components'
import {
  collectNodes,
  createDefaultApprovalExtensions,
  createEmptyApprovalSchema,
  validateApprovalWorkflow,
} from '@/components'
import type { ApprovalUserRef, ApprovalWorkflowSchema } from '@/components'
import {
  createApprovalDefinitionApi,
  getApprovalCategoryListApi,
  getApprovalDefinitionRecordApi,
  getDeptPageListApi,
  getUserPageListApi,
  publishApprovalDefinitionApi,
  updateApprovalDefinitionApi,
} from '@/apis'
import { useRequest } from '@/hooks'
import { useAuthStore, tabsStore } from '@/store'
import {
  BasicInfoStep,
  ExtensionStep,
  FlowDesignStep,
  FormDesignStep,
  SchemaModal,
} from './components'
import { approvalDesignerTemplates } from './data'
import type { ApprovalDefinitionResp } from '@/apis'

const route = useRoute()
const router = useRouter()
const { user } = useAuthStore()
const { tabs, activeKey } = storeToRefs(tabsStore())

const step = shallowRef(0)
const definition = shallowRef<ApprovalDefinitionResp>()
const schema = shallowRef<ApprovalWorkflowSchema>(createEmptyApprovalSchema())
const editingId = shallowRef<string>()
const categoryId = shallowRef<string>()
const loading = shallowRef(false)
const saveBusy = shallowRef(false)
const publishBusy = shallowRef(false)
const schemaOpen = shallowRef(false)
const templates = approvalDesignerTemplates

const stepItems = [
  { title: '基础信息', content: '名称与分组' },
  { title: '表单设计', content: '业务字段' },
  { title: '流程设计', content: '节点与规则' },
  { title: '扩展设计', content: '权限与自动化' },
]

const definitionId = computed(() => {
  const id = route.query.id
  return typeof id === 'string' ? id : ''
})
const isCreate = computed(
  () => !definitionId.value || route.query.mode === 'create'
)

const { data: userData } = useRequest(() =>
  getUserPageListApi({ current: 1, pageSize: 300 })
)
const { data: categoryData } = useRequest(() => getApprovalCategoryListApi())
const { data: deptData } = useRequest(() =>
  getDeptPageListApi({ current: 1, pageSize: 500, type: 1 })
)

const deptNameMap = computed(
  () =>
    new Map(
      (deptData.value?.data?.list ?? []).map((item) => [item.id, item.name])
    )
)

const users = computed<ApprovalUserRef[]>(() =>
  (userData.value?.data?.list ?? [])
    .filter((item) => !item.deleted)
    .map((item) => ({
      id: item.id,
      name: item.realname || item.nickname || item.username,
      dept: deptNameMap.value.get(item.deptId ?? '') ?? '总部',
    }))
)

const categories = computed(() => categoryData.value?.data ?? [])

const basicErrors = computed(() => {
  const errors: string[] = []
  if (!schema.value.settings.name.trim()) errors.push('请输入审批流名称')
  if (!categoryId.value) errors.push('请选择流程分组')
  return errors
})

const formErrors = computed(() => {
  const errors: string[] = []
  const fields = schema.value.formFields
  if (fields.length === 0) errors.push('请至少添加一个表单字段')
  if (fields.some((field) => !field.label.trim())) {
    errors.push('存在未命名的表单字段')
  }
  const keys = fields.map((field) => field.key.trim())
  if (keys.some((key) => !key)) errors.push('存在未设置标识的表单字段')
  if (new Set(keys).size !== keys.length) errors.push('表单字段标识不能重复')
  return errors
})

const flowValidation = computed(() =>
  validateApprovalWorkflow(schema.value, collectNodes(schema.value.nodes))
)

const flowErrors = computed(() =>
  flowValidation.value.issues.filter((issue) => issue.level === 'error')
)

watch(
  categories,
  (value) => {
    if (!categoryId.value && value.length) {
      categoryId.value = value[0].id
    }
  },
  { immediate: true }
)

/** 选中的分组变化后同步到 schema.settings.group(画布页脚展示用) */
watch(
  [categories, categoryId],
  ([value, currentId]) => {
    const category = value.find((item) => item.id === currentId)
    if (!category || schema.value.settings.group === category.name) return

    applySchema({
      ...schema.value,
      settings: { ...schema.value.settings, group: category.name },
    })
  },
  { immediate: true }
)

function applySchema(next: ApprovalWorkflowSchema) {
  schema.value = {
    ...next,
    extensions: next.extensions ?? createDefaultApprovalExtensions(),
  }
}

async function loadDefinition() {
  if (isCreate.value) {
    editingId.value = undefined
    definition.value = undefined
    const empty = createEmptyApprovalSchema()
    schema.value = {
      ...empty,
      settings: {
        ...empty.settings,
        group: categories.value[0]?.name ?? '默认分组',
      },
    }
    return
  }

  loading.value = true
  try {
    const response = await getApprovalDefinitionRecordApi({
      id: definitionId.value,
    })
    definition.value = response.data
    editingId.value = response.data.id
    categoryId.value = response.data.categoryId
    applySchema(structuredClone(response.data.schema) as ApprovalWorkflowSchema)
  } catch {
    message.error('审批流加载失败')
  } finally {
    loading.value = false
  }
}

function validateStep(index: number) {
  const errors =
    index === 0
      ? basicErrors.value
      : index === 1
        ? formErrors.value
        : index === 2
          ? flowErrors.value.map((issue) => issue.title)
          : []
  if (errors.length) {
    message.error(errors[0])
    return false
  }
  return true
}

function goNext() {
  if (!validateStep(step.value)) return
  step.value = Math.min(stepItems.length - 1, step.value + 1)
}

function goPrev() {
  step.value = Math.max(0, step.value - 1)
}

function goBack() {
  router.push('/template/approval/my')
}

function updateTabTitle(title: string) {
  const tab = tabs.value.find((item) => item.key === activeKey?.value)
  if (tab) tab.title = title
}

async function persist(next: ApprovalWorkflowSchema) {
  const currentCategoryId =
    categoryId.value ?? definition.value?.categoryId ?? categories.value[0]?.id
  if (!currentCategoryId) {
    throw new Error('请先在「流程分组」中创建分组')
  }
  const currentCategory = categories.value.find(
    (item) => item.id === currentCategoryId
  )
  const payload = {
    name: next.settings.name.trim() || '未命名审批流',
    categoryId: currentCategoryId,
    icon: definition.value?.icon || 'i-lucide:workflow',
    description: next.settings.description,
    schema: {
      ...next,
      settings: {
        ...next.settings,
        group: currentCategory?.name ?? next.settings.group,
      },
    },
    ownerId: user.value?.id ?? '1',
    ownerName: user.value?.name ?? '管理员',
  }

  if (editingId.value) {
    await updateApprovalDefinitionApi({ id: editingId.value, ...payload })
    return { id: editingId.value, settings: payload.schema.settings }
  }

  const response = await createApprovalDefinitionApi<string>(payload)
  editingId.value = response.data
  return { id: response.data, settings: payload.schema.settings }
}

function applyPersisted(
  result: { id: string; settings: ApprovalWorkflowSchema['settings'] },
  state = schema.value.settings.state
) {
  applySchema({
    ...schema.value,
    settings: {
      ...result.settings,
      id: result.id,
      state,
    },
  })
  updateTabTitle(result.settings.name)
}

async function handleSave() {
  if (basicErrors.value.length) {
    step.value = 0
    message.error(basicErrors.value[0])
    return
  }
  if (saveBusy.value) return

  saveBusy.value = true
  try {
    const result = await persist(schema.value)
    applyPersisted(result)
    message.success('审批流已保存')
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : '保存失败，请稍后重试'
    )
  } finally {
    saveBusy.value = false
  }
}

async function handlePublish() {
  const firstInvalidStep = basicErrors.value.length
    ? 0
    : formErrors.value.length
      ? 1
      : flowErrors.value.length
        ? 2
        : -1
  if (firstInvalidStep !== -1) {
    step.value = firstInvalidStep
    message.error(
      firstInvalidStep === 2
        ? (flowErrors.value[0]?.title ?? '流程设计存在阻塞问题')
        : firstInvalidStep === 1
          ? formErrors.value[0]
          : basicErrors.value[0]
    )
    return
  }
  if (publishBusy.value) return

  publishBusy.value = true
  try {
    const result = await persist(schema.value)
    await publishApprovalDefinitionApi(result.id)
    applyPersisted(result, 'published')
    message.success('审批流已发布')
  } catch (error) {
    message.error(
      error instanceof Error ? error.message : '发布失败，请稍后重试'
    )
  } finally {
    publishBusy.value = false
  }
}

onMounted(() => void loadDefinition())
watch(definitionId, () => void loadDefinition())
</script>

<style scoped>
:deep(.ant-spin-container) {
  height: 100%;
}
</style>
