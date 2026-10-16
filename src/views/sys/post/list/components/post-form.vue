<template>
  <a-modal v-model:open="open" destroy-on-hidden :title="title" :width="680">
    <a-form
      ref="formRef"
      :disabled="detailLoading"
      :label-col="{ flex: '88px' }"
      :model="form"
      :rules="rules"
      :wrapper-col="{ flex: '1 1 0' }"
      layout="horizontal"
    >
      <div class="grid grid-cols-1 gap-x-16 sm:grid-cols-2">
        <a-form-item label="岗位名称" name="name">
          <a-input
            v-model:value="form.name"
            allow-clear
            placeholder="请输入岗位名称"
          />
        </a-form-item>
        <a-form-item label="岗位编码" name="code">
          <a-input
            v-model:value="form.code"
            allow-clear
            placeholder="请输入岗位编码"
          />
        </a-form-item>
        <a-form-item label="所属部门" name="parentId">
          <DeptPicker
            v-model:value="form.parentId"
            :loading="optionsLoading"
            :options="deptOptions"
            placeholder="请选择所属部门"
          />
        </a-form-item>
        <a-form-item label="岗位负责人" name="leader">
          <a-input
            v-model:value="form.leader"
            allow-clear
            placeholder="请输入岗位负责人"
          />
        </a-form-item>
        <a-form-item label="联系电话" name="phone">
          <a-input
            v-model:value="form.phone"
            allow-clear
            placeholder="请输入联系电话"
          />
        </a-form-item>
        <a-form-item label="联系邮箱" name="email">
          <a-input
            v-model:value="form.email"
            allow-clear
            placeholder="请输入联系邮箱"
          />
        </a-form-item>
      </div>
      <a-form-item class="!mb-0" label="岗位说明" name="remark">
        <a-textarea
          v-model:value="form.remark"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :maxlength="200"
          placeholder="请输入岗位职责或任职说明"
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
import { message, type FormInstance } from 'antdv-next'
import {
  createDeptApi,
  getDeptRecordApi,
  updateDeptApi,
  type CreateDeptReq,
} from '@/apis'
import { DeptPicker, type DeptPickerOption } from '@/features'

interface Props {
  id?: string
  deptOptions?: DeptPickerOption[]
  optionsLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  deptOptions: () => [],
  optionsLoading: false,
})

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  success: []
}>()

const formRef = shallowRef<FormInstance>()
const submitting = shallowRef(false)
const detailLoading = shallowRef(false)
const form = reactive<CreateDeptReq>(createDefaultForm())
const isEdit = computed(() => Boolean(props.id))
const title = computed(() => (isEdit.value ? '编辑岗位' : '新建岗位'))

const rules = {
  name: [
    { required: true, whitespace: true, message: '请输入岗位名称' },
    { max: 50, message: '岗位名称不能超过 50 个字符' },
  ],
  code: [{ required: true, whitespace: true, message: '请输入岗位编码' }],
  parentId: [{ required: true, message: '请选择所属部门' }],
}

watch([open, () => props.id], async ([value]) => {
  if (!value) return
  Object.assign(form, createDefaultForm())
  if (props.id) await loadPost(props.id)
  await nextTick()
  formRef.value?.clearValidate()
})

function createDefaultForm(): CreateDeptReq {
  return {
    parentId: '',
    name: '',
    code: '',
    type: 2,
    leader: '',
    phone: '',
    email: '',
    remark: '',
  }
}

function isValidationError(error: unknown) {
  return typeof error === 'object' && error !== null && 'errorFields' in error
}

async function loadPost(id: string) {
  detailLoading.value = true
  try {
    const response = await getDeptRecordApi({ id })
    if (!response.data) {
      open.value = false
      return
    }
    if (response.data.type !== 2) {
      message.error('当前记录不是岗位')
      open.value = false
      return
    }

    Object.assign(form, {
      parentId: response.data.parentId,
      name: response.data.name,
      code: response.data.code,
      type: 2,
      leader: response.data.leader,
      phone: response.data.phone,
      email: response.data.email,
      remark: response.data.remark ?? '',
    })
  } catch {
    // 业务错误已由请求层统一提示，这里仅关闭弹窗
    open.value = false
  } finally {
    detailLoading.value = false
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch (error: unknown) {
    if (isValidationError(error)) return
    throw error
  }

  submitting.value = true
  try {
    const payload: CreateDeptReq = {
      ...form,
      type: 2,
      name: form.name.trim(),
      code: form.code.trim(),
      leader: form.leader.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      remark: form.remark?.trim() || undefined,
    }
    if (props.id) {
      await updateDeptApi({ id: props.id, ...payload })
    } else {
      await createDeptApi(payload)
    }

    message.success(`岗位${isEdit.value ? '编辑' : '新建'}成功`)
    open.value = false
    emit('success')
  } catch {
    // 业务错误已由请求层统一提示，保持弹窗打开便于重试
  } finally {
    submitting.value = false
  }
}
</script>
