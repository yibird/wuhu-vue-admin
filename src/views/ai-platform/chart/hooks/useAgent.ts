import { computed, reactive, shallowRef } from 'vue'
import { useClipboard } from '@vueuse/core'
import { message, Modal } from 'antdv-next'
import { allowMockFallback, resolveLlmConfig } from '@/apis'
import { isApiError } from '@/utils'
import {
  createInitialChats,
  createInitialMessagesByChatId,
  createInitialTools,
  createModels,
  createPresets,
} from '../data'
import {
  createChat,
  createMessage,
  formatFileSize,
  formatMessageTime,
} from '../utils'
import { useAgentStream } from './useAgentStream'
import type { ChatCompletionMessage, ChatCompletionRequest } from '@/apis'
import type {
  AgentAttachment,
  AgentGenerationConfig,
  AgentMessage,
  AgentMessageFeedback,
  AgentModel,
  AgentPreset,
  AgentTool,
  ChatItem,
} from '../components/types'

const MAX_ATTACHMENTS = 5
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024

export function useAgent() {
  // --- Data (static, created once) ---
  const models: AgentModel[] = createModels()
  const presets: AgentPreset[] = createPresets()

  // --- Reactive state ---
  const tools = shallowRef<AgentTool[]>(createInitialTools())
  const chats = shallowRef<ChatItem[]>(createInitialChats())
  const activeChatId = shallowRef(chats.value[0]?.id ?? '')
  const selectedModelId = shallowRef(models[0]?.id ?? '')
  const draftAttachments = shallowRef<AgentAttachment[]>([])
  const generationConfig = reactive<AgentGenerationConfig>({
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
  })
  const messagesByChatId = shallowRef<Record<string, AgentMessage[]>>(
    createInitialMessagesByChatId()
  )

  // --- Streaming ---
  const {
    run: runStream,
    stop: stopStream,
    isStreaming,
  } = useAgentStream({
    onFlush: (chunks) => {
      const next = { ...messagesByChatId.value }
      let changed = false

      for (const chunk of chunks) {
        const list = next[chunk.chatId]
        if (!list) continue

        const index = list.findIndex((item) => item.id === chunk.messageId)
        if (index === -1) continue

        const updated = [...list]
        updated[index] = { ...updated[index], content: chunk.content }
        next[chunk.chatId] = updated
        changed = true
      }

      if (changed) messagesByChatId.value = next
    },
  })

  // --- Clipboard ---
  const { copy, isSupported } = useClipboard({ legacy: true })

  // --- Computed ---
  const activeChat = computed(() =>
    chats.value.find((item) => item.id === activeChatId.value)
  )

  const activeMessages = computed(
    () => messagesByChatId.value[activeChatId.value] ?? []
  )

  const activeModel = computed(
    () => models.find((item) => item.id === selectedModelId.value) ?? models[0]
  )

  // --- Internal helpers ---
  function setChatStatus(id: string, status: ChatItem['status']) {
    chats.value = chats.value.map((item) =>
      item.id === id ? { ...item, status, updateTime: '刚刚' } : item
    )
  }

  function updateChatMessageCount(id: string) {
    const count = messagesByChatId.value[id]?.length ?? 0
    chats.value = chats.value.map((item) =>
      item.id === id ? { ...item, messages: count, updateTime: '刚刚' } : item
    )
  }

  function appendMessage(chatId: string, messageItem: AgentMessage) {
    const currentMessages = messagesByChatId.value[chatId] ?? []
    messagesByChatId.value = {
      ...messagesByChatId.value,
      [chatId]: [...currentMessages, messageItem],
    }
    updateChatMessageCount(chatId)
  }

  function replaceMessage(chatId: string, messageItem: AgentMessage) {
    const currentMessages = messagesByChatId.value[chatId] ?? []
    messagesByChatId.value = {
      ...messagesByChatId.value,
      [chatId]: currentMessages.map((item) =>
        item.id === messageItem.id ? messageItem : item
      ),
    }
    updateChatMessageCount(chatId)
  }

  function getEnabledTools() {
    return tools.value.filter((item) => item.enabled)
  }

  function buildAgentReply(
    prompt: string,
    options: { regenerated?: boolean } = {}
  ) {
    const enabledTools = getEnabledTools()
    const toolText = enabledTools.length
      ? enabledTools.map((item) => item.label).join('、')
      : '基础对话'

    return [
      options.regenerated
        ? '这是重新生成后的版本。'
        : `我已收到任务：「${prompt}」。`,
      '',
      `当前模型：${activeModel.value?.name ?? '默认模型'}。已启用能力：${toolText}。`,
      `生成参数：temperature ${generationConfig.temperature}，top_p ${generationConfig.topP}，max_tokens ${generationConfig.maxTokens}。`,
      '',
      '执行路径：',
      '1. 明确目标、约束、输入材料和验收标准。',
      '2. 拆解关键步骤，标注依赖关系和优先级。',
      '3. 输出风险清单、备选方案和下一步行动。',
      '',
      '交付物建议：',
      '- 一页摘要：结论、影响、下一步。',
      '- 任务清单：负责人、截止时间、风险等级。',
      '- 验证计划：需要人工核对的数据与决策点。',
    ].join('\n')
  }

  async function startAgentReply(
    chatId: string,
    options: {
      prompt: string
      regenerated?: boolean
      replaceId?: string
      injectUserMessage?: boolean
    }
  ) {
    stopStream(chatId)

    const thinkingMessage = createMessage(
      'assistant',
      options.regenerated ? '正在重新生成回答...' : '正在分析任务上下文...',
      undefined,
      {
        model: activeModel.value?.name,
        status: 'thinking',
        tools: getEnabledTools().map((item) => item.label),
        regenerated: options.regenerated,
      }
    )

    if (options.replaceId) {
      replaceMessage(chatId, { ...thinkingMessage, id: options.replaceId })
    } else {
      appendMessage(chatId, thinkingMessage)
    }

    const messageId = options.replaceId ?? thinkingMessage.id
    const history: ChatCompletionMessage[] = (
      messagesByChatId.value[chatId] ?? []
    )
      .filter((item) => item.id !== messageId)
      .map((item) => ({ role: item.role, content: item.content }))

    if (options.injectUserMessage) {
      history.push({ role: 'user', content: options.prompt })
    }

    // 视图能力说明依赖 catalog,按需加载以免把 zod 打进首屏
    const { SYSTEM_PROMPT } = await import('../json-render/system-prompt')
    const request: ChatCompletionRequest = {
      model: activeModel.value?.id ?? resolveLlmConfig().model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
      stream: true,
      temperature: generationConfig.temperature,
      top_p: generationConfig.topP,
      max_tokens: generationConfig.maxTokens,
    }

    const result = await runStream({
      target: { chatId, messageId },
      request,
    })
    const failureText = isApiError(result.error)
      ? result.error.message
      : '请稍后重试'

    let content = result.content
    if (result.aborted) {
      if (!content.trim()) {
        content = '已停止生成。你可以调整提示词后重新发送，或点击重新生成。'
      }
    } else if (result.error) {
      if (allowMockFallback() && !content.trim()) {
        content = buildAgentReply(options.prompt, options)
      } else if (!content.trim()) {
        content = `生成失败：${failureText}`
      } else {
        content += `\n\n> 生成中断：${failureText}`
      }
    }

    replaceMessage(chatId, {
      ...thinkingMessage,
      id: messageId,
      content,
      createTime: formatMessageTime(),
      status: 'done',
    })
    setChatStatus(chatId, result.aborted ? 'paused' : 'ready')
  }

  function deleteChat(id: string) {
    stopStream(id)

    const nextChats = chats.value.filter((item) => item.id !== id)
    chats.value = nextChats
    const { [id]: _removedMessages, ...restMessages } = messagesByChatId.value
    messagesByChatId.value = restMessages

    if (activeChatId.value === id) {
      activeChatId.value =
        nextChats.find((item) => !item.archived)?.id ?? nextChats[0]?.id ?? ''
    }

    if (!nextChats.length) {
      handleCreateChat()
    }
  }

  function copyText(text: string, successText: string) {
    if (!isSupported.value) {
      message.warning('当前环境不支持复制')
      return
    }

    copy(text).then(() => {
      message.success(successText)
    })
  }

  // --- Event handlers ---
  function handleChatChange(id: string) {
    activeChatId.value = id
  }

  function handleCreateChat() {
    const chat = createChat()
    chats.value = [chat, ...chats.value]
    messagesByChatId.value = {
      ...messagesByChatId.value,
      [chat.id]: [],
    }
    activeChatId.value = chat.id
    draftAttachments.value = []
  }

  function handleDeleteChat(id: string) {
    deleteChat(id)
  }

  function handleArchiveChat(id: string) {
    chats.value = chats.value.map((item) =>
      item.id === id ? { ...item, archived: !item.archived } : item
    )
    message.success('会话状态已更新')
  }

  function handlePinChat(id: string) {
    chats.value = chats.value.map((item) =>
      item.id === id ? { ...item, pinned: !item.pinned } : item
    )
  }

  function handleRenameChat(id: string) {
    const chat = chats.value.find((item) => item.id === id)
    if (!chat) return

    const nextTitle = window.prompt('请输入新的会话名称', chat.title)?.trim()
    if (!nextTitle) return

    chats.value = chats.value.map((item) =>
      item.id === id ? { ...item, title: nextTitle, updateTime: '刚刚' } : item
    )
  }

  function handleSelectModel(id: string) {
    selectedModelId.value = id
  }

  function handleToggleTool(key: string, enabled: boolean) {
    tools.value = tools.value.map((item) =>
      item.key === key ? { ...item, enabled } : item
    )
  }

  function handleUpdateConfig(config: Partial<AgentGenerationConfig>) {
    Object.assign(generationConfig, config)
  }

  function handleAddAttachments(files: File[]) {
    const availableCount = MAX_ATTACHMENTS - draftAttachments.value.length
    if (availableCount <= 0) {
      message.warning(`最多添加 ${MAX_ATTACHMENTS} 个附件`)
      return
    }

    const oversizedFiles = files.filter(
      (file) => file.size > MAX_ATTACHMENT_SIZE
    )
    const acceptedFiles = files
      .filter((file) => file.size <= MAX_ATTACHMENT_SIZE)
      .slice(0, availableCount)

    if (oversizedFiles.length) {
      message.warning(`${oversizedFiles.length} 个附件超过 10MB，已跳过`)
    }
    if (files.length - oversizedFiles.length > availableCount) {
      message.warning(`最多添加 ${MAX_ATTACHMENTS} 个附件，超出部分已跳过`)
    }

    const nextAttachments = acceptedFiles.map((file) => ({
      id: `file-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type || file.name.split('.').pop() || 'file',
    }))

    draftAttachments.value = [...draftAttachments.value, ...nextAttachments]
    if (nextAttachments.length) {
      message.success(
        `已添加 ${nextAttachments.length} 个附件：${nextAttachments
          .map((item) => `${item.name}(${formatFileSize(item.size)})`)
          .join('、')}`
      )
    }
  }

  function handleRemoveAttachment(id: string) {
    draftAttachments.value = draftAttachments.value.filter(
      (item) => item.id !== id
    )
  }

  function handleOptimizePrompt(prompt: string) {
    message.success(prompt ? '已优化提示词' : '已生成任务模板')
  }

  function handleCopyShare() {
    const chat = activeChat.value
    if (!chat || !isSupported.value) {
      message.warning('当前环境不支持复制')
      return
    }

    copy(`${chat.title}\n${chat.description ?? ''}`).then(() => {
      message.success('会话摘要已复制')
    })
  }

  function handleCopyMessage(messageItem: AgentMessage) {
    copyText(messageItem.content, '消息内容已复制')
  }

  function handleCopyCode(code: string) {
    copyText(code, '代码已复制')
  }

  function handleShareMessage(messageItem: AgentMessage) {
    const chat = activeChat.value
    const roleText = messageItem.role === 'user' ? '你' : 'Agent'
    copyText(
      `${chat?.title ?? 'Agent 会话'}\n${roleText}：${messageItem.content}`,
      '消息分享内容已复制'
    )
  }

  function handleEditMessage(id: string, content: string) {
    const chatId = activeChatId.value
    const msgs = messagesByChatId.value[chatId] ?? []
    if (!msgs.some((item) => item.id === id)) return

    messagesByChatId.value = {
      ...messagesByChatId.value,
      [chatId]: msgs.map((item) =>
        item.id === id ? { ...item, content } : item
      ),
    }
    updateChatMessageCount(chatId)
    message.success('消息已更新')
  }

  function handleFeedbackMessage(id: string, feedback: AgentMessageFeedback) {
    const chatId = activeChatId.value
    const msgs = messagesByChatId.value[chatId] ?? []
    messagesByChatId.value = {
      ...messagesByChatId.value,
      [chatId]: msgs.map((item) =>
        item.id === id
          ? {
              ...item,
              feedback: item.feedback === feedback ? undefined : feedback,
            }
          : item
      ),
    }
  }

  function handleDeleteMessage(messageItem: AgentMessage) {
    const chatId = activeChatId.value
    Modal.confirm({
      title: '删除消息',
      content: '删除后无法在当前演示会话中恢复这条消息。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        if (messageItem.status === 'thinking') {
          stopStream(chatId)
          setChatStatus(chatId, 'paused')
        }

        const msgs = messagesByChatId.value[chatId] ?? []
        messagesByChatId.value = {
          ...messagesByChatId.value,
          [chatId]: msgs.filter((item) => item.id !== messageItem.id),
        }
        updateChatMessageCount(chatId)
      },
    })
  }

  function handleClearMessages() {
    const chat = activeChat.value
    if (!chat) return

    Modal.confirm({
      title: '清空当前会话',
      content: `确定清空「${chat.title}」的全部消息吗？`,
      okText: '清空',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        messagesByChatId.value = {
          ...messagesByChatId.value,
          [chat.id]: [],
        }
        updateChatMessageCount(chat.id)
      },
    })
  }

  function handleSend(prompt: string) {
    const content = prompt.trim()
    const chat = activeChat.value
    if (!content || !chat) return

    const userMessage = createMessage('user', content, undefined, {
      attachments: [...draftAttachments.value],
    })
    appendMessage(chat.id, userMessage)

    const titleShouldUpdate =
      (chat.messages ?? 0) === 0 || chat.title === '新的 Agent 会话'
    chats.value = chats.value.map((item) =>
      item.id === chat.id
        ? {
            ...item,
            title: titleShouldUpdate ? content.slice(0, 18) : item.title,
            description: content,
            status: 'running',
            tag: activeModel.value?.type ?? item.tag,
            archived: false,
            updateTime: '刚刚',
          }
        : item
    )

    draftAttachments.value = []
    void startAgentReply(chat.id, { prompt: content })
  }

  function handleRegenerate(messageItem: AgentMessage) {
    const chat = activeChat.value
    if (!chat || messageItem.role !== 'assistant') return

    const msgs = messagesByChatId.value[chat.id] ?? []
    const index = msgs.findIndex((item) => item.id === messageItem.id)
    const previousUserMessage = msgs
      .slice(0, index)
      .reverse()
      .find((item) => item.role === 'user')
    const prompt =
      previousUserMessage?.content ?? chat.description ?? chat.title

    setChatStatus(chat.id, 'running')
    void startAgentReply(chat.id, {
      prompt,
      regenerated: true,
      replaceId: messageItem.id,
    })
  }

  function handleContinueGeneration() {
    const chat = activeChat.value
    if (!chat) return

    setChatStatus(chat.id, 'running')
    void startAgentReply(chat.id, {
      prompt: '请继续上一个回答，补充更具体的执行细节。',
      injectUserMessage: true,
    })
  }

  function handleStop() {
    const chatId = activeChatId.value
    if (!isStreaming(chatId)) return

    // 收尾与状态落盘统一由 startAgentReply 处理
    stopStream(chatId)
  }

  return {
    // Static data
    models,
    presets,
    // Reactive state
    tools,
    chats,
    activeChatId,
    draftAttachments,
    generationConfig,
    messagesByChatId,
    // Computed
    activeChat,
    activeMessages,
    activeModel,
    // Handlers
    handleChatChange,
    handleCreateChat,
    handleDeleteChat,
    handleArchiveChat,
    handlePinChat,
    handleRenameChat,
    handleSelectModel,
    handleToggleTool,
    handleUpdateConfig,
    handleAddAttachments,
    handleRemoveAttachment,
    handleOptimizePrompt,
    handleCopyShare,
    handleCopyMessage,
    handleCopyCode,
    handleShareMessage,
    handleEditMessage,
    handleFeedbackMessage,
    handleDeleteMessage,
    handleClearMessages,
    handleSend,
    handleRegenerate,
    handleContinueGeneration,
    handleStop,
  }
}
