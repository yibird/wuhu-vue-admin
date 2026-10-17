<template>
  <a-modal v-model:open="open" destroy-on-hidden :title="title" :width="640">
    <a-form
      ref="formRef"
      :label-col="{ flex: '84px' }"
      :model="form"
      :rules="rules"
      :wrapper-col="{ flex: '1 1 0' }"
    >
      <a-form-item v-if="!projectId" label="所属项目" name="projectId">
        <a-select
          v-model:value="form.projectId"
          :loading="projectOptionsLoading"
          :options="projectSelectOptions"
          option-filter-prop="label"
          placeholder="请选择项目"
          show-search
        />
      </a-form-item>
      <a-form-item label="任务标题" name="title">
        <a-input
          v-model:value="form.title"
          allow-clear
          :maxlength="60"
          placeholder="请输入任务标题"
        />
      </a-form-item>
      <div class="grid grid-cols-1 gap-x-16 sm:grid-cols-2">
        <a-form-item label="任务状态" name="status">
          <a-select
            v-model:value="form.status"
            :options="[...taskStatusOptions]"
            placeholder="请选择任务状态"
          />
        </a-form-item>
        <a-form-item label="优先级" name="priority">
          <a-select
            v-model:value="form.priority"
            :options="[...priorityOptions]"
            placeholder="请选择优先级"
          />
        </a-form-item>
        <a-form-item label="负责人" name="assigneeId">
          <UserPicker
            v-model:value="form.assigneeId"
            allow-clear
            :loading="userOptionsLoading"
            :options="userOptions"
            placeholder="请选择负责人"
          />
        </a-form-item>
        <a-form-item label="截止日期" name="dueDate">
          <a-date-picker
            v-model:value="dueDate"
            allow-clear
            class="w-full"
            format="YYYY-MM-DD"
            placeholder="请选择截止日期"
          />
        </a-form-item>
      </div>
      <a-form-item class="!mb-0" label="任务描述" name="description">
        <a-textarea
          v-model:value="form.description"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :maxlength="200"
          placeholder="请输入任务背景或验收标准"
          show-count
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex justify-end gap-8">
        <a-button :disabled="submitting" @click="open = false">取消</a-button>
        <a-button :loading="submitting" type="primary" @click="handleSubmit">
          {{ isEdit ? '保存' : '新建' }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { message, type FormInstance } from 'antdv-next'
import {
  createProjectTaskApi,
  getProjectTaskRecordApi,
  updateProjectTaskApi,
} from '@/apis'
import { UserPicker } from '@/features'
import { priorityOptions, taskStatusOptions, toDateValue } from '../../data'
import { useProjectOptions, useUserOptions } from '../../hooks'
import type { CreateProjectTaskReq } from '@/apis'
import type { Dayjs } from 'dayjs'

interface Props {
  /**
   * @desc 固定所属项目(详情页使用)
   */
  projectId?: string
  /**
   * @desc 任务 id,传入即为编辑
   */
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  projectId: undefined,
  id: undefined,
})

const open = defineModel<boolean>('open', { required: true })

const emits = defineEmits<{
  /**
   * @desc 创建/保存成功
   */
  success: []
}>()

const { projectOptions, projectOptionsLoading } = useProjectOptions()
const { userOptions, userOptionsLoading, getUserOption } = useUserOptions()

const formRef = shallowRef<FormInstance>()
const submitting = shallowRef(false)
const dueDate = shallowRef<Dayjs>()
const form = reactive<CreateProjectTaskReq>(createDefaultForm())
const isEdit = computed(() => Boolean(props.id))
const title = computed(() => (isEdit.value ? '编辑任务' : '新建任务'))

const projectSelectOptions = computed(() =>
  projectOptions.value.map((option) => ({
    label: `${option.label} (${option.code})`,
    value: option.value,
  }))
)

const rules = {
  projectId: [{ required: true, message: '请选择所属项目' }],
  title: [{ required: true, whitespace: true, message: '请输入任务标题' }],
  status: [{ required: true, message: '请选择任务状态' }],
  priority: [{ required: true, message: '请选择优先级' }],
}

watch(open, (isOpen) => {
  if (!isOpen) return
  if (isEdit.value) {
    void loadDetail()
    return
  }
  resetForm()
})

watch(
  () => form.assigneeId,
  (assigneeId) => {
    const option = getUserOption(assigneeId)
    form.assigneeName = option?.label
  }
)

function createDefaultForm(): CreateProjectTaskReq {
  return {
    projectId: props.projectId ?? '',
    title: '',
    description: '',
    status: 0,
    priority: 2,
    assigneeId: undefined,
    assigneeName: undefined,
    dueDate: undefined,
  }
}

function resetForm() {
  Object.assign(form, createDefaultForm())
  dueDate.value = undefined
  nextTick(() => formRef.value?.clearValidate())
}

async function loadDetail() {
  if (!props.id) return
  try {
    const response = await getProjectTaskRecordApi({ id: props.id })
    const record = response.data
    if (!record) return
    Object.assign(form, {
      projectId: record.projectId,
      title: record.title,
      description: record.description ?? '',
      status: record.status,
      priority: record.priority,
      assigneeId: record.assigneeId,
      assigneeName: record.assigneeName,
      dueDate: record.dueDate,
    })
    dueDate.value = record.dueDate ? dayjs(record.dueDate) : undefined
    nextTick(() => formRef.value?.clearValidate())
  } catch {
    // 业务错误已由请求层统一提示
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  const payload: CreateProjectTaskReq = {
    ...form,
    projectId: props.projectId ?? form.projectId,
    dueDate: toDateValue(dueDate.value),
    assigneeName: getUserOption(form.assigneeId)?.label ?? form.assigneeName,
  }

  submitting.value = true
  try {
    if (isEdit.value && props.id) {
      await updateProjectTaskApi({ ...payload, id: props.id })
      message.success('保存成功')
    } else {
      await createProjectTaskApi(payload)
      message.success('创建成功')
    }
    open.value = false
    emits('success')
  } catch {
    // 业务错误已由请求层统一提示
  } finally {
    submitting.value = false
  }
}
</script>
