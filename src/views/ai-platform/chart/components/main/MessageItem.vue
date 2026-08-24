<template>
  <article
    data-testid="agent-message"
    class="group mx-auto grid w-full max-w-1320 gap-10 max-2xl:max-w-1180 max-xl:max-w-full"
    :class="
      isUser
        ? 'grid-cols-[minmax(0,1fr)_32px] justify-items-end max-md:grid-cols-[minmax(0,1fr)_28px]'
        : 'grid-cols-[32px_minmax(0,1fr)] justify-items-start max-md:grid-cols-[28px_minmax(0,1fr)]'
    "
  >
    <div
      v-if="!isUser"
      class="size-32 inline-flex items-center justify-center rounded-full border-1 border-main border-solid bg-[rgb(var(--w-text-main))] text-white text-xs font-600 max-md:size-28"
    >
      <Icon
        :name="
          item.status === 'thinking'
            ? 'i-lucide:loader-circle'
            : 'i-lucide:sparkles'
        "
        :class="{ 'animate-spin': item.status === 'thinking' }"
        :size="16"
      />
    </div>

    <div
      class="min-w-0 max-w-[min(100%,840px)] text-15px text-main leading-26px max-2xl:max-w-[min(100%,780px)] max-xl:max-w-[min(100%,720px)] max-md:max-w-full"
      :class="isUser ? 'col-start-1 row-start-1 justify-self-end' : ''"
    >
      <div
        class="overflow-hidden rounded-16"
        :class="
          isUser
            ? 'bg-primary text-white shadow-[0_8px_20px_rgb(var(--w-color-primary)_/_18%)]'
            : 'border-1 border-color-2 border-solid bg-main'
        "
      >
        <div
          v-for="(segment, index) in contentSegments"
          :key="`${segment.type}-${index}`"
        >
          <p
            v-if="segment.type === 'text'"
            class="m-0 whitespace-pre-line px-14 py-10"
            :class="[
              index > 0 ? 'pt-0' : '',
              item.status === 'thinking' ? 'animate-pulse' : '',
            ]"
          >
            {{ segment.content }}
          </p>
          <div v-else class="border-0 border-t-1 border-color-2 border-solid">
            <div
              class="flex items-center justify-between gap-8 bg-container-secondary px-12 py-7 text-12px text-secondary"
            >
              <span class="truncate">{{ segment.lang || 'code' }}</span>
              <button
                type="button"
                aria-label="复制代码"
                class="h-24 inline-flex items-center gap-4 rounded-6 border-0 bg-transparent px-7 text-xs text-secondary cursor-pointer transition-colors hover:bg-hover hover:text-main"
                @click="emit('copy-code', segment.content)"
              >
                <Icon name="i-lucide:copy" :size="13" />
                复制
              </button>
            </div>
            <pre
              class="m-0 max-h-360 overflow-auto bg-[rgb(15_23_42)] p-12 text-12px text-white leading-20px"
            ><code>{{ segment.content }}</code></pre>
          </div>
        </div>
      </div>

      <div
        v-if="item.attachments?.length"
        class="mt-8 flex flex-wrap gap-6"
        :class="isUser ? 'justify-end' : ''"
      >
        <span
          v-for="attachment in item.attachments"
          :key="attachment.id"
          class="inline-flex max-w-220 items-center gap-6 rounded-full bg-fill-tertiary px-8 py-4 text-xs text-secondary"
          :aria-label="`附件：${attachment.name}`"
        >
          <Icon name="i-lucide:file" :size="13" />
          <span class="truncate">{{ attachment.name }}</span>
        </span>
      </div>

      <div
        class="mt-6 flex flex-wrap items-center gap-6 text-11px text-muted"
        :class="isUser ? 'justify-end text-right' : ''"
      >
        <span>{{ item.createTime }}</span>
        <span v-if="item.model">{{ item.model }}</span>
        <span v-if="item.regenerated">已重新生成</span>
        <span v-if="item.tools?.length">{{ item.tools.join(' / ') }}</span>
      </div>

      <div
        v-if="actions.length"
        class="mt-5 flex items-center gap-4 opacity-0 transition-opacity duration-motion-fast group-focus-within:opacity-100 group-hover:opacity-100"
        :class="isUser ? 'justify-end' : ''"
      >
        <button
          v-for="action in actions"
          :key="action.key"
          type="button"
          class="size-28 inline-flex items-center justify-center rounded-7 border-1 border-color-muted border-solid bg-container text-muted cursor-pointer transition-colors hover:bg-hover hover:text-main focus-visible:border-primary focus-visible:text-primary focus-visible:outline-none"
          :class="[
            action.danger ? 'hover:bg-error-tint hover:text-error' : '',
            action.active ? 'border-primary text-primary' : '',
          ]"
          :title="action.label"
          @click="handleAction(action.key)"
        >
          <Icon :name="action.icon" :size="14" />
        </button>
      </div>
    </div>

    <div
      v-if="isUser"
      class="col-start-2 row-start-1 size-32 inline-flex items-center justify-center rounded-full border-1 border-color-muted border-solid bg-fill-tertiary text-xs text-main font-600 max-md:size-28"
    >
      你
    </div>
  </article>
</template>

<script setup lang="ts">
import type { AgentMessage, AgentMessageFeedback } from '../types'

interface MessageSegment {
  type: 'code' | 'text'
  content: string
  lang?: string
}

const props = defineProps<{
  item: AgentMessage
}>()

const emit = defineEmits<{
  (e: 'copy', message: AgentMessage): void
  (e: 'copy-code', code: string): void
  (e: 'delete', message: AgentMessage): void
  (e: 'edit', message: AgentMessage): void
  (e: 'feedback', payload: { id: string; feedback: AgentMessageFeedback }): void
  (e: 'regenerate', message: AgentMessage): void
  (e: 'share', message: AgentMessage): void
}>()

const isUser = computed(() => props.item.role === 'user')
const contentSegments = computed(() => parseMessageContent(props.item.content))

type MessageActionKey =
  | 'copy'
  | 'delete'
  | 'dislike'
  | 'edit'
  | 'like'
  | 'regenerate'
  | 'share'

interface MessageAction {
  key: MessageActionKey
  label: string
  icon: string
  active?: boolean
  danger?: boolean
}

const actions = computed<MessageAction[]>(() => {
  if (props.item.status === 'thinking') return []

  const baseActions: MessageAction[] = [
    {
      key: 'copy',
      label: '复制',
      icon: 'i-lucide:copy',
    },
    {
      key: 'share',
      label: '分享',
      icon: 'i-lucide:share-2',
    },
    {
      key: 'edit',
      label: '编辑',
      icon: 'i-lucide:pencil',
    },
  ]

  if (isUser.value) {
    return [
      ...baseActions,
      {
        key: 'delete',
        label: '删除',
        icon: 'i-lucide:trash-2',
        danger: true,
      },
    ]
  }

  return [
    ...baseActions,
    {
      key: 'regenerate',
      label: '重新生成',
      icon: 'i-lucide:refresh-cw',
    },
    {
      key: 'like',
      label: '喜欢',
      icon: 'i-lucide:thumbs-up',
      active: props.item.feedback === 'like',
    },
    {
      key: 'dislike',
      label: '不喜欢',
      icon: 'i-lucide:thumbs-down',
      active: props.item.feedback === 'dislike',
    },
    {
      key: 'delete',
      label: '删除',
      icon: 'i-lucide:trash-2',
      danger: true,
    },
  ]
})

function parseMessageContent(content: string): MessageSegment[] {
  const segments: MessageSegment[] = []
  const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockPattern.exec(content))) {
    const [raw, lang = '', code = ''] = match
    const text = content.slice(lastIndex, match.index)
    if (text.trim()) {
      segments.push({ type: 'text', content: text.trim() })
    }
    segments.push({ type: 'code', lang, content: code.trimEnd() })
    lastIndex = match.index + raw.length
  }

  const restText = content.slice(lastIndex)
  if (restText.trim()) {
    segments.push({ type: 'text', content: restText.trim() })
  }

  return segments.length ? segments : [{ type: 'text', content }]
}

function handleAction(action: MessageActionKey) {
  if (action === 'like' || action === 'dislike') {
    emit('feedback', { id: props.item.id, feedback: action })
    return
  }

  const emitMap: Record<string, string> = {
    copy: 'copy',
    share: 'share',
    edit: 'edit',
    delete: 'delete',
    regenerate: 'regenerate',
  }
  emit(emitMap[action] as Parameters<typeof emit>[0], props.item)
}
</script>
