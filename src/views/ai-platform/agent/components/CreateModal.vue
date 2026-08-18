<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { computed, nextTick, reactive, shallowRef, watch } from 'vue'
import { IconSelector } from '@/components/iconPicker'
import {
  agentIconBackgroundOptions,
  defaultAgentIconBackground,
  getAgentIconForeground,
} from '../iconPalette'
import type { AgentCreateInput } from '../types'

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  create: [input: AgentCreateInput]
}>()

const colorOptions = agentIconBackgroundOptions
const colorPresets = [
  { label: '常用颜色', colors: colorOptions, defaultOpen: true },
]
const formRef = shallowRef<FormInstance>()
const submitting = shallowRef(false)
const form = reactive<AgentCreateInput>(createDefaultForm())
const previewIconStyle = computed(() => ({
  backgroundColor: form.iconBackground,
  color: getAgentIconForeground(form.iconBackground),
}))
const rules = {
  name: [
    { required: true, whitespace: true, message: '请输入 Agent 名称' },
    { min: 2, max: 40, message: '名称长度为 2-40 个字符' },
  ],
  description: [
    { required: true, whitespace: true, message: '请输入 Agent 描述' },
    { max: 160, message: '描述不能超过 160 个字符' },
  ],
  icon: [{ required: true, message: '请选择图标' }],
  iconBackground: [{ required: true, message: '请选择图标背景色' }],
}

watch(open, async (value) => {
  if (!value) return
  Object.assign(form, createDefaultForm())
  await nextTick()
  formRef.value?.clearValidate()
})

function createDefaultForm(): AgentCreateInput {
  return {
    name: '',
    description: '',
    tags: [],
    icon: 'i-lucide:bot',
    iconBackground: defaultAgentIconBackground,
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
  emit('create', {
    ...form,
    tags: [...form.tags],
  })
  submitting.value = false
  open.value = false
}

function isValidationError(error: unknown) {
  return typeof error === 'object' && error !== null && 'errorFields' in error
}
</script>

<template>
  <a-drawer
    v-model:open="open"
    destroy-on-hidden
    :size="620"
    title="新建 Agent"
  >
    <div
      class="mb-16 flex min-w-0 items-center gap-12 rounded-8 border-1 border-color-2 border-solid bg-page p-12"
    >
      <span
        class="size-48 flex flex-none items-center justify-center rounded-8 shadow-[inset_0_0_0_1px_rgb(15_23_42_/_6%)]"
        :style="previewIconStyle"
      >
        <Icon :name="form.icon" :size="24" />
      </span>
      <div class="min-w-0 flex-1">
        <div class="truncate text-md text-main font-700">
          {{ form.name.trim() || '未命名 Agent' }}
        </div>
        <div class="mt-3 line-clamp-1 text-xs text-secondary">
          {{ form.description.trim() || 'Agent 描述' }}
        </div>
      </div>
      <a-tag :bordered="false" color="blue">草稿</a-tag>
    </div>

    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-form-item label="Agent 名称" name="name">
        <a-input
          v-model:value="form.name"
          allow-clear
          :maxlength="40"
          placeholder="例如：销售洞察 Agent"
          show-count
        />
      </a-form-item>

      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="form.description"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          :maxlength="160"
          placeholder="说明 Agent 的职责和适用场景"
          show-count
        />
      </a-form-item>

      <div class="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
        <a-form-item label="图标" name="icon">
          <IconSelector
            v-model:value="form.icon"
            :allow-clear="false"
            data-testid="agent-icon-selector"
            empty-text="没有匹配的图标"
            placeholder="选择图标"
            search-placeholder="搜索图标"
          />
        </a-form-item>

        <a-form-item label="图标背景色" name="iconBackground">
          <div class="h-32 flex items-center gap-6">
            <button
              v-for="color in colorOptions"
              :key="color"
              class="size-24 cursor-pointer rounded-6 border-2 border-solid p-0 outline-none transition-[border-color,box-shadow,transform] duration-motion-base hover:scale-105 focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] motion-reduce:(transform-none transition-none)"
              :class="
                form.iconBackground === color
                  ? 'border-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_16%)]'
                  : 'border-color-2'
              "
              :style="{ backgroundColor: color }"
              type="button"
              :aria-label="`选择颜色 ${color}`"
              :aria-pressed="form.iconBackground === color"
              @click="form.iconBackground = color"
            />
            <a-color-picker
              v-model:value="form.iconBackground"
              disabled-alpha
              :presets="colorPresets"
              value-format="hex"
            />
          </div>
        </a-form-item>
      </div>

      <a-form-item class="!mb-0" label="标签" name="tags">
        <a-select
          v-model:value="form.tags"
          mode="tags"
          placeholder="输入标签后按回车"
          :token-separators="[',', '，']"
        />
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex justify-end gap-8">
        <a-button @click="open = false">取消</a-button>
        <a-button :loading="submitting" type="primary" @click="handleSubmit">
          创建 Agent
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
