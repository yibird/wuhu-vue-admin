<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  /**
   * @desc 弹窗标题
   */
  title: string
  /**
   * @desc 输入框占位文案
   */
  placeholder: string
  /**
   * @desc 打开时的初始值,用于编辑已有链接
   * @default ''
   */
  initialValue?: string
}>()

const emit = defineEmits<{
  /**
   * @desc 确认时回传输入值,清空输入表示移除
   */
  apply: [value: string]
}>()

const value = shallowRef('')
const inputRef = useTemplateRef<{ focus: () => void }>('inputRef')

watch(open, async (visible) => {
  if (!visible) return
  value.value = props.initialValue ?? ''
  await nextTick()
  inputRef.value?.focus()
})

function handleApply() {
  emit('apply', value.value.trim())
}
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="title"
    :width="440"
    destroy-on-hidden
    @ok="handleApply"
  >
    <a-input
      ref="inputRef"
      v-model:value="value"
      allow-clear
      :placeholder="placeholder"
      @press-enter="handleApply"
    />
  </a-modal>
</template>
