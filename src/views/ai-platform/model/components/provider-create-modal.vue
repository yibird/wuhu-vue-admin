<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { reactive, shallowRef, watch } from 'vue'
import { protocolOptions } from '../data'
import type {
  ModelProvider,
  ModelProviderOption,
  ModelProtocol,
} from '../types'

const props = defineProps<{
  existingValues: string[]
}>()

const emit = defineEmits<{
  create: [option: ModelProviderOption]
}>()

const open = defineModel<boolean>('open', { required: true })
const formRef = shallowRef<FormInstance>()
const form = reactive({
  label: '',
  protocol: 'openai-compatible' as ModelProtocol,
  endpoint: 'https://api.example.com/v1',
})

const rules = {
  label: [
    { required: true, whitespace: true, message: '请输入供应商名称' },
    { min: 2, max: 40, message: '供应商名称长度为 2-40 个字符' },
  ],
  protocol: [{ required: true, message: '请选择调用协议' }],
  endpoint: [
    { required: true, whitespace: true, message: '请输入 API Endpoint' },
  ],
}

watch(open, (isOpen) => {
  if (!isOpen) return
  Object.assign(form, {
    label: '',
    protocol: 'openai-compatible',
    endpoint: 'https://api.example.com/v1',
  })
  formRef.value?.clearValidate()
})

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch (error: unknown) {
    if (isValidationError(error)) return
    throw error
  }

  const value = createUniqueValue(form.label, props.existingValues)
  emit('create', {
    value: value as ModelProvider,
    label: form.label.trim(),
    icon: 'i-lucide:blocks',
    accent: '#475569',
    softBackground: '#E2E8F0',
    protocol: form.protocol,
    endpoint: form.endpoint.trim().replace(/\/$/, ''),
  })
  open.value = false
}

function isValidationError(error: unknown) {
  return typeof error === 'object' && error !== null && 'errorFields' in error
}

function createUniqueValue(label: string, existingValues: string[]) {
  const baseValue =
    label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `custom-${Date.now().toString(36)}`

  if (!existingValues.includes(baseValue)) return baseValue

  let index = 2
  while (existingValues.includes(`${baseValue}-${index}`)) index += 1
  return `${baseValue}-${index}`
}
</script>

<template>
  <a-modal v-model:open="open" title="新建模型供应商" :width="520">
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-form-item label="供应商名称" name="label">
        <a-input
          v-model:value="form.label"
          allow-clear
          :maxlength="40"
          placeholder="例如：企业内部模型网关"
        />
      </a-form-item>

      <a-form-item label="调用协议" name="protocol">
        <a-select v-model:value="form.protocol" :options="protocolOptions" />
      </a-form-item>

      <a-form-item label="API Endpoint" name="endpoint">
        <a-input
          v-model:value="form.endpoint"
          allow-clear
          placeholder="https://api.example.com/v1"
        />
      </a-form-item>

      <div class="text-xs text-secondary">
        创建后可在模型配置中选择该供应商，并继续维护对应的模型与密钥。
      </div>
    </a-form>

    <template #footer>
      <div class="flex justify-end gap-8">
        <a-button @click="open = false">取消</a-button>
        <a-button type="primary" @click="handleSubmit">创建供应商</a-button>
      </div>
    </template>
  </a-modal>
</template>
