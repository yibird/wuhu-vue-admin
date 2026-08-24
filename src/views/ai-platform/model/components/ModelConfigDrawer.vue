<script setup lang="ts">
import ProviderCreateModal from './ProviderCreateModal.vue'
import {
  capabilityOptions,
  getProviderMeta,
  protocolOptions,
  providerOptions,
} from '../data'
import type { FormInstance } from 'antdv-next'
import type { ModelCreateInput, ModelItem, ModelProviderOption } from '../types'

const props = defineProps<{
  item?: ModelItem
}>()

const emit = defineEmits<{
  save: [input: ModelCreateInput]
}>()

const open = defineModel<boolean>('open', { required: true })
const formRef = shallowRef<FormInstance>()
const submitting = shallowRef(false)
const providerCreateOpen = shallowRef(false)
const providerSelectOpen = shallowRef(false)
const availableProviderOptions = shallowRef<ModelProviderOption[]>([
  ...providerOptions,
])
const form = reactive<ModelCreateInput>(createDefaultForm())

const isEditing = computed(() => Boolean(props.item))
const title = computed(() => (isEditing.value ? '编辑模型' : '新建模型'))
const providerMeta = computed(
  () =>
    availableProviderOptions.value.find(
      (option) => option.value === form.provider
    ) ?? getProviderMeta(form.provider)
)
const previewName = computed(() => form.name.trim() || '未命名模型')
const previewModelId = computed(() => form.modelId.trim() || 'model-id')
const existingProviderValues = computed(() =>
  availableProviderOptions.value.map((option) => option.value)
)
const rules = {
  provider: [{ required: true, message: '请选择模型供应商' }],
  providerName: [
    {
      validator: () =>
        form.provider !== 'custom' || form.providerName.trim()
          ? Promise.resolve()
          : Promise.reject(new Error('请输入供应商名称')),
    },
  ],
  name: [
    { required: true, whitespace: true, message: '请输入模型名称' },
    { min: 2, max: 60, message: '模型名称长度为 2-60 个字符' },
  ],
  modelId: [
    { required: true, whitespace: true, message: '请输入供应商模型 ID' },
    { max: 100, message: 'Model ID 不能超过 100 个字符' },
  ],
  endpoint: [
    { required: true, whitespace: true, message: '请输入 API Endpoint' },
  ],
  contextWindow: [
    { required: true, type: 'number', message: '请输入上下文窗口' },
  ],
  maxOutputTokens: [
    { required: true, type: 'number', message: '请输入最大输出 Token' },
  ],
  capabilities: [
    { required: true, type: 'array', min: 1, message: '至少选择一项模型能力' },
  ],
}

watch(
  [open, () => props.item],
  async ([isOpen]) => {
    if (!isOpen) return
    Object.assign(form, createDefaultForm(props.item))
    await nextTick()
    formRef.value?.clearValidate()
  },
  { immediate: true }
)

function createDefaultForm(item?: ModelItem): ModelCreateInput {
  if (item) {
    return {
      provider: item.provider,
      providerName: item.providerName,
      name: item.name,
      modelId: item.modelId,
      description: item.description,
      protocol: item.protocol,
      endpoint: item.endpoint,
      apiKey: '',
      contextWindow: item.contextWindow,
      maxOutputTokens: item.maxOutputTokens,
      capabilities: [...item.capabilities],
      inputPrice: item.inputPrice,
      outputPrice: item.outputPrice,
    }
  }

  const defaultProvider = providerOptions[0]
  return {
    provider: defaultProvider.value,
    providerName: defaultProvider.label,
    name: '',
    modelId: '',
    description: '',
    protocol: defaultProvider.protocol,
    endpoint: defaultProvider.endpoint,
    apiKey: '',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    capabilities: ['chat'],
    inputPrice: 0,
    outputPrice: 0,
  }
}

function handleProviderChange(value: ModelCreateInput['provider']) {
  const option =
    availableProviderOptions.value.find((item) => item.value === value) ??
    getProviderMeta(value)
  if (value !== 'custom') form.providerName = option.label
  form.protocol = option.protocol
  form.endpoint = option.endpoint
}

function openProviderCreate() {
  providerSelectOpen.value = false
  providerCreateOpen.value = true
}

function handleProviderCreated(option: ModelProviderOption) {
  availableProviderOptions.value = [...availableProviderOptions.value, option]
  form.provider = option.value
  form.providerName = option.label
  form.protocol = option.protocol
  form.endpoint = option.endpoint
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch (error: unknown) {
    if (isValidationError(error)) return
    throw error
  }

  submitting.value = true
  emit('save', {
    ...form,
    capabilities: [...form.capabilities],
  })
  submitting.value = false
  open.value = false
}

function isValidationError(error: unknown) {
  return typeof error === 'object' && error !== null && 'errorFields' in error
}
</script>

<template>
  <a-drawer v-model:open="open" destroy-on-hidden :size="700" :title="title">
    <div
      class="mb-16 flex min-w-0 items-center gap-12 rounded-8 border-1 border-color-2 border-solid bg-page p-12"
    >
      <span
        class="size-48 flex flex-none items-center justify-center rounded-10"
        :style="{
          backgroundColor: providerMeta.softBackground,
          color: providerMeta.accent,
        }"
      >
        <Icon :name="providerMeta.icon" :size="24" />
      </span>
      <div class="min-w-0 flex-1">
        <div class="truncate text-md text-main font-700">{{ previewName }}</div>
        <code class="mt-3 block truncate text-xs text-secondary">
          {{ providerMeta.label }} / {{ previewModelId }}
        </code>
      </div>
      <a-tag :bordered="false" color="blue">
        {{ isEditing ? '配置中' : '新模型' }}
      </a-tag>
    </div>

    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <div class="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
        <a-form-item label="模型供应商" name="provider">
          <a-select
            v-model:value="form.provider"
            :open="providerSelectOpen"
            :options="availableProviderOptions"
            @open-change="providerSelectOpen = $event"
            @change="handleProviderChange"
          >
            <template #popupRender="menu">
              <component :is="menu" />
              <div class="border-t-1 border-color-2 border-t-solid p-6">
                <button
                  type="button"
                  class="h-34 w-full flex items-center gap-8 rounded-6 border-0 bg-transparent px-8 text-sm text-primary cursor-pointer transition-colors duration-motion-base hover:bg-hover focus-visible:bg-hover focus-visible:outline-none"
                  @mousedown.prevent
                  @click="openProviderCreate"
                >
                  <Icon name="i-lucide:plus" :size="15" />
                  <span>新建模型供应商</span>
                </button>
              </div>
            </template>
          </a-select>
        </a-form-item>

        <a-form-item
          v-if="form.provider === 'custom'"
          label="供应商名称"
          name="providerName"
        >
          <a-input
            v-model:value="form.providerName"
            allow-clear
            placeholder="例如：企业内部模型网关"
          />
        </a-form-item>

        <a-form-item label="模型名称" name="name">
          <a-input
            v-model:value="form.name"
            allow-clear
            :maxlength="60"
            placeholder="例如：客服问答模型"
            show-count
          />
        </a-form-item>

        <a-form-item label="Model ID" name="modelId">
          <a-input
            v-model:value="form.modelId"
            allow-clear
            :maxlength="100"
            placeholder="例如：gpt-4o"
          />
        </a-form-item>
      </div>

      <a-form-item label="调用协议" name="protocol">
        <a-select v-model:value="form.protocol" :options="protocolOptions" />
      </a-form-item>

      <a-form-item label="API Endpoint" name="endpoint">
        <a-input
          v-model:value="form.endpoint"
          allow-clear
          placeholder="https://api.example.com/v1"
        >
          <template #prefix>
            <Icon name="i-lucide:globe-2" class="text-placeholder" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="API Key" name="apiKey">
        <a-input-password
          v-model:value="form.apiKey"
          allow-clear
          autocomplete="new-password"
          :placeholder="
            isEditing ? '留空表示保留当前密钥' : '请输入供应商 API Key'
          "
        />
        <div class="mt-5 text-xs text-secondary">
          密钥仅用于当前模型请求，页面不会展示完整凭据。
        </div>
      </a-form-item>

      <div class="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
        <a-form-item label="上下文窗口（Tokens）" name="contextWindow">
          <a-input-number
            v-model:value="form.contextWindow"
            class="w-full"
            :max="10000000"
            :min="1"
            :step="1024"
          />
        </a-form-item>

        <a-form-item label="最大输出（Tokens）" name="maxOutputTokens">
          <a-input-number
            v-model:value="form.maxOutputTokens"
            class="w-full"
            :max="1000000"
            :min="1"
            :step="1024"
          />
        </a-form-item>

        <a-form-item label="输入价格（USD / 1M Tokens）" name="inputPrice">
          <a-input-number
            v-model:value="form.inputPrice"
            class="w-full"
            :min="0"
            :precision="4"
            :step="0.01"
          >
            <template #prefix>$</template>
          </a-input-number>
        </a-form-item>

        <a-form-item label="输出价格（USD / 1M Tokens）" name="outputPrice">
          <a-input-number
            v-model:value="form.outputPrice"
            class="w-full"
            :min="0"
            :precision="4"
            :step="0.01"
          >
            <template #prefix>$</template>
          </a-input-number>
        </a-form-item>
      </div>

      <a-form-item label="模型能力" name="capabilities">
        <a-select
          v-model:value="form.capabilities"
          mode="multiple"
          :options="capabilityOptions"
          placeholder="选择模型支持的能力"
        />
      </a-form-item>

      <a-form-item label="说明" name="description">
        <a-textarea
          v-model:value="form.description"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          :maxlength="180"
          placeholder="说明该模型的适用场景和路由建议"
          show-count
        />
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex justify-end gap-8">
        <a-button @click="open = false">取消</a-button>
        <a-button :loading="submitting" type="primary" @click="handleSubmit">
          {{ isEditing ? '保存配置' : '创建模型' }}
        </a-button>
      </div>
    </template>
  </a-drawer>

  <ProviderCreateModal
    v-model:open="providerCreateOpen"
    :existing-values="existingProviderValues"
    @create="handleProviderCreated"
  />
</template>
