<template>
  <a-form
    ref="formRef"
    :label-col="{ style: { width: '82px' } }"
    :model="model"
    :rules="rules"
    class="pt-8"
  >
    <div
      class="mb-14 rounded-6 border-1 border-color-2 border-solid bg-container-secondary p-12"
    >
      <div class="flex items-center gap-8 text-sm text-main font-600">
        <Icon name="i-lucide:clipboard-list" :size="16" />
        基础信息
      </div>
      <div class="mt-4 text-xs text-secondary">
        补充清晰的任务目标，便于负责人判断优先级和交付范围。
      </div>
    </div>

    <a-form-item label="任务名称" name="title">
      <a-input
        v-model:value="model.title"
        allow-clear
        :maxlength="40"
        placeholder="例如：完成任务看板跨分组拖拽"
        show-count
      />
    </a-form-item>

    <a-form-item label="任务描述" name="description">
      <a-textarea
        v-model:value="model.description"
        :auto-size="{ minRows: 4, maxRows: 6 }"
        :maxlength="200"
        placeholder="描述任务背景、验收标准或关键注意事项"
        show-count
      />
    </a-form-item>

    <div class="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
      <a-form-item label="负责人" name="assignee">
        <UserPicker
          v-model:value="model.assignee"
          :options="taskAssigneeSelectOptions"
          placeholder="请选择负责人"
        />
      </a-form-item>

      <a-form-item label="开始时间" name="startDate">
        <a-date-picker
          v-model:value="model.startDate"
          allow-clear
          class="w-full"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择开始时间"
          show-time
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </a-form-item>

      <a-form-item label="截止时间" name="dueDate">
        <a-date-picker
          v-model:value="model.dueDate"
          allow-clear
          class="w-full"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择截止时间"
          show-time
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        <div class="mt-8 flex flex-wrap gap-6">
          <button
            v-for="item in dueDateQuickOptions"
            :key="item.value"
            class="h-24 rounded-4 border-1 border-color-2 border-solid bg-container px-8 text-xs text-secondary transition-colors hover:(border-color-primary text-primary)"
            type="button"
            @click="setDueDate(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </a-form-item>

      <a-form-item label="优先级" name="priority">
        <a-segmented
          v-model:value="model.priority"
          block
          :options="taskPrioritySegmentOptions"
        >
          <template #labelRender="{ value }">
            <span class="inline-flex items-center justify-center gap-4">
              <Icon :name="priorityMeta(value).icon" :size="13" />
              {{ priorityMeta(value).label }}
            </span>
          </template>
        </a-segmented>
      </a-form-item>

      <a-form-item label="任务状态" name="status">
        <a-select
          v-model:value="model.status"
          class="w-full"
          :options="taskStatusSelectOptions"
          placeholder="请选择任务状态"
        />
      </a-form-item>

      <a-form-item label="所属模块" name="module">
        <a-select
          v-model:value="model.module"
          allow-clear
          class="w-full"
          :options="taskModuleOptions"
          placeholder="请选择所属模块"
        />
      </a-form-item>

      <a-form-item label="预估工时" name="estimatedHours">
        <a-input-number
          v-model:value="model.estimatedHours"
          class="w-full"
          :max="999"
          :min="0.5"
          placeholder="例如：6.5"
          :precision="1"
          :step="0.5"
        >
          <template #addonAfter>小时</template>
        </a-input-number>
      </a-form-item>

      <a-form-item class="sm:col-span-2" label="任务标签" name="tags">
        <a-select
          v-model:value="model.tags"
          allow-clear
          class="w-full"
          mode="tags"
          :options="taskTagOptions"
          placeholder="输入或选择标签"
          :token-separators="[',', '，', ' ']"
        />
      </a-form-item>
    </div>

    <a-form-item label="验收标准" name="acceptanceCriteria">
      <a-textarea
        v-model:value="model.acceptanceCriteria"
        :auto-size="{ minRows: 3, maxRows: 5 }"
        :maxlength="300"
        placeholder="补充交付物、验收口径、验证方式或风险说明"
        show-count
      />
    </a-form-item>

    <div
      class="mt-4 flex flex-wrap items-center gap-8 rounded-6 border-1 border-color-2 border-solid bg-main px-12 py-10 text-xs text-secondary"
    >
      <span class="inline-flex items-center gap-4">
        <Icon name="i-lucide:user-round" :size="13" />
        {{ selectedAssignee.label }}
      </span>
      <span class="inline-flex items-center gap-4">
        <Icon :name="selectedPriority.icon" :size="13" />
        {{ selectedPriority.label }}优先级
      </span>
      <span class="inline-flex items-center gap-4" :class="selectedDue.class">
        <Icon :name="selectedDue.icon" :size="13" />
        {{ selectedDue.fullText }}
      </span>
      <span v-if="model.module" class="inline-flex items-center gap-4">
        <Icon name="i-lucide:box" :size="13" />
        {{ model.module }}
      </span>
      <span v-if="model.estimatedHours" class="inline-flex items-center gap-4">
        <Icon name="i-lucide:timer" :size="13" />
        {{ model.estimatedHours }} 小时
      </span>
      <span
        v-if="model.tags.length"
        class="min-w-0 inline-flex items-center gap-4"
      >
        <Icon name="i-lucide:tags" :size="13" />
        <span class="truncate">{{ model.tags.join('、') }}</span>
      </span>
    </div>
  </a-form>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { FormInstance } from 'antdv-next'
import { UserPicker } from '@/features/UserPicker'
import type { TaskFormState, TaskPriorityValue } from './types'
import {
  getTaskAssigneeMeta,
  getTaskDueMeta,
  getTaskPriorityMeta,
  taskDateTimeFormat,
  taskAssigneeSelectOptions,
  taskPriorityList,
  taskStatusSelectOptions,
} from '../constants'

const model = defineModel<TaskFormState>({ required: true })
const formRef = shallowRef<FormInstance>()

const today = dayjs()
const thisFriday = today.day() <= 5 ? today.day(5) : today.add(1, 'week').day(5)
const defaultDeadlineHour = 18
const dueDateQuickOptions = [
  { label: '今天 18:00', value: formatDeadline(today) },
  { label: '明天 18:00', value: formatDeadline(today.add(1, 'day')) },
  { label: '本周五 18:00', value: formatDeadline(thisFriday) },
  {
    label: '下周一 18:00',
    value: formatDeadline(today.add(1, 'week').day(1)),
  },
]

const taskModuleOptions = [
  { label: '工作台', value: '工作台' },
  { label: '任务看板', value: '任务看板' },
  { label: '数据看板', value: '数据看板' },
  { label: '低代码', value: '低代码' },
  { label: '图表主题', value: '图表主题' },
  { label: '基础能力', value: '基础能力' },
]

const taskTagOptions = [
  { label: '需求', value: '需求' },
  { label: '设计', value: '设计' },
  { label: '研发', value: '研发' },
  { label: '测试', value: '测试' },
  { label: '缺陷', value: '缺陷' },
  { label: '体验优化', value: '体验优化' },
]

const taskPrioritySegmentOptions = taskPriorityList.map((item) => ({
  label: item.label,
  value: item.value,
}))

const rules = {
  title: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 2, message: '任务名称至少 2 个字符', trigger: 'blur' },
  ],
  description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
  assignee: [{ required: true, message: '请选择负责人', trigger: 'change' }],
  dueDate: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  status: [{ required: true, message: '请选择任务状态', trigger: 'change' }],
}

const selectedAssignee = computed(() =>
  getTaskAssigneeMeta(model.value.assignee)
)
const selectedPriority = computed(() =>
  getTaskPriorityMeta(model.value.priority)
)
const selectedDue = computed(() =>
  getTaskDueMeta(model.value.dueDate ?? '', model.value.status)
)

function setDueDate(value: string) {
  model.value.dueDate = value
}

function formatDeadline(value: Dayjs) {
  return value
    .hour(defaultDeadlineHour)
    .minute(0)
    .second(0)
    .format(taskDateTimeFormat)
}

function priorityMeta(value: unknown) {
  const priority = (
    value === 'urgent' || value === 'high' || value === 'low' ? value : 'medium'
  ) satisfies TaskPriorityValue

  return getTaskPriorityMeta(priority)
}

async function validate() {
  await formRef.value?.validate()
}

function clearValidate() {
  formRef.value?.clearValidate()
}

defineExpose({ clearValidate, validate })
</script>
