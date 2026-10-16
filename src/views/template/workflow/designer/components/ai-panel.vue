<script lang="ts" setup>
import { Icon } from '@/components'
import { formatWorkflowSchema } from '../data'
import type {
  WorkflowAiMessage,
  WorkflowAiPlan,
  WorkflowAiSuggestion,
} from '../types'

const props = defineProps<{
  /**
   * @desc 是否正在生成
   */
  busy: boolean
  /**
   * @desc 对话消息
   */
  messages: readonly WorkflowAiMessage[]
  /**
   * @desc 待应用的生成方案,为空表示还没有可预览的结果
   */
  plan: WorkflowAiPlan | null
  /**
   * @desc 提示词模板
   */
  suggestions: readonly WorkflowAiSuggestion[]
}>()

const prompt = defineModel<string>('prompt', { required: true })

const emit = defineEmits<{
  apply: []
  'apply-suggestion': [prompt: string]
  close: []
  discard: []
  generate: []
}>()

const planSource = computed(() =>
  props.plan ? formatWorkflowSchema(props.plan.schema) : ''
)
</script>

<template>
  <section
    class="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-floating)]"
    aria-label="AI 生成工作流"
  >
    <header
      class="flex items-center justify-between gap-8 border-b-1 border-b-solid border-color-2 px-12 py-10"
    >
      <div class="min-w-0 flex items-center gap-7">
        <Icon name="i-lucide:sparkles" :size="17" class="text-primary" />
        <div class="min-w-0 flex flex-col">
          <h2 class="m-0 truncate text-14px text-primary font-700">
            AI 生成工作流
          </h2>
          <span class="truncate text-11px text-muted">
            自然语言描述 → 节点与连线
          </span>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-6">
        <a-popover placement="bottomRight" trigger="click">
          <a-button
            type="text"
            class="!size-28 !p-0 text-secondary hover:text-main"
            title="提示词模板"
          >
            <Icon name="i-lucide:lightbulb" :size="15" />
          </a-button>
          <template #content>
            <div class="w-280 grid gap-7">
              <a-button
                v-for="suggestion in props.suggestions"
                :key="suggestion.id"
                class="w-full justify-start"
                @click="emit('apply-suggestion', suggestion.prompt)"
              >
                <Icon :name="suggestion.icon" :size="14" />
                {{ suggestion.title }}
              </a-button>
            </div>
          </template>
        </a-popover>
        <a-button
          type="text"
          class="!size-28 !p-0 text-secondary hover:text-main"
          title="关闭"
          @click="emit('close')"
        >
          <Icon name="i-lucide:x" :size="16" />
        </a-button>
      </div>
    </header>

    <div
      class="min-h-0 p-10 w-full flex flex-col gap-9 overflow-x-hidden overflow-y-auto"
    >
      <div
        v-for="message in props.messages"
        :key="message.id"
        class="flex"
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
          <p class="m-0 break-words">{{ message.content }}</p>
          <span class="mt-5 block text-10px opacity-58">{{
            message.createdAt
          }}</span>
        </div>
      </div>

      <section
        v-if="props.plan"
        class="rounded-10 border-1 border-color-2 border-solid bg-fill-quaternary p-10"
      >
        <header class="flex items-start justify-between gap-8">
          <div class="min-w-0 flex flex-col gap-3">
            <span class="truncate text-13px text-main font-700">
              {{ props.plan.title }}
            </span>
            <span class="text-11px leading-16px text-secondary">
              {{ props.plan.summary }}
            </span>
          </div>
          <span
            class="shrink-0 rounded-full bg-primary-tint px-8 py-4 text-11px text-primary font-600"
          >
            {{ props.plan.nodes.length }} 节点
          </span>
        </header>

        <div class="mt-8 flex flex-wrap gap-5">
          <span
            v-for="highlight in props.plan.highlights"
            :key="highlight"
            class="rounded-full bg-fill px-8 py-3 text-11px text-secondary"
          >
            {{ highlight }}
          </span>
        </div>

        <ol class="m-0 mt-9 list-none flex flex-col gap-6 p-0">
          <li
            v-for="node in props.plan.nodes"
            :key="node.id"
            class="flex items-center gap-7 rounded-7 border-1 border-color-2 border-solid bg-container px-8 py-6"
          >
            <Icon
              :name="node.icon"
              :size="14"
              :style="{ color: node.accent }"
            />
            <span class="min-w-0 flex-1 truncate text-12px text-main">
              {{ node.name }}
            </span>
            <span
              v-if="node.branch"
              class="shrink-0 truncate rounded-full bg-fill px-6 py-2 text-10px text-muted"
            >
              {{ node.branch }}
            </span>
          </li>
        </ol>

        <div class="mt-9 flex flex-col gap-4">
          <div
            v-for="edge in props.plan.edges"
            :key="edge.id"
            class="min-w-0 flex items-center gap-6 text-11px text-secondary"
          >
            <Icon
              name="i-lucide:arrow-right"
              :size="12"
              class="shrink-0 text-placeholder"
            />
            <span class="truncate">{{ edge.from }} → {{ edge.to }}</span>
            <span v-if="edge.label" class="shrink-0 text-10px text-muted">
              ({{ edge.label }})
            </span>
          </div>
        </div>

        <div
          v-if="props.plan.warnings.length"
          class="mt-9 rounded-7 bg-warning-tint px-8 py-6 text-11px leading-16px text-warning"
        >
          <p
            v-for="warning in props.plan.warnings"
            :key="`${warning.code}-${warning.path}`"
            class="m-0"
          >
            {{ warning.message }}
          </p>
        </div>

        <details class="mt-9">
          <summary class="cursor-pointer text-11px text-secondary">
            查看完整 DSL
          </summary>
          <pre
            class="mt-6 max-h-240 overflow-auto rounded-7 bg-fill p-8 text-10px leading-15px text-regular"
            >{{ planSource }}</pre>
        </details>
      </section>
    </div>

    <footer class="border-t-1 border-t-solid border-color-2 p-10">
      <textarea
        v-model="prompt"
        class="h-68 w-full resize-none rounded-7 border-1 border-color-2 border-solid bg-fill px-10 py-8 text-13px text-main outline-none focus:border-primary"
        placeholder="例如：客户退款审批，金额 5000 以内自动通过，否则转人工审批并通知客户"
        @keydown.ctrl.enter.prevent="emit('generate')"
        @keydown.meta.enter.prevent="emit('generate')"
      ></textarea>
      <div
        class="mt-8 grid gap-8"
        :class="props.plan ? 'grid-cols-3' : 'grid-cols-1'"
      >
        <a-button
          block
          type="primary"
          :disabled="props.busy || !prompt.trim()"
          @click="emit('generate')"
        >
          <Icon
            :name="
              props.busy ? 'i-lucide:loader-circle' : 'i-lucide:wand-sparkles'
            "
            :size="15"
            :class="{ 'animate-spin': props.busy }"
          />
          {{ props.busy ? '生成中' : '生成工作流' }}
        </a-button>
        <template v-if="props.plan">
          <a-button block @click="emit('discard')">
            <Icon name="i-lucide:undo-2" :size="15" />
            放弃
          </a-button>
          <a-button block type="primary" @click="emit('apply')">
            <Icon name="i-lucide:check" :size="15" />
            应用到画布
          </a-button>
        </template>
      </div>
    </footer>
  </section>
</template>
