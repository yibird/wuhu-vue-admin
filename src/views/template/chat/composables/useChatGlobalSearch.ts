import { refDebounced } from '@vueuse/core'
import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type {
  Contact,
  Conversation,
  GlobalSearchTab,
  Message,
} from '../components/types'

export interface MessageSearchResult {
  conversation: Conversation
  message: Message
  preview: string
}

interface UseChatGlobalSearchOptions {
  activeTab: Ref<GlobalSearchTab>
  contacts: MaybeRefOrGetter<readonly Contact[]>
  conversations: MaybeRefOrGetter<readonly Conversation[]>
  groups: MaybeRefOrGetter<readonly Conversation[]>
  messagesByConversation: MaybeRefOrGetter<Record<string, Message[]>>
  query: Ref<string>
}

/**
 * 聚合聊天全局搜索的索引和派生结果。
 * 输入先去抖，再统一扫描联系人、群聊和消息，避免弹窗组件承担大段数据计算。
 */
export function useChatGlobalSearch(options: UseChatGlobalSearchOptions) {
  const searchQuery = refDebounced(options.query, 120)
  const normalizedQuery = computed(() => normalizeText(searchQuery.value))
  const hasQuery = computed(() => Boolean(normalizedQuery.value))

  const allConversations = computed(() => {
    const items = new Map<string, Conversation>()
    for (const conversation of toValue(options.conversations)) {
      items.set(conversation.id, conversation)
    }
    for (const group of toValue(options.groups)) {
      items.set(group.id, group)
    }
    return [...items.values()]
  })

  const conversationById = computed(
    () => new Map(allConversations.value.map((item) => [item.id, item]))
  )

  const contactResults = computed(() => {
    if (!normalizedQuery.value) return []
    return toValue(options.contacts)
      .filter((contact) =>
        containsKeyword(
          [
            contact.name,
            contact.title,
            contact.department,
            contact.company,
            contact.email,
            contact.phone,
            contact.location,
            contact.remark,
            ...(contact.tags ?? []),
          ],
          normalizedQuery.value
        )
      )
      .slice(0, 12)
      .map((contact) => ({
        contact,
        meta: contactMeta(contact),
        tags: contact.tags?.slice(0, 3) ?? [],
      }))
  })

  const groupResults = computed(() => {
    if (!normalizedQuery.value) return []
    return allConversations.value
      .filter((conversation) => conversation.type === 'group')
      .filter((group) =>
        containsKeyword(
          [
            group.title,
            group.groupInfo?.name,
            group.groupInfo?.category,
            group.lastMessage,
          ],
          normalizedQuery.value
        )
      )
      .slice(0, 12)
  })

  const messageResults = computed<MessageSearchResult[]>(() => {
    if (!normalizedQuery.value) return []

    const results: MessageSearchResult[] = []
    for (const [conversationId, messages] of Object.entries(
      toValue(options.messagesByConversation)
    )) {
      const conversation = conversationById.value.get(conversationId)
      if (!conversation) continue

      for (const message of messages) {
        if (
          !containsKeyword(
            [message.content, message.senderInfo?.name, conversation.title],
            normalizedQuery.value
          )
        ) {
          continue
        }

        results.push({
          conversation,
          message,
          preview: createMessagePreview(message),
        })
        if (results.length >= 30) return results
      }
    }
    return results
  })

  const messageTotalCount = computed(() =>
    Object.values(toValue(options.messagesByConversation)).reduce(
      (sum, messages) => sum + messages.length,
      0
    )
  )
  const resultCounts = computed(() => ({
    contacts: contactResults.value.length,
    groups: groupResults.value.length,
    messages: messageResults.value.length,
  }))
  const totalResultCount = computed(
    () =>
      resultCounts.value.contacts +
      resultCounts.value.groups +
      resultCounts.value.messages
  )
  const activeResultCount = computed(() => {
    if (options.activeTab.value === 'all') return totalResultCount.value
    return resultCounts.value[options.activeTab.value]
  })
  const searchTabs = computed(() => [
    { key: 'all', label: `全部 ${totalResultCount.value}` },
    { key: 'contacts', label: `联系人 ${resultCounts.value.contacts}` },
    { key: 'groups', label: `群聊 ${resultCounts.value.groups}` },
    { key: 'messages', label: `消息 ${resultCounts.value.messages}` },
  ])
  const scopeItems = computed(() => [
    {
      key: 'contacts' as const,
      label: '找人',
      icon: 'i-lucide:user-round-search',
      description: `${toValue(options.contacts).length} 位联系人`,
    },
    {
      key: 'groups' as const,
      label: '找群',
      icon: 'i-lucide:users-round',
      description: `${allConversations.value.filter((item) => item.type === 'group').length} 个群聊`,
    },
    {
      key: 'messages' as const,
      label: '搜聊天记录',
      icon: 'i-lucide:messages-square',
      description: `${messageTotalCount.value} 条消息`,
    },
  ])
  const visibleSections = computed(() => ({
    contacts:
      options.activeTab.value === 'contacts' ||
      (options.activeTab.value === 'all' && contactResults.value.length > 0),
    groups:
      options.activeTab.value === 'groups' ||
      (options.activeTab.value === 'all' && groupResults.value.length > 0),
    messages:
      options.activeTab.value === 'messages' ||
      (options.activeTab.value === 'all' && messageResults.value.length > 0),
  }))
  const resultSummary = computed(() => {
    if (!hasQuery.value) return '输入关键词后开始全局检索'
    if (activeResultCount.value === 0) return '没有找到匹配结果'
    return `找到 ${activeResultCount.value} 条匹配结果`
  })

  return {
    activeResultCount,
    contactResults,
    groupResults,
    hasQuery,
    messageResults,
    resultCounts,
    resultSummary,
    scopeItems,
    searchTabs,
    visibleSections,
    groupMeta,
    messageSenderName,
  }
}

function normalizeText(value?: string | number) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

function containsKeyword(
  fields: Array<string | number | undefined>,
  keyword: string
) {
  return fields.some((field) => normalizeText(field).includes(keyword))
}

function createMessagePreview(message: Message) {
  const content = getMessageContentLabel(message)
  const normalized = content.replace(/\s+/g, ' ').trim()
  return normalized.length > 88 ? `${normalized.slice(0, 88)}...` : normalized
}

function getMessageContentLabel(message: Message) {
  switch (message.type) {
    case 'image':
      return '[图片]'
    case 'voice':
      return '[语音消息]'
    case 'file':
      return `[文件] ${message.content.split('/').at(-1) ?? message.content}`
    default:
      return message.content
  }
}

function contactMeta(contact: Contact) {
  return [contact.title, contact.department, contact.company]
    .filter(Boolean)
    .join(' / ')
}

function groupMeta(group: Conversation) {
  const count = group.groupInfo?.memberCount
  return count ? `${count} 位成员` : '群聊'
}

function messageSenderName(message: Message) {
  return message.senderId === 'me' ? '我' : (message.senderInfo?.name ?? '对方')
}
