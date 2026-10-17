<template>
  <a-modal v-model:open="open" destroy-on-hidden :title="title" :width="560">
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
      <a-form-item label="成员" name="userId">
        <UserPicker
          v-model:value="form.userId"
          :disabled="isEdit"
          :loading="userOptionsLoading"
          :options="userOptions"
          placeholder="请选择成员"
        />
      </a-form-item>
      <a-form-item label="项目角色" name="role">
        <a-select
          v-model:value="form.role"
          :options="[...memberRoleOptions]"
          placeholder="请选择项目角色"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex justify-end gap-8">
        <a-button :disabled="submitting" @click="open = false">取消</a-button>
        <a-button :loading="submitting" type="primary" @click="handleSubmit">
          {{ isEdit ? '保存' : '添加' }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { message, type FormInstance } from 'antdv-next'
import {
  createProjectMemberApi,
  getProjectMemberRecordApi,
  updateProjectMemberApi,
} from '@/apis'
import { UserPicker } from '@/features'
import { memberRoleOptions } from '../../data'
import { useProjectOptions, useUserOptions } from '../../hooks'
import type { CreateProjectMemberReq, ProjectMemberRole } from '@/apis'

interface Props {
  /**
   * @desc 固定所属项目(详情页使用)
   */
  projectId?: string
  /**
   * @desc 成员记录 id,传入即为编辑
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
   * @desc 添加/保存成功
   */
  success: []
}>()

const { projectOptions, projectOptionsLoading } = useProjectOptions()
const { userOptions, userOptionsLoading, getUserOption } = useUserOptions()

const formRef = shallowRef<FormInstance>()
const submitting = shallowRef(false)
const form = reactive<CreateProjectMemberReq>(createDefaultForm())
const isEdit = computed(() => Boolean(props.id))
const title = computed(() => (isEdit.value ? '编辑成员' : '添加成员'))

const projectSelectOptions = computed(() =>
  projectOptions.value.map((option) => ({
    label: `${option.label} (${option.code})`,
    value: option.value,
  }))
)

const rules = {
  projectId: [{ required: true, message: '请选择项目' }],
  userId: [{ required: true, message: '请选择成员' }],
  role: [{ required: true, message: '请选择项目角色' }],
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
  () => form.userId,
  (userId) => {
    const option = getUserOption(userId)
    if (!option) return
    form.userName = option.label
    form.email = option.email
    form.department = option.department
  }
)

function createDefaultForm(): CreateProjectMemberReq {
  return {
    projectId: props.projectId ?? '',
    userId: '',
    userName: '',
    email: undefined,
    department: undefined,
    role: 'member' as ProjectMemberRole,
  }
}

function resetForm() {
  Object.assign(form, createDefaultForm())
  nextTick(() => formRef.value?.clearValidate())
}

async function loadDetail() {
  if (!props.id) return
  try {
    const response = await getProjectMemberRecordApi({ id: props.id })
    const record = response.data
    if (!record) return
    Object.assign(form, {
      projectId: record.projectId,
      userId: record.userId,
      userName: record.userName,
      email: record.email,
      department: record.department,
      role: record.role,
    })
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

  const payload: CreateProjectMemberReq = {
    ...form,
    projectId: props.projectId ?? form.projectId,
  }

  submitting.value = true
  try {
    if (isEdit.value && props.id) {
      await updateProjectMemberApi({
        id: props.id,
        userId: payload.userId,
        role: payload.role,
      })
      message.success('保存成功')
    } else {
      await createProjectMemberApi(payload)
      message.success('添加成功')
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
