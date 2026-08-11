<script setup lang="ts">
import { shallowRef } from 'vue'
import { Editor } from '@/components/editor'
import { Scrollbar } from '@/components/scrollbar'

const editorContent = shallowRef(`
  <h2>组件库设计规范</h2>
  <p>公共组件应保持清晰的输入输出契约，并覆盖加载、空态、禁用和错误状态。</p>
  <ul><li>Vue 3 Composition API</li><li>TypeScript 类型安全</li><li>主题与可访问性适配</li></ul>
`)
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <Scrollbar class="h-full" content-class="min-h-full p-16 md:p-20">
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">Editor</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              支持文本、图片、表格和格式命令的富文本编辑器。
            </p>
          </div>
          <a-tag color="blue">src/components/editor</a-tag>
        </header>

        <Editor
          v-model="editorContent"
          :min-height="360"
          :max-height="520"
          placeholder="输入组件文档..."
        />
      </section>
    </Scrollbar>
  </WView>
</template>
