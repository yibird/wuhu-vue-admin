<script setup lang="ts">
import { CodeEditor, Scrollbar } from '@/components'

const sourceCode = shallowRef(`{
  "name": "wuhu-admin",
  "version": "1.0.0",
  "features": ["Vue 3", "TypeScript", "UnoCSS"],
  "enabled": true
}`)
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
            <h1 class="m-0 text-xl text-main font-600">CodeEditor</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              基于 CodeMirror 的 JSON 与纯文本编辑器。
            </p>
          </div>
          <a-tag color="blue">src/components/code-editor</a-tag>
        </header>

        <div class="h-420">
          <CodeEditor v-model="sourceCode" language="json" />
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
