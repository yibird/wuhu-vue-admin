<script setup lang="ts">
import { ownerOptions, taskTypeOptions } from '../constants'
import type { TaskCenterFormState } from '../types'

const formState = defineModel<TaskCenterFormState>('formState', {
  required: true,
})

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [open: boolean]
  submit: []
}>()
</script>

<template>
  <a-modal
    :open="open"
    title="新建任务"
    ok-text="创建任务"
    cancel-text="取消"
    destroy-on-hidden
    :width="680"
    @ok="emit('submit')"
    @cancel="emit('update:open', false)"
    @update:open="emit('update:open', $event)"
  >
    <a-form :model="formState" :label-col="{ style: { width: '84px' } }">
      <a-form-item label="任务名称" required>
        <a-input
          v-model:value="formState.title"
          allow-clear
          :maxlength="48"
          placeholder="例如：导出本周用户增长报表"
          show-count
        />
      </a-form-item>
      <a-form-item label="任务描述" required>
        <a-textarea
          v-model:value="formState.description"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          :maxlength="180"
          placeholder="说明任务目标、范围和产物要求"
          show-count
        />
      </a-form-item>
      <div class="grid grid-cols-2 gap-x-10 max-sm:grid-cols-1">
        <a-form-item label="任务类型" required>
          <a-select v-model:value="formState.type" :options="taskTypeOptions" />
        </a-form-item>
        <a-form-item label="负责人" required>
          <a-select v-model:value="formState.owner" :options="ownerOptions" />
        </a-form-item>
      </div>
      <a-form-item label="来源" required>
        <a-input
          v-model:value="formState.source"
          allow-clear
          placeholder="例如：订单中心 / 2026-06"
        />
      </a-form-item>
      <a-form-item label="目标" required>
        <a-input
          v-model:value="formState.target"
          allow-clear
          placeholder="例如：任务中心 / exports/report.xlsx"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
