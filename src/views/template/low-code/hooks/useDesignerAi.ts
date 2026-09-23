import { computed, ref, shallowRef } from 'vue'
import { tryOnScopeDispose } from '@vueuse/core'
import { cloneComponent, createNodeId } from '../core/schema'
import { generateLowCodePlan, lowCodeAiSuggestions } from '../core/ai'
import type { LowCodeAiPlan } from '../core/ai'
import type { DesignerApi } from './useDesigner'

/**
 * AI 对话消息
 */
export interface LowCodeAiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  /**
   * @desc 关联的生成方案，仅助手消息可能携带
   */
  planId?: string
}

function nowLabel() {
  return new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function createMessage(
  role: LowCodeAiMessage['role'],
  content: string,
  planId?: string
): LowCodeAiMessage {
  return {
    content,
    createdAt: nowLabel(),
    id: createNodeId(`ai-${role}`),
    planId,
    role,
  }
}

/**
 * 低代码 AI 生成
 *
 * 页面内声明式消费：输入自然语言 → 生成 Schema 方案 → 一键写入当前页面。
 * 生成基于内置规则模板，过程中不产生网络请求。
 *
 * @param designer 设计器实例
 * @returns AI 生成状态与操作
 */
export function useDesignerAi(designer: DesignerApi) {
  const prompt = ref('')
  const busy = ref(false)
  const messages = shallowRef<LowCodeAiMessage[]>([
    createMessage(
      'assistant',
      '用一句话描述你想要的页面，我会生成可直接编辑的低代码 Schema。例如「生成一个用户管理列表页，包含姓名、角色、状态」。'
    ),
  ])
  const plan = shallowRef<LowCodeAiPlan>()

  let timer: number | undefined
  tryOnScopeDispose(() => {
    if (timer) window.clearTimeout(timer)
  })

  const canApply = computed(
    () => !!plan.value && plan.value.components.length > 0
  )

  /**
   * 生成方案：写入对话并缓存结果，等待用户确认后再落库
   */
  function generate() {
    const text = prompt.value.trim()
    if (!text || busy.value) return

    messages.value = [...messages.value, createMessage('user', text)]
    prompt.value = ''
    busy.value = true
    plan.value = undefined

    if (timer) window.clearTimeout(timer)
    // 模拟推理耗时，保持与真实接入大模型一致的交互节奏
    timer = window.setTimeout(() => {
      const next = generateLowCodePlan(text, (type) =>
        designer.createNode(type)
      )
      plan.value = next
      messages.value = [
        ...messages.value,
        createMessage('assistant', next.summary, next.id),
      ]
      busy.value = false
      timer = undefined
    }, 520)
  }

  /**
   * 应用方案：替换当前页面的组件树，并记录到历史
   */
  function applyPlan() {
    const current = plan.value
    if (!current?.components.length) return false

    const components = current.components.map((node) => cloneComponent(node))
    designer.editSection('pages', 'AI 生成页面', (pages) => {
      const page = pages.find((item) => item.id === designer.activePageId.value)
      if (page) page.components = components
    })
    designer.clearSelection()
    messages.value = [
      ...messages.value,
      createMessage(
        'assistant',
        `已应用到「${designer.activePage.value.name}」，可在画布上继续拖拽调整。`
      ),
    ]
    plan.value = undefined
    return true
  }

  /**
   * 使用提示词模板
   *
   * @param value 模板提示词
   */
  function useSuggestion(value: string) {
    prompt.value = value
  }

  return {
    /** 提示词 */
    prompt,
    /** 是否正在生成 */
    busy,
    /** 对话消息 */
    messages,
    /** 待应用的方案 */
    plan,
    /** 是否可以应用 */
    canApply,
    /** 提示词模板 */
    suggestions: lowCodeAiSuggestions,
    generate,
    applyPlan,
    useSuggestion,
  }
}
