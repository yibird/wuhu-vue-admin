<template>
  <a-modal
    v-model:open="open"
    :confirm-loading="submitting"
    destroy-on-hidden
    ok-text="保存"
    cancel-text="取消"
    title="重命名文件"
    :width="480"
    @ok="handleSubmit"
  >
    <a-form ref="formRef" :label-col="{ span: 5 }" :model="form" :rules="rules">
      <a-form-item label="文件名" name="name">
        <a-input
          v-model:value="form.name"
          :maxlength="100"
          placeholder="请输入文件名(含扩展名)"
          show-count
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { message, type FormInstance } from 'antdv-next'
import { updateFileApi, type FileResp } from '@/apis'

const props = defineProps<{
  file?: FileResp
}>()

const emits = defineEmits<{
  success: []
}>()

const open = defineModel<boolean>('open', { required: true })

const formRef = shallowRef<FormInstance>()
const submitting = shallowRef(false)
const form = reactive<{ name: string }>({ name: '' })

const rules = {
  name: [
    { required: true, whitespace: true, message: '请输入文件名' },
    { max: 100, message: '文件名不能超过 100 个字符' },
  ],
}

watch(open, (visible) => {
  if (!visible) return
  form.name = props.file?.name ?? ''
  formRef.value?.clearValidate()
})

async function handleSubmit() {
  const file = props.file
  if (!file) return

  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    await updateFileApi({ id: file.id, name: form.name.trim() })
    message.success('文件名已更新')
    open.value = false
    emits('success')
  } catch {
    // 业务错误已由请求层统一提示
  } finally {
    submitting.value = false
  }
}
</script>
