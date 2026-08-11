<script setup lang="ts">
import type { ChartAiMessage, ChartAiSuggestion } from '../types'

defineProps<{
  busy: boolean
  canUpdateSelected: boolean
  messages: readonly ChartAiMessage[]
  suggestions: readonly ChartAiSuggestion[]
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
    <header class="border-b border-color-2 px-12 py-10">
      <div class="flex items-center justify-between gap-8">
        <div class="min-w-0 flex items-center gap-7">
          <Icon name="i-lucide:sparkles" :size="17" class="text-primary" />
          <h2 class="m-0 text-14px font-700 text-primary">AI 助手</h2>
        </div>
        <a-popover placement="leftTop" trigger="click">
          <a-button
            class="chart-ai-icon-button"
            size="small"
            title="提示词模板"
          >
            <template #icon>
              <Icon name="i-lucide:lightbulb" :size="15" />
            </template>
          </a-button>
          <template #content>
            <div class="w-260 grid gap-7">
              <a-button
                v-for="suggestion in suggestions"
                :key="suggestion.id"
                class="chart-ai-suggestion-button"
                @click="emit('applySuggestion', suggestion.prompt)"
              >
                <Icon :name="suggestion.icon" :size="14" />
                {{ suggestion.title }}
              </a-button>
            </div>
          </template>
        </a-popover>
      </div>
    </header>

    <Scrollbar class="min-h-0" content-class="p-10">
      <div
        v-for="message in messages"
        :key="message.id"
        class="mb-9 flex"
        :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[88%] rounded-8 px-10 py-8 text-12px leading-20px"
          :class="
            message.role === 'user'
              ? 'bg-primary text-white'
              : 'bg-fill text-regular'
          "
        >
          <p class="m-0">{{ message.content }}</p>
          <span class="mt-5 block text-10px opacity-58">{{
            message.createdAt
          }}</span>
        </div>
      </div>
    </Scrollbar>

    <footer class="border-t border-color-2 p-10">
      <textarea
        v-model="prompt"
        class="h-68 w-full resize-none rounded-7 border-1 border-color-2 border-solid bg-fill px-10 py-8 text-13px text-primary outline-none focus:border-primary"
        placeholder="例如：生成一个销售经营大屏，包含 GMV、区域排行、渠道占比和趋势分析"
        @keydown.ctrl.enter.prevent="emit('generate')"
        @keydown.meta.enter.prevent="emit('generate')"
      ></textarea>
      <div class="mt-8 grid grid-cols-2 gap-8">
        <a-button
          block
          type="primary"
          :disabled="busy || !prompt.trim()"
          @click="emit('generate')"
        >
          <Icon
            :name="busy ? 'i-lucide:loader-circle' : 'i-lucide:wand-sparkles'"
            :size="15"
          />
          {{ busy ? '生成中' : '生成大屏' }}
        </a-button>
        <a-button
          block
          :disabled="busy || !prompt.trim() || !canUpdateSelected"
          @click="emit('updateSelected')"
        >
          <Icon name="i-lucide:sliders-horizontal" :size="15" />
          优化选中
        </a-button>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.chart-ai-icon-button {
  width: 28px;
  padding-inline: 0;
}

.chart-ai-suggestion-button {
  justify-content: flex-start;
  width: 100%;
}
</style>
