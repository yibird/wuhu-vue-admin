<script setup lang="ts">
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { message, type FormInstance } from 'antdv-next'
import {
  createNoticeApi,
  type CreateNoticeReq,
  type NoticeSendMode,
} from '@/apis'
import type { EditorExpose } from '@/components/editor'

const Editor = defineAsyncComponent(async () => {
  const { Editor } = await import('@/components/editor')
  return Editor
})

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  success: []
}>()

const formRef = shallowRef<FormInstance>()
const contentEditorRef = useTemplateRef<EditorExpose>('contentEditor')
const submitting = shallowRef(false)
const form = reactive<CreateNoticeReq>(createDefaultForm())

const sendModeOptions: Array<{ label: string; value: NoticeSendMode }> = [
  { label: '立即发送', value: 'immediate' },
  { label: '定时发送', value: 'scheduled' },
]

const rules = {
  title: [
    { required: true, whitespace: true, message: '请输入通知标题' },
    { max: 100, message: '通知标题不能超过 100 个字符' },
  ],
  type: [{ required: true, message: '请选择通知类型' }],
  content: [{ validator: validateContent, trigger: 'change' }],
  scheduledAt: [{ validator: validateScheduledAt, trigger: 'change' }],
}

watch(open, async (value) => {
  if (!value) return
  Object.assign(form, createDefaultForm())
  await nextTick()
  formRef.value?.clearValidate()
})

watch(
  () => form.sendMode,
  (sendMode) => {
    if (sendMode !== 'immediate') return
    form.scheduledAt = undefined
    formRef.value?.clearValidate(['scheduledAt'])
  }
)

function createDefaultForm(): CreateNoticeReq {
  return {
    title: '',
    content: '',
    type: 1,
    sort: 0,
    status: true,
    sendMode: 'immediate',
    scheduledAt: undefined,
    remark: '',
  }
}

function validateContent() {
  const document = new DOMParser().parseFromString(form.content, 'text/html')
  const text =
    contentEditorRef.value?.getText() ?? document.body.textContent ?? ''
  const textLength = text.trim().length
  const hasStructuredContent = Boolean(
    document.body.querySelector('img, table, hr')
  )

  if (textLength === 0 && !hasStructuredContent) {
    return Promise.reject(new Error('请输入通知内容'))
  }
  if (textLength > 2000) {
    return Promise.reject(new Error('通知内容不能超过 2000 个字符'))
  }
  return Promise.resolve()
}

function validateScheduledAt() {
  if (form.sendMode === 'immediate') return Promise.resolve()
  if (!form.scheduledAt) {
    return Promise.reject(new Error('请选择定时发送时间'))
  }
  if (!dayjs(form.scheduledAt).isAfter(dayjs())) {
    return Promise.reject(new Error('定时发送时间必须晚于当前时间'))
  }
  return Promise.resolve()
}

function disabledScheduleDate(value: Dayjs) {
  return value.endOf('day').isBefore(dayjs())
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
    await createNoticeApi({
      ...form,
      title: form.title.trim(),
      content: form.content.trim(),
      remark: form.remark?.trim() || undefined,
    })

    message.success(
      form.sendMode === 'scheduled' ? '通知已设置定时发送' : '通知发送成功'
    )
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
  <a-modal v-model:open="open" destroy-on-hidden title="新建通知" :width="1000">
    <div class="max-h-[72vh] overflow-y-auto px-2 pb-20">
      <a-form
        ref="formRef"
        :label-col="{ flex: '88px' }"
        :model="form"
        :rules="rules"
        :wrapper-col="{ flex: '1 1 0' }"
        layout="horizontal"
      >
        <a-form-item label="通知标题" name="title">
          <a-input
            v-model:value="form.title"
            allow-clear
            :maxlength="100"
            placeholder="请输入通知标题"
            show-count
          />
        </a-form-item>

        <div class="grid grid-cols-1 gap-x-16 sm:grid-cols-2">
          <a-form-item label="通知类型" name="type">
            <a-radio-group v-model:value="form.type">
              <a-radio :value="1">通知</a-radio>
              <a-radio :value="2">公告</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="发送方式" name="sendMode">
            <a-segmented
              v-model:value="form.sendMode"
              block
              :options="sendModeOptions"
            />
          </a-form-item>
        </div>

        <a-form-item
          v-if="form.sendMode === 'scheduled'"
          label="发送时间"
          name="scheduledAt"
        >
          <a-date-picker
            v-model:value="form.scheduledAt"
            allow-clear
            class="w-full"
            :disabled-date="disabledScheduleDate"
            format="YYYY-MM-DD HH:mm"
            placeholder="请选择定时发送时间"
            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>

        <a-form-item label="通知内容" name="content">
          <Editor
            ref="contentEditor"
            v-model="form.content"
            :min-height="220"
            :max-height="360"
            placeholder="请输入通知内容..."
          />
        </a-form-item>

        <div class="flex gap-16 max-sm:flex-col max-sm:gap-0">
          <a-form-item class="min-w-0 flex-1" label="排序" name="sort">
            <a-input-number
              v-model:value="form.sort"
              class="w-full"
              :min="0"
              :max="9999"
              :precision="0"
            />
          </a-form-item>

          <a-form-item class="min-w-0 flex-1" label="状态" name="status">
            <div class="h-32 flex items-center gap-8">
              <a-switch v-model:checked="form.status" />
              <span class="text-sm text-secondary">
                {{ form.status ? '正常' : '停用' }}
              </span>
            </div>
          </a-form-item>
        </div>

        <a-form-item label="备注" name="remark">
          <a-textarea
            v-model:value="form.remark"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            :maxlength="200"
            placeholder="选填，用于内部说明"
            show-count
          />
        </a-form-item>
      </a-form>
    </div>

    <template #footer>
      <div class="flex justify-end gap-8">
        <a-button :disabled="submitting" @click="open = false"> 取消 </a-button>
        <a-button :loading="submitting" type="primary" @click="handleSubmit">
          {{ form.sendMode === 'scheduled' ? '定时发送' : '发送' }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
