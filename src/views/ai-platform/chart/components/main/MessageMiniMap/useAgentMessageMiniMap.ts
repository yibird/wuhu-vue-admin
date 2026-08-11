import {
  nextTick,
  onBeforeUnmount,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from 'vue'
import type { AgentMessage } from '../../types'
import type { ScrollbarInstance } from '@/components'
import type { MessageMiniMapItem } from './types'

interface UseAgentMessageMiniMapOptions {
  messages: MaybeRefOrGetter<AgentMessage[]>
  scrollbar: MaybeRefOrGetter<ScrollbarInstance | null>
}

const PREVIEW_MAX_LENGTH = 56

export function useAgentMessageMiniMap(options: UseAgentMessageMiniMapOptions) {
  const container = shallowRef<HTMLElement | null>(null)
  const items = shallowRef<MessageMiniMapItem[]>([])
  let highlightedElement: HTMLElement | undefined
  let highlightTimer: number | undefined

  function syncItems() {
    const scrollbar = toValue(options.scrollbar)
    const contentElement = scrollbar?.getContentElement()
    container.value = scrollbar?.getScrollElement() ?? null

    if (!contentElement) {
      items.value = []
      return
    }

    const elements = new Map<string, HTMLElement>()
    for (const element of contentElement.querySelectorAll<HTMLElement>(
      '[data-agent-message-id]'
    )) {
      const id = element.dataset.agentMessageId
      if (id) elements.set(id, element)
    }

    items.value = toValue(options.messages).map((message) => ({
      id: message.id,
      type: getMessageType(message),
      preview: createMessagePreview(message),
      el: elements.get(message.id),
    }))
  }

  function handleSelect(item: MessageMiniMapItem) {
    highlightedElement?.classList.remove('is-minimap-target')
    window.clearTimeout(highlightTimer)

    highlightedElement = item.el
    highlightedElement?.classList.add('is-minimap-target')
    highlightTimer = window.setTimeout(() => {
      highlightedElement?.classList.remove('is-minimap-target')
      highlightedElement = undefined
    }, 620)
  }

  watch(
    () =>
      toValue(options.messages).map(
        (message) => `${message.id}:${message.role}:${message.content}`
      ),
    () => void nextTick(syncItems),
    { flush: 'post', immediate: true }
  )

  onBeforeUnmount(() => {
    window.clearTimeout(highlightTimer)
    highlightedElement?.classList.remove('is-minimap-target')
  })

  return {
    container,
    handleSelect,
    items,
  }
}

function getMessageType(message: AgentMessage): MessageMiniMapItem['type'] {
  if (message.role === 'user') return 'user'
  if (message.role === 'system') return 'tool'
  return 'assistant'
}

function createMessagePreview(message: AgentMessage) {
  const label =
    message.role === 'user'
      ? '我'
      : message.role === 'system'
        ? '系统'
        : 'Agent'
  const content = message.content.replace(/\s+/g, ' ').trim() || '[空消息]'
  const preview =
    content.length > PREVIEW_MAX_LENGTH
      ? `${content.slice(0, PREVIEW_MAX_LENGTH)}...`
      : content

  return `${label}: ${preview}`
}
