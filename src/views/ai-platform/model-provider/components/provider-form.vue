<template>
  <a-modal
    v-model:open="open"
    title="新增供应商"
    :width="560"
    :confirm-loading="submitting"
    destroy-on-hidden
    ok-text="保存"
    cancel-text="取消"
    @ok="handleSubmit"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :layout="isNarrowScreen ? 'vertical' : 'horizontal'"
      :label-col="isNarrowScreen ? undefined : { span: 5 }"
      :wrapper-col="isNarrowScreen ? undefined : { span: 18 }"
    >
      <a-form-item label="供应商名称" name="name">
        <a-input
          v-model:value="form.name"
          :maxlength="40"
          placeholder="请输入供应商名称"
        />
      </a-form-item>
      <a-form-item label="调用协议" name="protocol">
        <a-select
          v-model:value="form.protocol"
          :options="protocolOptions"
          placeholder="请选择调用协议"
          class="w-full"
        />
      </a-form-item>
      <a-form-item label="API Endpoint" name="endpoint">
        <a-input
          v-model:value="form.endpoint"
          placeholder="https://api.example.com/v1"
        />
      </a-form-item>
      <a-form-item label="API Key" name="apiKey">
        <a-input-password
          v-model:value="form.apiKey"
          placeholder="请输入 API Key"
        />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="form.description"
          :maxlength="120"
          :rows="3"
          show-count
          placeholder="选填,用于说明该供应商的用途"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, shallowRef, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { message } from 'antdv-next'
import { createProviderApi, protocolOptions } from '../data'
import type { FormInstance } from 'antdv-next'
import type { ProviderCreateInput } from '../types'

const open = defineModel<boolean>('open', { required: true })

const emits = defineEmits<{
  success: []
}>()

/**
 * 窄屏(移动端)下弹窗会被压缩到接近满屏宽,
 * 此时改用垂直布局,避免横向标签把输入框挤得过窄
 */
const isNarrowScreen = useMediaQuery('(max-width: 768px)')

const formRef = shallowRef<FormInstance>()
const submitting = shallowRef(false)

function createDefaultForm(): ProviderCreateInput {
  return {
    name: '',
    protocol: 'openai-compatible',
    endpoint: '',
    apiKey: '',
    description: '',
  }
}

const form = reactive<ProviderCreateInput>(createDefaultForm())

const rules = {
  name: [
    { required: true, whitespace: true, message: '请输入供应商名称' },
    { min: 2, max: 40, message: '名称长度为 2-40 个字符' },
  ],
  protocol: [{ required: true, message: '请选择调用协议' }],
  endpoint: [
    { required: true, whitespace: true, message: '请输入 API Endpoint' },
    { pattern: /^https?:\/\/.+/, message: '请输入合法的 http(s) 地址' },
  ],
  apiKey: [{ required: true, whitespace: true, message: '请输入 API Key' }],
}

watch(open, (visible) => {
  if (!visible) return
  Object.assign(form, createDefaultForm())
  formRef.value?.clearValidate()
})

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    await createProviderApi({ ...form })
    message.success('供应商已添加')
    open.value = false
    emits('success')
  } finally {
    submitting.value = false
  }
}
</script>
