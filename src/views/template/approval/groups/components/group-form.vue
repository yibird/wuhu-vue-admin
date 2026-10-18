<template>
  <a-modal
    v-model:open="open"
    destroy-on-hidden
    :title="isEdit ? '编辑分组' : '新建分组'"
    :width="560"
    @ok="handleSubmit"
  >
    <a-form
      ref="formRef"
      :label-col="{ flex: '84px' }"
      :model="form"
      :rules="rules"
      :wrapper-col="{ flex: '1 1 0' }"
    >
      <a-form-item label="分组名称" name="name">
        <a-input
          v-model:value="form.name"
          allow-clear
          :maxlength="30"
          placeholder="请输入分组名称"
        />
      </a-form-item>
      <a-form-item label="分组编码" name="code">
        <a-input
          v-model:value="form.code"
          allow-clear
          :maxlength="24"
          placeholder="留空自动生成，例如 GRP-HR"
        />
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number
          v-model:value="form.sort"
          class="w-full"
          :min="0"
          :max="9999"
          :precision="0"
        />
      </a-form-item>
      <a-form-item label="启用状态" name="enabled">
        <a-switch v-model:checked="form.enabled" />
      </a-form-item>
      <a-form-item class="!mb-0" label="分组说明" name="description">
        <a-textarea
          v-model:value="form.description"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :maxlength="120"
          placeholder="说明该分组适用的业务场景"
          show-count
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { message, type FormInstance } from 'antdv-next'
import {
  createApprovalGroupApi,
  getApprovalGroupRecordApi,
  updateApprovalGroupApi,
} from '@/apis'
import type { CreateApprovalGroupReq } from '@/apis'

interface Props {
  /**
   * @desc 分组 id,传入即为编辑
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

const formRef = shallowRef<FormInstance>()
const detailLoading = shallowRef(false)
const isEdit = computed(() => Boolean(props.id))
const form = reactive<CreateApprovalGroupReq>(createDefaultForm())

const rules = {
  name: [{ required: true, whitespace: true, message: '请输入分组名称' }],
  code: [
    {
      pattern: /^[A-Za-z0-9_-]{2,24}$/,
      message: '编码由 2-24 位字母、数字、下划线或中划线组成',
    },
  ],
}

watch(open, (isOpen) => {
  if (!isOpen) return
  if (isEdit.value) {
    void loadDetail()
    return
  }
  Object.assign(form, createDefaultForm())
  nextTick(() => formRef.value?.clearValidate())
})

function createDefaultForm(): CreateApprovalGroupReq {
  return {
    name: '',
    code: '',
    description: '',
    enabled: true,
    sort: 0,
  }
}

async function loadDetail() {
  if (!props.id) return
  detailLoading.value = true
  try {
    const response = await getApprovalGroupRecordApi({ id: props.id })
    const record = response.data
    if (!record) return
    Object.assign(form, {
      name: record.name,
      code: record.code,
      description: record.description ?? '',
      enabled: record.enabled,
      sort: record.sort,
    })
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

  if (isEdit.value && props.id) {
    await updateApprovalGroupApi({ ...form, id: props.id })
    message.success('保存成功')
  } else {
    await createApprovalGroupApi(form)
    message.success('创建成功')
  }
  open.value = false
  emits('success')
}
</script>
