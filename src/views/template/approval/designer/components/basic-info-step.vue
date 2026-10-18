<template>
  <section class="mx-auto w-full max-w-760">
    <div
      class="rounded-10 border-1 border-color-2 border-solid bg-container p-20"
    >
      <header class="mb-20">
        <h2 class="m-0 text-lg text-main font-700">基础信息</h2>
        <p class="m-0 mt-6 text-sm text-secondary">
          填写审批流名称、所属分组和用途说明，后续步骤会基于这些信息生成流程。
        </p>
      </header>

      <a-form layout="vertical">
        <a-form-item label="审批流名称" required>
          <a-input
            v-model:value="name"
            :maxlength="30"
            placeholder="例如：费用报销审批"
            show-count
          />
        </a-form-item>

        <a-form-item label="所属分组" required>
          <a-select
            v-model:value="groupId"
            :options="groupOptions"
            placeholder="请选择流程分组"
          />
        </a-form-item>

        <a-form-item label="版本号">
          <a-input
            v-model:value="version"
            :maxlength="16"
            placeholder="1.0.0"
          />
        </a-form-item>

        <a-form-item label="流程说明">
          <a-textarea
            v-model:value="description"
            :auto-size="{ minRows: 4, maxRows: 8 }"
            :maxlength="200"
            placeholder="说明该审批流的适用场景、发起条件等"
            show-count
          />
        </a-form-item>
      </a-form>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ApprovalGroupResp } from '@/apis'
import type { ApprovalWorkflowSchema } from '@/components'

const props = defineProps<{
  schema: ApprovalWorkflowSchema
  groups: readonly ApprovalGroupResp[]
  groupId?: string
}>()

const emits = defineEmits<{
  'update:schema': [schema: ApprovalWorkflowSchema]
  'update:groupId': [id: string | undefined]
}>()

const name = computed({
  get: () => props.schema.settings.name,
  set: (value: string) => patchSettings({ name: value }),
})
const version = computed({
  get: () => props.schema.settings.version,
  set: (value: string) => patchSettings({ version: value }),
})
const description = computed({
  get: () => props.schema.settings.description,
  set: (value: string) => patchSettings({ description: value }),
})
const groupId = computed({
  get: () => props.groupId,
  set: (value: string | undefined) => {
    emits('update:groupId', value)
    const group = props.groups.find((item) => item.id === value)
    if (group) patchSettings({ group: group.name })
  },
})

const groupOptions = computed(() =>
  props.groups.map((group) => ({
    label: group.name,
    value: group.id,
  }))
)

function patchSettings(patch: Partial<ApprovalWorkflowSchema['settings']>) {
  emits('update:schema', {
    ...props.schema,
    settings: {
      ...props.schema.settings,
      ...patch,
    },
  })
}
</script>
