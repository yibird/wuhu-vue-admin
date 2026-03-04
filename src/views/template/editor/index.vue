<template>
  <div class="h-full p-10">
    <div ref="divRef" class="h-800" />
  </div>
</template>

<script setup lang="ts">
import { AiEditor } from 'aieditor'
import 'aieditor/dist/style.css'

const divRef = ref()
const aiEditor = ref<AiEditor | null>(null)

onMounted(() => {
  aiEditor.value = new AiEditor({
    element: divRef.value as Element,
    placeholder: '点击输入内容...',
    content: 'AiEditor 是一个面向 AI 的开源富文本编辑器。 ',
  })
})

onUnmounted(() => {
  aiEditor.value && aiEditor.value.destroy()
})
</script>
