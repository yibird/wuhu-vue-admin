import type { Message } from '../../../types'
import type { MaybeRefOrGetter } from 'vue'

/**
 * 虚拟列表渲染项:消息或对方正在输入的占位
 */
export type MessageListItem =
  | { type: 'message'; message: Message }
  | { type: 'typing'; id: 'typing-indicator' }

interface UseMessageListOptions {
  /**
   * @desc 会话消息
   */
  messages: MaybeRefOrGetter<Message[]>
  /**
   * @desc 进入会话时的未读数量
   */
  unreadCount: MaybeRefOrGetter<number>
  /**
   * @desc 对方是否正在输入
   */
  typing: MaybeRefOrGetter<boolean>
  /**
   * @desc 是否紧凑消息流
   */
  compact: MaybeRefOrGetter<boolean>
  /**
   * @desc 获取虚拟列表的滚动元素
   */
  getScrollElement: () => HTMLElement | null
  /**
   * @desc 滚动到指定下标
   */
  scrollToIndex: (index: number) => void
  /**
   * @desc 自动滚动到底部时通知父级
   */
  onScrollToBottom?: () => void
  /**
   * @desc 未读定位完成
   */
  onUnreadClear?: () => void
}

/** 距离底部小于该值视为"在底部" */
const BOTTOM_THRESHOLD = 100
/** 离开底部超过该距离才显示"滚动到底部"按钮,避免轻微滚动就出现 */
const SCROLL_BUTTON_THRESHOLD = 500
/** 平滑滚动期间忽略滚动事件的时长 */
const AUTO_SCROLL_LOCK = 100

/**
 * 消息列表的视图模型与滚动行为
 *
 * 负责:渲染项拼装、行高估算、未读定位、自动滚动到底部与滚动按钮显隐。
 * 组件只保留模板与虚拟列表的引用绑定。
 */
export function useMessageList(options: UseMessageListOptions) {
  const showScrollButton = ref(false)
  const isAtBottom = ref(true)
  const isAutoScrolling = ref(false)
  const unreadDismissed = shallowRef(false)
  const firstUnreadId = shallowRef('')
  let scrollResetTimer: number | undefined

  // 进入会话时的未读锚点只取一次:后续新增消息会让"最后 N 条"的区间漂移
  const initialUnreadCount = toValue(options.unreadCount)
  const initialMessages = toValue(options.messages)
  if (initialUnreadCount > 0 && initialMessages.length > 0) {
    const index = Math.max(0, initialMessages.length - initialUnreadCount)
    firstUnreadId.value = initialMessages[index]?.id ?? ''
  }

  const renderedItems = computed<MessageListItem[]>(() => {
    const items: MessageListItem[] = toValue(options.messages).map(
      (message) => ({
        type: 'message',
        message,
      })
    )
    if (toValue(options.typing)) {
      items.push({ type: 'typing', id: 'typing-indicator' })
    }
    return items
  })

  const showUnread = computed(
    () =>
      toValue(options.unreadCount) > 0 &&
      Boolean(firstUnreadId.value) &&
      !unreadDismissed.value
  )

  function estimateRowSize(item: MessageListItem) {
    if (item.type === 'typing') return 58
    return toValue(options.compact) ? 72 : 92
  }

  function getRowKey(item: MessageListItem) {
    return item.type === 'typing' ? item.id : item.message.id
  }

  function handleScroll(event: Event) {
    const target = event.target as HTMLElement
    const distanceToBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight
    isAtBottom.value = distanceToBottom < BOTTOM_THRESHOLD
    showScrollButton.value =
      !isAtBottom.value && distanceToBottom > SCROLL_BUTTON_THRESHOLD
  }

  function scrollToBottom() {
    const container = options.getScrollElement()
    if (!container || isAutoScrolling.value) return

    isAutoScrolling.value = true
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
    options.onScrollToBottom?.()
    window.clearTimeout(scrollResetTimer)
    scrollResetTimer = window.setTimeout(() => {
      isAutoScrolling.value = false
    }, AUTO_SCROLL_LOCK)
  }

  function scrollToFirstUnread() {
    const index = renderedItems.value.findIndex(
      (item) =>
        item.type === 'message' && item.message.id === firstUnreadId.value
    )
    if (index < 0) return

    unreadDismissed.value = true
    options.scrollToIndex(index)
    options.onUnreadClear?.()
  }

  function scrollToNewMessage() {
    nextTick(() => {
      if (isAtBottom.value && !isAutoScrolling.value) {
        scrollToBottom()
      }
    })
  }

  onMounted(() => {
    nextTick(scrollToBottom)
  })

  onBeforeUnmount(() => {
    window.clearTimeout(scrollResetTimer)
  })

  watch(
    () => toValue(options.messages).length,
    () => scrollToNewMessage()
  )

  watch(
    () => toValue(options.typing),
    () => scrollToNewMessage()
  )

  return {
    renderedItems,
    showUnread,
    showScrollButton,
    estimateRowSize,
    getRowKey,
    handleScroll,
    scrollToBottom,
    scrollToFirstUnread,
  }
}
