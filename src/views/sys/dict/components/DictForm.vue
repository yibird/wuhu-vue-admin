<script setup lang="ts">
import { message, type FormInstance } from 'antdv-next'
import {
  createDictApi,
  getDictRecordApi,
  updateDictApi,
  type CreateDictReq,
} from '@/apis'

interface Props {
  id?: string
}

const props = defineProps<Props>()
const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ success: [] }>()

const formRef = shallowRef<FormInstance>()
const submitting = shallowRef(false)
const detailLoading = shallowRef(false)
const form = reactive<CreateDictReq>(createDefaultForm())
const isEdit = computed(() => Boolean(props.id))
const title = computed(() => (isEdit.value ? '编辑字典' : '新建字典'))

const rules = {
  name: [
    { required: true, whitespace: true, message: '请输入字典名称' },
    { max: 50, message: '字典名称不能超过 50 个字符' },
  ],
  type: [
    { required: true, whitespace: true, message: '请输入字典编码' },
    { max: 100, message: '字典编码不能超过 100 个字符' },
  ],
}

watch([open, () => props.id], async ([value]) => {
  if (!value) return
  Object.assign(form, createDefaultForm())
  if (props.id) await loadDict(props.id)
  await nextTick()
  formRef.value?.clearValidate()
})

function createDefaultForm(): CreateDictReq {
  return {
    name: '',
    type: '',
    status: true,
    remark: '',
  }
}

async function loadDict(id: string) {
  detailLoading.value = true
  try {
    const response = await getDictRecordApi({ id })
    if (!response.data) {
      open.value = false
      return
    }
    Object.assign(form, {
      name: response.data.name,
      type: response.data.type,
      status: response.data.status,
      remark: response.data.remark ?? '',
    })
  } catch {
    // 业务错误已由请求层统一提示，这里仅关闭弹窗
    open.value = false
  } finally {
    detailLoading.value = false
  }
}

function isValidationError(error: unknown) {
  return typeof error === 'object' && error !== null && 'errorFields' in error
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
    const payload: CreateDictReq = {
      ...form,
      name: form.name.trim(),
      type: form.type.trim(),
      remark: form.remark?.trim() || undefined,
    }
    if (props.id) {
      await updateDictApi({ id: props.id, ...payload })
    } else {
      await createDictApi(payload)
    }

    message.success(`字典${isEdit.value ? '编辑' : '新建'}成功`)
    open.value = false
    emit('success')
  } catch {
    // 业务错误已由请求层统一提示，保持弹窗打开便于重试
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <a-modal v-model:open="open" destroy-on-hidden :title="title" :width="800">
    <a-form
      ref="formRef"
      :disabled="detailLoading"
      :label-col="{ flex: '88px' }"
      :model="form"
      :rules="rules"
      :wrapper-col="{ flex: '1 1 0' }"
      layout="horizontal"
      class="py-10"
    >
      <div class="grid grid-cols-1 gap-x-16 sm:grid-cols-2">
        <a-form-item label="字典名称" name="name">
          <a-input
            v-model:value="form.name"
            allow-clear
            :maxlength="50"
            placeholder="请输入字典名称"
            show-count
          />
        </a-form-item>
        <a-form-item label="字典编码" name="type">
          <a-input
            v-model:value="form.type"
            allow-clear
            :maxlength="100"
            placeholder="请输入字典编码"
            show-count
          />
        </a-form-item>
      </div>

      <a-form-item label="状态" name="status">
        <div class="h-32 flex items-center gap-8">
          <a-switch v-model:checked="form.status" />
          <span class="text-sm text-secondary">
            {{ form.status ? '正常' : '停用' }}
          </span>
        </div>
      </a-form-item>
      <a-form-item class="!mb-0" label="备注" name="remark">
        <a-textarea
          v-model:value="form.remark"
          allow-clear
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :maxlength="200"
          placeholder="选填，用于内部说明"
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
