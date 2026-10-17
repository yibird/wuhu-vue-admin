<template>
  <a-modal v-model:open="open" destroy-on-hidden :title="title" :width="600">
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
      <a-form-item label="里程碑名称" name="name">
        <a-input
          v-model:value="form.name"
          allow-clear
          :maxlength="40"
          placeholder="请输入里程碑名称"
        />
      </a-form-item>
      <div class="grid grid-cols-1 gap-x-16 sm:grid-cols-2">
        <a-form-item label="截止日期" name="dueDateValue">
          <a-date-picker
            v-model:value="form.dueDateValue"
            allow-clear
            class="w-full"
            format="YYYY-MM-DD"
            placeholder="请选择截止日期"
          />
        </a-form-item>
        <a-form-item label="里程碑状态" name="status">
          <a-select
            v-model:value="form.status"
            :options="[...milestoneStatusOptions]"
            placeholder="请选择里程碑状态"
          />
        </a-form-item>
        <a-form-item label="负责人" name="ownerId">
          <UserPicker
            v-model:value="form.ownerId"
            allow-clear
            :loading="userOptionsLoading"
            :options="userOptions"
            placeholder="请选择负责人"
          />
        </a-form-item>
      </div>
      <a-form-item class="!mb-0" label="里程碑说明" name="description">
        <a-textarea
          v-model:value="form.description"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :maxlength="200"
          placeholder="请输入里程碑的交付物或验收标准"
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
  createMilestoneApi,
  getMilestoneRecordApi,
  updateMilestoneApi,
} from '@/apis'
import { UserPicker } from '@/features'
import { milestoneStatusOptions, toDateValue } from '../../data'
import { useProjectOptions, useUserOptions } from '../../hooks'
import type { CreateMilestoneReq } from '@/apis'
import type { Dayjs } from 'dayjs'

interface Props {
  /**
   * @desc 固定所属项目(详情页使用)
   */
  projectId?: string
  /**
   * @desc 里程碑 id,传入即为编辑
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
type MilestoneFormState = CreateMilestoneReq & {
  dueDateValue?: Dayjs
  ownerId?: string
}

const form = reactive<MilestoneFormState>(createDefaultForm())
const isEdit = computed(() => Boolean(props.id))
const title = computed(() => (isEdit.value ? '编辑里程碑' : '新建里程碑'))

const projectSelectOptions = computed(() =>
  projectOptions.value.map((option) => ({
    label: `${option.label} (${option.code})`,
    value: option.value,
  }))
)

const rules = {
  projectId: [{ required: true, message: '请选择所属项目' }],
  name: [{ required: true, whitespace: true, message: '请输入里程碑名称' }],
  dueDateValue: [{ required: true, message: '请选择截止日期' }],
  status: [{ required: true, message: '请选择里程碑状态' }],
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
  (id) => {
    form.ownerName = getUserOption(id)?.label
  }
)

function createDefaultForm(): MilestoneFormState {
  return {
    projectId: props.projectId ?? '',
    name: '',
    description: '',
    ownerName: undefined,
    dueDate: '',
    status: 0,
    dueDateValue: undefined,
    ownerId: undefined,
  }
}

function resetForm() {
  Object.assign(form, createDefaultForm())
  nextTick(() => formRef.value?.clearValidate())
}

async function loadDetail() {
  if (!props.id) return
  try {
    const response = await getMilestoneRecordApi({ id: props.id })
    const record = response.data
    if (!record) return
    Object.assign(form, {
      projectId: record.projectId,
      name: record.name,
      description: record.description ?? '',
      ownerName: record.ownerName,
      dueDate: record.dueDate,
      status: record.status,
    })
    form.dueDateValue = dayjs(record.dueDate)
    const owner = userOptions.value.find(
      (option) => option.label === record.ownerName
    )
    form.ownerId = owner?.value
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

  const dueDateValue = toDateValue(form.dueDateValue)
  if (!dueDateValue) {
    message.warning('请选择截止日期')
    return
  }

  const payload: CreateMilestoneReq = {
    ...form,
    projectId: props.projectId ?? form.projectId,
    dueDate: dueDateValue,
    ownerName: getUserOption(form.ownerId)?.label ?? form.ownerName,
  }

  submitting.value = true
  try {
    if (isEdit.value && props.id) {
      await updateMilestoneApi({ ...payload, id: props.id })
      message.success('保存成功')
    } else {
      await createMilestoneApi(payload)
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
