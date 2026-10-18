<template>
  <a-modal
    v-model:open="open"
    destroy-on-hidden
    :footer="null"
    :width="900"
    title="Schema 数据"
  >
    <div class="grid gap-10">
      <div class="flex flex-wrap items-center justify-between gap-8">
        <span class="text-xs text-secondary">
          表单与流程 Schema 可分别获取，便于后续持久化到数据库
        </span>
        <div class="flex items-center gap-8">
          <a-button @click="copyCurrent">
            <template #icon><Icon name="i-lucide:copy" /></template>
            复制
          </a-button>
          <a-button type="primary" @click="downloadCurrent">
            <template #icon><Icon name="i-lucide:download" /></template>
            下载 JSON
          </a-button>
        </div>
      </div>

      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="form" tab="表单 Schema">
          <div
            class="h-460 overflow-hidden rounded-8 border-1 border-color-2 border-solid"
          >
            <CodeEditor
              :model-value="formSchemaText"
              language="json"
              readonly
            />
          </div>
        </a-tab-pane>
        <a-tab-pane key="workflow" tab="流程 Schema">
          <div
            class="h-460 overflow-hidden rounded-8 border-1 border-color-2 border-solid"
          >
            <CodeEditor
              :model-value="workflowSchemaText"
              language="json"
              readonly
            />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import { CodeEditor, Icon } from '@/components'
import type { ApprovalWorkflowSchema } from '@/components'

const props = defineProps<{
  /**
   * @desc 当前审批流完整 Schema
   */
  schema: ApprovalWorkflowSchema
}>()

const open = defineModel<boolean>('open', { required: true })

const activeTab = shallowRef<'form' | 'workflow'>('form')

const formSchema = computed(() => ({
  $schema: 'https://wuhu.dev/schemas/approval-form/v1.json',
  version: props.schema.settings.version,
  formId: props.schema.settings.id,
  name: props.schema.settings.name,
  fields: props.schema.formFields,
}))

const workflowSchema = computed(() => ({
  $schema: 'https://wuhu.dev/schemas/approval-workflow/v1.json',
  version: props.schema.settings.version,
  workflowId: props.schema.settings.id,
  settings: props.schema.settings,
  nodes: props.schema.nodes,
  extensions: props.schema.extensions,
}))

const formSchemaText = computed(() => JSON.stringify(formSchema.value, null, 2))
const workflowSchemaText = computed(() =>
  JSON.stringify(workflowSchema.value, null, 2)
)

const currentSchema = computed(() =>
  activeTab.value === 'form' ? formSchema.value : workflowSchema.value
)
const currentSchemaText = computed(() =>
  activeTab.value === 'form' ? formSchemaText.value : workflowSchemaText.value
)
const currentFileName = computed(() =>
  activeTab.value === 'form'
    ? `${props.schema.settings.id || 'approval'}.form.schema.json`
    : `${props.schema.settings.id || 'approval'}.workflow.schema.json`
)

async function copyCurrent() {
  await navigator.clipboard.writeText(currentSchemaText.value)
  message.success(
    activeTab.value === 'form' ? '表单 Schema 已复制' : '流程 Schema 已复制'
  )
}

function downloadCurrent() {
  const blob = new Blob([JSON.stringify(currentSchema.value, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = currentFileName.value
  link.click()
  URL.revokeObjectURL(url)
}
</script>
