<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import type {
  CalendarEventFormState,
  CalendarEventPriority,
  CalendarEventStatus,
  CalendarMetaOption,
  CalendarSelectOption,
} from '../types'

const props = defineProps<{
  calendarOptions: CalendarSelectOption[]
  ownerOptions: CalendarSelectOption[]
  priorityOptions: CalendarMetaOption<CalendarEventPriority>[]
  statusOptions: CalendarMetaOption<CalendarEventStatus>[]
  timeOptions: CalendarSelectOption[]
}>()

const model = defineModel<CalendarEventFormState>({ required: true })
const formRef = shallowRef<FormInstance>()

function validateEndTime() {
  if (model.value.allDay || model.value.startTime < model.value.endTime) {
    return Promise.resolve()
  }

  return Promise.reject(new Error('结束时间需晚于开始时间'))
}

const rules = {
  title: [
    { required: true, message: '请输入日程标题', trigger: 'blur' },
    { min: 2, message: '日程标题至少 2 个字符', trigger: 'blur' },
  ],
  calendarId: [
    { required: true, message: '请选择日历分类', trigger: 'change' },
  ],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ validator: validateEndTime, trigger: 'change' }],
  owner: [{ required: true, message: '请选择负责人', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

async function validate() {
  await formRef.value?.validate()
}

function clearValidate() {
  formRef.value?.clearValidate()
}

defineExpose({ clearValidate, validate })
</script>

<template>
  <a-form
    ref="formRef"
    :model="model"
    :rules="rules"
    class="calendar-event-form"
    layout="vertical"
  >
    <section
      class="mb-14 rounded-8 border-1 border-color-2 border-solid bg-page p-12"
    >
      <div class="flex items-center gap-8 text-sm text-main font-700">
        <Icon name="i-lucide:calendar-plus" :size="16" />
        基础信息
      </div>
      <div class="mt-4 text-xs text-secondary">
        标题、分类和时间会同步到中间的日历看板。
      </div>
    </section>

    <a-form-item label="日程标题" name="title">
      <a-input
        v-model:value="model.title"
        allow-clear
        :maxlength="40"
        placeholder="例如：客户复盘会"
        show-count
      />
    </a-form-item>

    <a-form-item label="日程说明" name="description">
      <a-textarea
        v-model:value="model.description"
        :auto-size="{ minRows: 3, maxRows: 5 }"
        :maxlength="180"
        placeholder="补充会议目标、准备事项或验收标准"
        show-count
      />
    </a-form-item>

    <div class="grid grid-cols-1 gap-x-12 md:grid-cols-2">
      <a-form-item label="日历分类" name="calendarId">
        <a-select
          v-model:value="model.calendarId"
          class="w-full"
          :options="props.calendarOptions"
          placeholder="请选择分类"
        />
      </a-form-item>

      <a-form-item label="负责人" name="owner">
        <a-select
          v-model:value="model.owner"
          class="w-full"
          :options="props.ownerOptions"
          placeholder="请选择负责人"
        />
      </a-form-item>

      <a-form-item label="日期" name="date">
        <a-date-picker
          v-model:value="model.date"
          class="w-full"
          format="YYYY-MM-DD"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
        />
      </a-form-item>

      <a-form-item label="地点" name="location">
        <a-input
          v-model:value="model.location"
          allow-clear
          placeholder="例如：会议室 A / 飞书"
        />
      </a-form-item>
    </div>

    <div
      class="mb-10 rounded-8 border-1 border-color-2 border-solid bg-page p-12"
    >
      <div class="mb-12 flex items-center justify-between gap-10">
        <div>
          <div class="text-sm text-main font-700">时间设置</div>
          <div class="mt-2 text-xs text-secondary">
            全天日程会隐藏时间段配置。
          </div>
        </div>
        <a-switch
          v-model:checked="model.allDay"
          checked-children="全天"
          un-checked-children="定时"
        />
      </div>

      <div
        v-show="!model.allDay"
        class="grid grid-cols-1 gap-12 md:grid-cols-2"
      >
        <a-form-item class="!mb-0" label="开始时间" name="startTime">
          <a-select
            v-model:value="model.startTime"
            class="w-full"
            :options="props.timeOptions"
            placeholder="开始时间"
          />
        </a-form-item>
        <a-form-item class="!mb-0" label="结束时间" name="endTime">
          <a-select
            v-model:value="model.endTime"
            class="w-full"
            :options="props.timeOptions"
            placeholder="结束时间"
          />
        </a-form-item>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-x-12 md:grid-cols-2">
      <a-form-item label="状态" name="status">
        <a-select
          v-model:value="model.status"
          class="w-full"
          :options="props.statusOptions"
          placeholder="请选择状态"
        />
      </a-form-item>

      <a-form-item label="优先级" name="priority">
        <a-select
          v-model:value="model.priority"
          class="w-full"
          :options="props.priorityOptions"
          placeholder="请选择优先级"
        />
      </a-form-item>
    </div>
  </a-form>
</template>
