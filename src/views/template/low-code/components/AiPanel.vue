<script setup lang="ts">
import type { DesignerAiMessage, DesignerAiSuggestion } from '../types'

defineProps<{
  busy: boolean
  canUpdateSelected: boolean
  messages: readonly DesignerAiMessage[]
  suggestions: readonly DesignerAiSuggestion[]
}>()

const prompt = defineModel<string>('prompt', { required: true })

const emit = defineEmits<{
  applySuggestion: [prompt: string]
  generate: []
  updateSelected: []
}>()
</script>

<template>
  <section
    class="min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
  >
    <header
      class="flex items-start justify-between gap-10 border-0 border-b-1 border-color-2 border-b-solid px-12 py-10"
    >
      <div class="min-w-0">
        <div class="flex items-center gap-7">
          <Icon name="i-lucide:sparkles" :size="17" class="text-primary" />
          <h2 class="m-0 text-14px text-primary font-700">AI 生成</h2>
        </div>
        <p class="m-0 mt-3 text-12px text-secondary">
          输入一句话生成页面，或优化当前选中控件。
        </p>
      </div>
      <a-popover trigger="click" placement="bottomRight">
        <button
          class="size-30 shrink-0 inline-flex items-center justify-center rounded-7 border-1 border-color-2 border-solid bg-fill text-secondary hover:bg-hover hover:text-primary"
          type="button"
          title="AI 快捷项"
        >
          <Icon name="i-lucide:more-horizontal" :size="16" />
        </button>
        <template #content>
          <div class="w-260 grid gap-8">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion.id"
              class="h-34 inline-flex items-center gap-8 rounded-7 border-0 bg-transparent px-8 text-left text-12px text-regular hover:bg-hover"
              type="button"
              @click="emit('applySuggestion', suggestion.prompt)"
            >
              <Icon :name="suggestion.icon" :size="14" />
              {{ suggestion.title }}
            </button>
          </div>
        </template>
      </a-popover>
    </header>

    <div class="min-h-0 p-10">
      <div class="rounded-8 bg-fill p-10 text-12px text-secondary leading-20px">
        最近：{{ messages[messages.length - 1]?.content ?? '等待输入' }}
      </div>
      <a-popover trigger="click" placement="leftTop">
        <button
          class="mt-8 h-28 inline-flex items-center gap-6 rounded-7 border-1 border-color-2 border-solid bg-container px-9 text-12px text-secondary hover:bg-hover"
          type="button"
        >
          <Icon name="i-lucide:history" :size="14" />
          记录
        </button>
        <template #content>
          <div class="max-h-260 w-280 overflow-auto">
            <div
              v-for="message in messages"
              :key="message.id"
              class="mb-8 rounded-7 bg-fill px-9 py-7 text-12px text-regular last:mb-0"
            >
              <div class="text-11px text-muted">{{ message.createdAt }}</div>
              <p class="m-0 mt-4 leading-20px">{{ message.content }}</p>
            </div>
          </div>
        </template>
      </a-popover>
    </div>

    <footer class="border-0 border-t-1 border-color-2 border-t-solid p-10">
      <textarea
        v-model="prompt"
        class="h-68 w-full resize-none rounded-7 border-1 border-color-2 border-solid bg-fill px-10 py-8 text-13px text-primary outline-none focus:border-primary"
        placeholder="例如：生成线索采集页，包含输入框、选择器、日期和提交按钮"
        @keydown.ctrl.enter.prevent="emit('generate')"
        @keydown.meta.enter.prevent="emit('generate')"
      ></textarea>
      <div class="mt-8 grid grid-cols-2 gap-8">
        <button
          class="h-34 inline-flex items-center justify-center gap-7 rounded-7 border-0 bg-primary text-13px text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-55"
          type="button"
          :disabled="busy || !prompt.trim()"
          @click="emit('generate')"
        >
          <Icon
            :name="busy ? 'i-lucide:loader-circle' : 'i-lucide:wand-sparkles'"
            :size="15"
          />
          {{ busy ? '生成中' : '生成页面' }}
        </button>
        <button
          class="h-34 inline-flex items-center justify-center gap-7 rounded-7 border-1 border-color-2 border-solid bg-fill text-13px text-primary transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-55"
          type="button"
          :disabled="busy || !prompt.trim() || !canUpdateSelected"
          @click="emit('updateSelected')"
        >
          <Icon name="i-lucide:sliders-horizontal" :size="15" />
          优化选中
        </button>
      </div>
    </footer>
  </section>
</template>
