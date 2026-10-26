<template>
  <ApprovalDesigner
    v-model="schema"
    :publish-busy="publishBusy"
    :save-busy="saveBusy"
    :templates="approvalTemplates"
    :users="approvalUsers"
    @publish="handlePublish"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import { ApprovalDesigner } from '@/components/approval-designer'
import { approvalTemplates, approvalUsers, initialApprovalSchema } from './data'
import type { ApprovalWorkflowSchema } from '@/components/approval-designer'

const schema = shallowRef<ApprovalWorkflowSchema>(
  structuredClone(initialApprovalSchema)
)
const saveBusy = shallowRef(false)
const publishBusy = shallowRef(false)

function handleSave(next: ApprovalWorkflowSchema) {
  saveBusy.value = true
  schema.value = next
  window.setTimeout(() => {
    saveBusy.value = false
    message.success('审批流已保存')
  }, 200)
}

function handlePublish(next: ApprovalWorkflowSchema) {
  publishBusy.value = true
  schema.value = {
    ...next,
    settings: {
      ...next.settings,
      state: 'published',
    },
  }
  window.setTimeout(() => {
    publishBusy.value = false
    message.success('审批流已发布')
  }, 200)
}
</script>
