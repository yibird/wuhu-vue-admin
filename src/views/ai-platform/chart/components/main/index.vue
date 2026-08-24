<template>
  <main
    class="min-h-0 min-w-0 flex-1 grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-container"
  >
    <header
      class="h-56 min-w-0 flex items-center justify-between gap-10 border-0 border-b-1 border-color-1 border-solid px-20 max-md:px-14"
    >
      <a-popover
        v-model:open="chatInfoOpen"
        :show-arrow="false"
        placement="bottomLeft"
        :trigger="['click']"
      >
        <button
          type="button"
          class="h-38 max-w-[min(520px,70vw)] min-w-0 inline-flex items-center justify-center gap-4 rounded-8 border-0 bg-transparent px-10 text-15px text-main font-600 cursor-pointer transition-colors hover:bg-hover"
        >
          <span class="truncate">{{ currentTitle }}</span>
          <Icon name="i-lucide:chevron-down" :size="16" />
        </button>
        <template #content>
          <div class="w-280 p-10">
            <div class="text-sm text-main font-700">{{ currentTitle }}</div>
            <p class="mb-0 mt-6 text-xs text-secondary leading-20px">
              {{ currentDescription }}
            </p>
            <div class="mt-10 flex flex-wrap items-center gap-6">
              <span
                class="rounded-full bg-fill-tertiary px-8 py-3 text-11px text-secondary"
              >
                {{ statusLabel }}
              </span>
              <span
                class="rounded-full bg-primary-tint px-8 py-3 text-11px text-primary"
              >
                {{ model?.name ?? '默认模型' }}
              </span>
            </div>
          </div>
        </template>
      </a-popover>

      <div class="shrink-0 flex items-center gap-6">
        <a-popover
          v-model:open="configOpen"
          :show-arrow="false"
          placement="bottomRight"
          :trigger="['click']"
        >
          <button
            type="button"
            data-agent-config-trigger
            class="size-36 inline-flex items-center justify-center rounded-8 border-1 border-color-muted border-solid bg-transparent text-regular cursor-pointer transition-colors hover:bg-hover hover:text-main"
            :disabled="isRunning"
            title="生成参数"
          >
            <Icon name="i-lucide:sliders-horizontal" :size="16" />
          </button>
          <template #content>
            <div class="w-300 p-12">
              <div class="mb-10 flex items-center justify-between">
                <strong class="text-sm text-main">生成参数</strong>
                <button
                  type="button"
                  data-agent-config-reset
                  class="h-26 inline-flex items-center justify-center rounded-6 border-0 bg-transparent px-8 text-xs text-secondary cursor-pointer transition-colors hover:bg-hover hover:text-main"
                  @click="resetConfig"
                >
                  重置
                </button>
              </div>
              <div class="grid gap-14">
                <label class="grid gap-6">
                  <span
                    class="flex items-center justify-between text-xs text-secondary"
                  >
                    <span>创造性 Temperature</span>
                    <span class="text-main">
                      {{ configValue.temperature.toFixed(1) }}
                    </span>
                  </span>
                  <a-slider
                    :max="1"
                    :min="0"
                    :step="0.1"
                    :value="configValue.temperature"
                    @change="updateConfigValue('temperature', Number($event))"
                  />
                </label>
                <label class="grid gap-6">
                  <span
                    class="flex items-center justify-between text-xs text-secondary"
                  >
                    <span>采样范围 Top P</span>
                    <span class="text-main">{{
                      configValue.topP.toFixed(1)
                    }}</span>
                  </span>
                  <a-slider
                    :max="1"
                    :min="0"
                    :step="0.1"
                    :value="configValue.topP"
                    @change="updateConfigValue('topP', Number($event))"
                  />
                </label>
                <label class="grid gap-6">
                  <span class="text-xs text-secondary"
                    >最大输出 Max Tokens</span
                  >
                  <a-input-number
                    class="w-full"
                    :max="8192"
                    :min="512"
                    :step="256"
                    :value="configValue.maxTokens"
                    @change="
                      updateConfigValue('maxTokens', Number($event ?? 2048))
                    "
                  />
                </label>
              </div>
            </div>
          </template>
        </a-popover>

        <button
          type="button"
          class="h-36 inline-flex items-center justify-center gap-6 rounded-8 border-1 border-color-muted border-solid bg-transparent px-12 text-13px text-regular cursor-pointer transition-colors hover:bg-hover hover:text-main max-md:w-36 max-md:px-0 max-md:text-[0]"
          @click="emit('copy-share')"
        >
          <Icon name="i-lucide:share" :size="16" />
          分享
        </button>

        <a-popover
          v-model:open="actionOpen"
          :show-arrow="false"
          placement="bottomRight"
          :trigger="['click']"
        >
          <button
            type="button"
            data-agent-actions-trigger
            class="size-36 inline-flex items-center justify-center rounded-8 border-1 border-color-muted border-solid bg-transparent text-regular cursor-pointer transition-colors hover:bg-hover hover:text-main"
            title="更多操作"
          >
            <Icon name="i-lucide:ellipsis" :size="18" />
          </button>
          <template #content>
            <div class="w-172 p-6">
              <button
                v-for="action in headerActions"
                :key="action.key"
                type="button"
                :data-agent-header-action="action.key"
                class="h-34 w-full flex items-center gap-8 rounded-7 border-0 bg-transparent px-8 text-left text-13px text-regular cursor-pointer transition-colors hover:bg-hover hover:text-main disabled:cursor-not-allowed disabled:text-disabled"
                :class="
                  action.danger ? 'hover:bg-error-tint hover:text-error' : ''
                "
                :disabled="action.disabled"
                @click="handleHeaderAction(action.key)"
              >
                <Icon :name="action.icon" :size="15" />
                <span>{{ action.label }}</span>
              </button>
            </div>
          </template>
        </a-popover>
      </div>
    </header>

    <div class="agent-message-panel relative min-h-0 min-w-0">
      <Scrollbar
        ref="messagePanelRef"
        class="min-h-0 min-w-0"
        content-class="box-border mx-auto min-h-full min-w-0 w-full max-w-1680 px-40 pb-28 pt-38 max-2xl:max-w-1480 max-xl:max-w-none max-xl:px-28 max-md:px-16 max-md:pb-24 max-md:pt-24"
      >
        <div
          v-if="messages.length === 0"
          class="mx-auto mb-28 max-w-680 text-center"
        >
          <span
            class="size-52 inline-flex items-center justify-center rounded-14 border-1 border-color-muted border-solid bg-fill-tertiary text-main"
          >
            <Icon name="i-lucide:bot" :size="28" />
          </span>
          <h1
            class="mb-0 mt-18 text-28px text-main font-[650] leading-36px max-md:text-24px max-md:leading-32px"
          >
            今天想让 Agent 帮你做什么？
          </h1>
          <p
            class="mx-auto mb-0 mt-10 max-w-620 text-sm text-secondary leading-24px"
          >
            {{ currentDescription }}
          </p>
        </div>

        <div
          v-if="messages.length === 0"
          class="mb-34 grid grid-cols-4 gap-10 max-xl:grid-cols-2 max-md:grid-cols-1"
          aria-label="任务模板"
        >
          <button
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            type="button"
            class="min-w-0 flex items-start gap-10 rounded-12 border-1 border-color-muted border-solid bg-container p-12 text-left text-regular cursor-pointer transition-[background-color,border-color,transform] duration-motion-fast hover:-translate-y-1 hover:border-color-3 hover:bg-hover"
            @click="useSuggestion(suggestion.prompt)"
          >
            <Icon
              :name="suggestion.icon"
              :size="18"
              class="mt-2 shrink-0 text-main"
            />
            <span class="min-w-0">
              <strong class="block truncate text-sm text-main leading-20px">
                {{ suggestion.title }}
              </strong>
              <small
                class="mt-2 block truncate text-xs text-secondary leading-18px"
              >
                {{ suggestion.desc }}
              </small>
            </span>
          </button>
        </div>

        <div v-else class="agent-message-list grid gap-22">
          <div
            v-for="item in messages"
            :key="item.id"
            :data-agent-message-id="item.id"
            class="agent-message-anchor min-w-0"
          >
            <MessageItem
              :item="item"
              @copy-code="emit('copy-code', $event)"
              @copy="emit('copy-message', $event)"
              @delete="emit('delete-message', $event)"
              @edit="handleEditMessage"
              @feedback="emit('feedback-message', $event.id, $event.feedback)"
              @regenerate="emit('regenerate', $event)"
              @share="emit('share-message', $event)"
            />
          </div>

          <div v-if="canContinue" class="flex justify-center pt-2">
            <button
              type="button"
              class="h-34 inline-flex items-center gap-6 rounded-8 border-1 border-color-2 border-solid bg-container px-12 text-13px text-main cursor-pointer transition-colors hover:bg-hover"
              @click="emit('continue-generation')"
            >
              <Icon name="i-lucide:corner-down-right" :size="15" />
              继续生成
            </button>
          </div>
        </div>
      </Scrollbar>

      <Transition name="agent-minimap-fade">
        <MessageMiniMap
          v-if="miniMapItems.length > 1"
          :messages="miniMapItems"
          :container="miniMapContainer"
          @select="handleMiniMapSelect"
        />
      </Transition>
    </div>

    <section
      class="box-border mx-auto min-w-0 w-full max-w-1320 px-40 pb-18 max-2xl:max-w-1180 max-xl:px-28 max-md:px-16 max-sm:px-10 max-sm:pb-10"
    >
      <div
        class="box-border min-w-0 w-full rounded-18 border-1 border-color-2 border-solid bg-container p-12 shadow-[var(--w-shadow-elevated)]"
      >
        <div v-if="attachments.length" class="mb-8 flex flex-wrap gap-6">
          <button
            v-for="attachment in attachments"
            :key="attachment.id"
            type="button"
            class="max-w-220 inline-flex items-center gap-6 rounded-full border-1 border-color-2 border-solid bg-main px-9 py-5 text-xs text-regular cursor-pointer transition-colors hover:bg-hover"
            :aria-label="`移除附件：${attachment.name}`"
            :title="attachment.name"
            @click="emit('remove-attachment', attachment.id)"
          >
            <Icon name="i-lucide:file" :size="14" />
            <span class="truncate">{{ attachment.name }}</span>
            <Icon name="i-lucide:x" :size="13" />
          </button>
        </div>

        <div
          v-if="suggestions.length && messages.length > 0"
          class="mb-8 flex gap-6 overflow-x-auto pb-2"
        >
          <button
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            type="button"
            class="shrink-0 inline-flex items-center gap-6 rounded-full border-1 border-color-2 border-solid bg-main px-10 py-6 text-xs text-regular cursor-pointer transition-colors hover:(border-color-primary bg-hover text-main)"
            @click="useSuggestion(suggestion.prompt)"
          >
            <Icon :name="suggestion.icon" :size="14" />
            {{ suggestion.title }}
          </button>
        </div>

        <Editor
          ref="editorRef"
          v-model="prompt"
          :disabled="isRunning"
          @add-files="emit('add-attachments', $event)"
          @submit="handleSend"
        />

        <div
          class="mt-8 min-w-0 flex items-center justify-between gap-8 max-md:items-stretch max-sm:flex-col"
        >
          <div class="min-w-0 flex flex-wrap items-center gap-8 max-sm:w-full">
            <Attachment
              :disabled="isRunning"
              @select="emit('add-attachments', $event)"
            />
            <Model
              :model="model"
              :models="models"
              :disabled="isRunning"
              @select="emit('select-model', $event)"
            />
            <Tool
              :tools="tools"
              :disabled="isRunning"
              @toggle="emit('toggle-tool', $event.key, $event.enabled)"
            />
          </div>
          <div
            class="min-w-0 flex flex-wrap items-center gap-8 max-sm:w-full max-sm:justify-end"
          >
            <Issue
              :disabled="isRunning"
              :prompt="prompt"
              @optimize="handleOptimizePrompt"
            />
            <Send
              :disabled="!canSend"
              :loading="isRunning"
              @send="handleSend"
              @stop="emit('stop')"
            />
          </div>
        </div>
      </div>
      <p class="mb-0 mt-8 text-center text-xs text-secondary leading-18px">
        Agent 可能会出错，请核对重要信息和执行结果。
      </p>
    </section>

    <a-modal
      v-model:open="editModalOpen"
      title="编辑消息"
      ok-text="保存"
      cancel-text="取消"
      :ok-button-props="{ disabled: !editingContent.trim() }"
      @ok="saveEditingMessage"
    >
      <a-textarea
        v-model:value="editingContent"
        :auto-size="{ minRows: 4, maxRows: 8 }"
        placeholder="请输入消息内容"
      />
    </a-modal>
  </main>
</template>

<script setup lang="ts">
import Editor from './Editor.vue'
import Model from './Model.vue'
import Tool from './Tool.vue'
import Issue from './Issue.vue'
import Attachment from './Attachment.vue'
import MessageItem from './MessageItem.vue'
import MessageMiniMap from './MessageMiniMap/MessageMiniMap.vue'
import { useAgentMessageMiniMap } from './MessageMiniMap/useAgentMessageMiniMap'
import Send from './Send.vue'
import type { ScrollbarInstance } from '@/components'
import type {
  AgentGenerationConfig,
  AgentMessage,
  MainEmits,
  MainProps,
} from '../types'

const props = withDefaults(defineProps<MainProps>(), {
  attachments: () => [],
  messages: () => [],
  models: () => [],
  tools: () => [],
})

const emit = defineEmits<MainEmits>()

const prompt = shallowRef('')
const chatInfoOpen = shallowRef(false)
const actionOpen = shallowRef(false)
const configOpen = shallowRef(false)
const editingMessageId = shallowRef('')
const editingContent = shallowRef('')
const editModalOpen = shallowRef(false)
const editorRef = useTemplateRef<{ focus: () => void }>('editorRef')
const messagePanelRef = useTemplateRef<ScrollbarInstance>('messagePanelRef')
const {
  container: miniMapContainer,
  items: miniMapItems,
  handleSelect: handleMiniMapSelect,
} = useAgentMessageMiniMap({
  messages: () => props.messages,
  scrollbar: messagePanelRef,
})
let scrollFrame = 0

const currentTitle = computed(() => props.chat?.title ?? '新的 Agent 会话')
const currentDescription = computed(() => {
  return (
    props.chat?.description ??
    '选择模型、开启能力，然后输入你希望 Agent 完成的任务。'
  )
})
const statusLabel = computed(() => {
  const status = props.chat?.status ?? 'ready'
  return status === 'running' ? '运行中' : status === 'paused' ? '暂停' : '待命'
})
const isRunning = computed(() => props.chat?.status === 'running')
const canSend = computed(
  () => prompt.value.trim().length > 0 && !isRunning.value
)
const suggestions = computed(() => props.presets ?? [])
const configValue = computed<AgentGenerationConfig>(() => {
  return (
    props.config ?? {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048,
    }
  )
})
const canContinue = computed(() => {
  const lastMessage = props.messages.at(-1)
  return !isRunning.value && lastMessage?.role === 'assistant'
})
const headerActions = computed(() => [
  {
    key: 'continue' as const,
    label: '继续生成',
    icon: 'i-lucide:corner-down-right',
    disabled: !canContinue.value,
  },
  {
    key: 'clear' as const,
    label: '清空消息',
    icon: 'i-lucide:trash-2',
    danger: true,
    disabled: props.messages.length === 0,
  },
])

watch(
  () => [
    props.chat?.id,
    props.messages.length,
    props.messages.at(-1)?.id,
    props.messages.at(-1)?.status,
    props.messages.at(-1)?.content,
  ],
  ([chatId], previous) => {
    const isChatSwitch = chatId !== previous?.[0]
    void nextTick(() => {
      window.cancelAnimationFrame(scrollFrame)
      scrollFrame = window.requestAnimationFrame(() => {
        const target = messagePanelRef.value?.getScrollElement()
        if (!target) return
        target.scrollTo({
          top: target.scrollHeight,
          behavior: isChatSwitch ? 'auto' : 'smooth',
        })
      })
    })
  },
  { flush: 'post' }
)

watch(
  () => props.chat?.id,
  () => {
    prompt.value = ''
    if (!props.messages.length) {
      void nextTick(() => editorRef.value?.focus())
    }
  }
)

onBeforeUnmount(() => {
  window.cancelAnimationFrame(scrollFrame)
})

function useSuggestion(value: string) {
  prompt.value = value
}

function handleOptimizePrompt(value: string) {
  const source = value.trim()
  prompt.value = source
    ? `请以专业 Agent 的方式处理以下任务，并给出目标、步骤、风险和交付物：${source}`
    : '请帮我拆解一个可执行任务，输出目标、关键步骤、风险点和下一步行动。'
  emit('optimize-prompt', prompt.value)
}

function handleSend() {
  if (!canSend.value) return

  emit('send', prompt.value)
  prompt.value = ''
}

function updateConfigValue(key: keyof AgentGenerationConfig, value: number) {
  if (!Number.isFinite(value)) return
  emit('update-config', { [key]: value })
}

function resetConfig() {
  emit('update-config', {
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
  })
}

function handleHeaderAction(key: 'clear' | 'continue') {
  actionOpen.value = false
  if (key === 'clear') {
    emit('clear-messages')
    return
  }

  emit('continue-generation')
}

function handleEditMessage(message: AgentMessage) {
  editingMessageId.value = message.id
  editingContent.value = message.content
  editModalOpen.value = true
}

function saveEditingMessage() {
  const nextContent = editingContent.value.trim()
  if (!editingMessageId.value || !nextContent) return

  emit('edit-message', editingMessageId.value, nextContent)
  editModalOpen.value = false
  editingMessageId.value = ''
  editingContent.value = ''
}
</script>

<style scoped>
.agent-message-list {
  padding-right: 76px;
}

.agent-message-anchor {
  border-radius: 8px;
  transition:
    background-color var(--w-motion-duration-slow) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-slow) var(--w-motion-ease-standard);
}

.agent-message-anchor.is-minimap-target {
  background: rgb(var(--w-color-primary) / 7%);
  box-shadow: 0 0 0 1px rgb(var(--w-color-primary) / 16%);
}

.agent-minimap-fade-enter-active,
.agent-minimap-fade-leave-active {
  transition:
    opacity var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-moderate) var(--w-motion-ease-enter);
}

.agent-minimap-fade-enter-from,
.agent-minimap-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

@media (width <= 900px) {
  .agent-message-list {
    padding-right: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .agent-message-anchor,
  .agent-minimap-fade-enter-active,
  .agent-minimap-fade-leave-active {
    transition-duration: 1ms;
  }
}
</style>
