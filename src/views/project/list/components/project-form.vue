<template>
  <a-modal v-model:open="open" destroy-on-hidden :title="title" :width="720">
    <a-form
      ref="formRef"
      :disabled="detailLoading"
      :label-col="{ flex: '88px' }"
      :model="form"
      :rules="rules"
      :wrapper-col="{ flex: '1 1 0' }"
      layout="horizontal"
      class="py-20"
    >
      <div class="grid grid-cols-1 gap-x-16 sm:grid-cols-2">
        <a-form-item label="项目名称" name="name">
          <a-input
            v-model:value="form.name"
            allow-clear
            :maxlength="50"
            placeholder="请输入项目名称"
          />
        </a-form-item>
        <a-form-item label="项目编码" name="code">
          <a-input
            v-model:value="form.code"
            allow-clear
            :maxlength="32"
            placeholder="例如 PJ-2026-001"
          />
        </a-form-item>
        <a-form-item label="负责人" name="ownerId">
          <UserPicker
            v-model:value="form.ownerId"
            :loading="userOptionsLoading"
            :options="userOptions"
            placeholder="请选择负责人"
          />
        </a-form-item>
        <a-form-item label="项目状态" name="status">
          <a-select
            v-model:value="form.status"
            :options="[...projectStatusOptions]"
            placeholder="请选择项目状态"
          />
        </a-form-item>
        <a-form-item label="优先级" name="priority">
          <a-select
            v-model:value="form.priority"
            :options="[...priorityOptions]"
            placeholder="请选择优先级"
          />
        </a-form-item>
        <a-form-item label="计划周期" name="range">
          <a-range-picker
            v-model:value="form.range"
            class="w-full"
            show-time
            format="YYYY-MM-DD HH:mm"
            :placeholder="['开始时间', '结束时间']"
          />
        </a-form-item>
        <a-form-item label="预算(元)" name="budget">
          <a-input-number
            v-model:value="form.budget"
            class="w-full"
            :min="0"
            :precision="0"
            :step="10000"
            placeholder="请输入项目预算"
          />
        </a-form-item>
      </div>

      <a-form-item class="!mb-0" label="项目描述" name="description">
        <a-textarea
          v-model:value="form.description"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :maxlength="200"
          placeholder="请输入项目目标、范围或关键说明"
          show-count
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex justify-end gap-8">
        <a-button :disabled="submitting" @click="open = false">取消</a-button>
        <a-button
          :disabled="detailLoading"
          :loading="submitting"
          type="primary"
          @click="handleSubmit"
        >
          {{ isEdit ? '保存' : '新建' }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { message, type FormInstance } from 'antdv-next'
import { createProjectApi, getProjectRecordApi, updateProjectApi } from '@/apis'
import { UserPicker } from '@/features'
import { priorityOptions, projectStatusOptions } from '../../data'
import { useUserOptions } from '../../hooks'
import type { CreateProjectReq } from '@/apis'
import type { Dayjs } from 'dayjs'

interface Props {
  /**
   * @desc 项目 id,传入即为编辑
   */
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
})

const open = defineModel<boolean>('open', { required: true })

const emits = defineEmits<{
  /**
   * @desc 创建/保存成功
   */
  success: []
}>()

const { userOptions, userOptionsLoading } = useUserOptions()

const formRef = shallowRef<FormInstance>()
const submitting = shallowRef(false)
const detailLoading = shallowRef(false)
type ProjectFormState = CreateProjectReq & { range?: [Dayjs, Dayjs] }

const form = reactive<ProjectFormState>(createDefaultForm())
const isEdit = computed(() => Boolean(props.id))
const title = computed(() => (isEdit.value ? '编辑项目' : '新增项目'))

const rules = {
  name: [{ required: true, whitespace: true, message: '请输入项目名称' }],
  code: [
    { required: true, whitespace: true, message: '请输入项目编码' },
    {
      pattern: /^[A-Za-z0-9_-]{2,32}$/,
      message: '编码由 2-32 位字母、数字、下划线或中划线组成',
    },
  ],
  ownerId: [{ required: true, message: '请选择负责人' }],
  status: [{ required: true, message: '请选择项目状态' }],
  priority: [{ required: true, message: '请选择优先级' }],
  range: [
    { required: true, type: 'array' as const, message: '请选择计划周期' },
  ],
  budget: [{ type: 'number' as const, min: 0, message: '预算不能为负数' }],
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
  () => form.ownerId,
  (ownerId) => {
    if (!ownerId) return
    const owner = userOptions.value.find((option) => option.value === ownerId)
    if (owner) form.ownerName = owner.label
  }
)

function createDefaultForm(): ProjectFormState {
  return {
    code: '',
    name: '',
    description: '',
    status: 0,
    priority: 2,
    ownerId: '',
    ownerName: '',
    startDate: '',
    endDate: '',
    budget: undefined,
    range: undefined,
  }
}

function resetForm() {
  Object.assign(form, createDefaultForm())
  detailLoading.value = false
  nextTick(() => formRef.value?.clearValidate())
}

async function loadDetail() {
  if (!props.id) return
  detailLoading.value = true
  try {
    const response = await getProjectRecordApi({ id: props.id })
    const record = response.data
    if (!record) return
    Object.assign(form, {
      code: record.code,
      name: record.name,
      description: record.description ?? '',
      status: record.status,
      priority: record.priority,
      ownerId: record.ownerId,
      ownerName: record.ownerName,
      startDate: record.startDate,
      endDate: record.endDate,
      budget: record.budget,
    })
    form.range = [dayjs(record.startDate), dayjs(record.endDate)]
    nextTick(() => formRef.value?.clearValidate())
  } catch {
    // 业务错误已由请求层统一提示
  } finally {
    detailLoading.value = false
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  const [start, end] = form.range ?? []
  const startDate = start?.format('YYYY-MM-DD HH:mm:ss')
  const endDate = end?.format('YYYY-MM-DD HH:mm:ss')
  if (!startDate || !endDate) {
    message.warning('请选择计划周期')
    return
  }
  if (startDate > endDate) {
    message.warning('结束时间不能早于开始时间')
    return
  }

  const owner = userOptions.value.find(
    (option) => option.value === form.ownerId
  )
  const payload: CreateProjectReq = {
    code: form.code,
    name: form.name,
    description: form.description,
    status: form.status,
    priority: form.priority,
    ownerId: form.ownerId,
    ownerName: owner?.label ?? form.ownerName,
    startDate,
    endDate,
    budget: form.budget,
  }

  submitting.value = true
  try {
    if (isEdit.value && props.id) {
      await updateProjectApi({ ...payload, id: props.id })
      message.success('保存成功')
    } else {
      await createProjectApi(payload)
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
