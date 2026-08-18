<script setup lang="ts">
import { computed, reactive, useTemplateRef, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import type { FormInstance } from 'antdv-next'
import {
  ticketCategoryList,
  ticketEnvironmentOptions,
  ticketPriorityList,
} from '../data'
import type { TicketDraft } from '../types'

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  submit: [draft: TicketDraft]
}>()

const formRef = useTemplateRef<FormInstance>('formRef')
const { width: viewportWidth } = useWindowSize()
const drawerSize = computed(() => Math.min(viewportWidth.value, 640))

const createDefaultDraft = (): TicketDraft => ({
  subject: '',
  description: '',
  category: 'bug',
  priority: 'medium',
  environment: '生产环境',
  contact: '',
})

const formState = reactive<TicketDraft>(createDefaultDraft())

const categoryOptions = ticketCategoryList.map(({ label, value }) => ({
  label,
  value,
}))
const priorityOptions = ticketPriorityList.map(({ label, value }) => ({
  label,
  value,
}))

const rules = {
  subject: [
    { required: true, message: '请输入问题标题', trigger: 'blur' },
    { min: 4, message: '问题标题至少 4 个字符', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请描述问题现象', trigger: 'blur' },
    { min: 10, message: '问题描述至少 10 个字符', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择问题类型' }],
  priority: [{ required: true, message: '请选择优先级' }],
  environment: [{ required: true, message: '请选择发生环境' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
}

watch(open, (value) => {
  if (!value) return
  Object.assign(formState, createDefaultDraft())
  formRef.value?.clearValidate()
})

function close() {
  open.value = false
}

function submit() {
  formRef.value?.submit()
}

function handleFinish() {
  emit('submit', { ...formState })
}
</script>

<template>
  <a-drawer
    v-model:open="open"
    destroy-on-hidden
    :size="drawerSize"
    title="提交工单"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      @finish="handleFinish"
    >
      <a-form-item label="问题标题" name="subject">
        <a-input
          v-model:value="formState.subject"
          allow-clear
          :maxlength="60"
          placeholder="简要概括遇到的问题"
          show-count
        />
      </a-form-item>

      <div class="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
        <a-form-item label="问题类型" name="category">
          <a-select
            v-model:value="formState.category"
            :options="categoryOptions"
          />
        </a-form-item>

        <a-form-item label="优先级" name="priority">
          <a-select
            v-model:value="formState.priority"
            :options="priorityOptions"
          />
        </a-form-item>

        <a-form-item label="发生环境" name="environment">
          <a-select
            v-model:value="formState.environment"
            :options="ticketEnvironmentOptions"
          />
        </a-form-item>

        <a-form-item label="联系方式" name="contact">
          <a-input
            v-model:value="formState.contact"
            allow-clear
            placeholder="邮箱、手机号或企业账号"
          />
        </a-form-item>
      </div>

      <a-form-item label="问题描述" name="description">
        <a-textarea
          v-model:value="formState.description"
          :auto-size="{ minRows: 7, maxRows: 12 }"
          :maxlength="800"
          placeholder="说明复现步骤、实际结果和期望结果"
          show-count
        />
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex justify-end gap-8">
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="submit">
          <template #icon>
            <Icon name="i-lucide:send" />
          </template>
          提交工单
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
