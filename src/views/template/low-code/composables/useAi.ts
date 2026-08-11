import { onBeforeUnmount, shallowRef } from 'vue'
import { createDesignerNode } from '../components/controls/registry'
import type {
  DesignerAiMessage,
  DesignerAiSuggestion,
  DesignerNode,
  DesignerNodeUpdate,
} from '../types'

interface UseLowCodeAiOptions {
  getSelectedNode: () => DesignerNode | undefined
  replaceNodes: (nodes: DesignerNode[]) => void
  updateSelectedNode: (update: DesignerNodeUpdate) => void
}

const createMessage = (
  role: DesignerAiMessage['role'],
  content: string
): DesignerAiMessage => ({
  content,
  createdAt: new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date()),
  id: `ai-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
  role,
})

export const aiSuggestions: DesignerAiSuggestion[] = [
  {
    id: 'lead-page',
    title: '线索表单',
    prompt:
      '生成一个线索采集页面，包含首屏、输入框、选择器、单选、日期、提交按钮和提醒',
    icon: 'i-lucide:clipboard-list',
  },
  {
    id: 'ops-page',
    title: '运营看板',
    prompt: '生成一个运营工作台，包含指标、趋势图、进度、标签、表格和图片卡片',
    icon: 'i-lucide:layout-dashboard',
  },
  {
    id: 'settings',
    title: '配置表单',
    prompt: '生成一个系统配置页面，包含开关、滑块、评分、数字输入和多行备注',
    icon: 'i-lucide:sliders-horizontal',
  },
]

function createNodesFromPrompt(prompt: string): DesignerNode[] {
  const lowerPrompt = prompt.toLowerCase()
  const isOps =
    prompt.includes('运营') ||
    prompt.includes('看板') ||
    lowerPrompt.includes('dashboard')
  const isSettings =
    prompt.includes('配置') ||
    prompt.includes('设置') ||
    lowerPrompt.includes('settings')
  const needsImage =
    prompt.includes('图片') ||
    prompt.includes('素材') ||
    lowerPrompt.includes('image')

  if (isSettings) {
    return [
      createDesignerNode('card', { id: 'ai-settings-card', title: '系统配置' }),
      createDesignerNode('switch', { id: 'ai-switch', title: '自动归档' }),
      createDesignerNode('slider', { id: 'ai-slider', title: '风险阈值' }),
      createDesignerNode('rate', { id: 'ai-rate', title: '服务评分' }),
      createDesignerNode('inputNumber', {
        id: 'ai-input-number',
        title: '预算上限',
      }),
      createDesignerNode('textarea', { id: 'ai-textarea', title: '配置说明' }),
    ]
  }

  if (isOps) {
    return [
      createDesignerNode('hero', { id: 'ai-ops-hero', title: '运营工作台' }),
      createDesignerNode('stats', { id: 'ai-ops-stats' }),
      createDesignerNode('chart', { id: 'ai-ops-chart' }),
      createDesignerNode('progress', {
        id: 'ai-ops-progress',
        title: '目标完成率',
      }),
      createDesignerNode('tag', { id: 'ai-ops-tag', title: '当前状态' }),
      createDesignerNode('image', { id: 'ai-ops-image', title: '活动素材' }),
      createDesignerNode('dataTable', { id: 'ai-ops-table' }),
    ]
  }

  const leadNodes = [
    createDesignerNode('hero', { id: 'ai-lead-hero', title: '线索采集页' }),
    createDesignerNode('flex', {
      id: 'ai-lead-fields',
      title: '线索字段容器',
      children: [
        createDesignerNode('input', { id: 'ai-lead-name', title: '客户名称' }),
        createDesignerNode('select', {
          id: 'ai-lead-source',
          title: '来源渠道',
        }),
        createDesignerNode('radioGroup', {
          id: 'ai-lead-priority',
          title: '线索等级',
        }),
        createDesignerNode('datePicker', {
          id: 'ai-lead-date',
          title: '跟进日期',
        }),
      ],
    }),
    createDesignerNode('checkbox', {
      id: 'ai-lead-checkbox',
      title: '同步到 CRM',
    }),
    createDesignerNode('button', { id: 'ai-lead-submit', title: '提交动作' }),
    createDesignerNode('alert', { id: 'ai-lead-alert', title: '录入提示' }),
  ]
  if (!needsImage) return leadNodes

  return [
    ...leadNodes.slice(0, -2),
    createDesignerNode('image', { id: 'ai-lead-image', title: '活动图片' }),
    ...leadNodes.slice(-2),
  ]
}

function createSelectedNodeUpdate(
  prompt: string,
  node: DesignerNode
): DesignerNodeUpdate {
  if (node.type === 'button') {
    return {
      props: { label: prompt.slice(0, 12) || '立即提交' },
      title: 'AI 优化按钮',
    }
  }
  if (node.type === 'input' || node.type === 'textarea') {
    return { props: { placeholder: `AI: ${prompt.slice(0, 18)}` } }
  }
  if (node.type === 'image') {
    return { props: { alt: prompt.slice(0, 20) || 'AI 优化图片' } }
  }
  if (node.type === 'progress') {
    return { props: { percent: 88, status: 'active' }, title: 'AI 优化进度' }
  }
  return {
    description: `AI 已根据“${prompt}”优化当前组件配置。`,
  }
}

export function useLowCodeAi(options: UseLowCodeAiOptions) {
  const aiBusy = shallowRef(false)
  const aiPrompt = shallowRef('')
  const aiMessages = shallowRef<DesignerAiMessage[]>([
    createMessage(
      'assistant',
      '描述你想要的页面，我会生成低代码 JSONSchema；选中组件后也可以只优化当前组件。'
    ),
  ])
  let pendingTimer: ReturnType<typeof setTimeout> | undefined

  onBeforeUnmount(() => {
    if (pendingTimer !== undefined) {
      clearTimeout(pendingTimer)
      pendingTimer = undefined
    }
  })

  async function generateFromPrompt(prompt = aiPrompt.value) {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || aiBusy.value) return

    aiBusy.value = true
    aiMessages.value = [
      ...aiMessages.value,
      createMessage('user', trimmedPrompt),
    ]
    await new Promise<void>((resolve) => {
      pendingTimer = setTimeout(resolve, 380)
    })
    pendingTimer = undefined

    const nodes = createNodesFromPrompt(trimmedPrompt)
    options.replaceNodes(nodes)
    aiMessages.value = [
      ...aiMessages.value,
      createMessage(
        'assistant',
        `已生成 ${nodes.length} 个低代码组件，并同步 JSONSchema。`
      ),
    ]
    aiPrompt.value = ''
    aiBusy.value = false
  }

  async function applyAiToSelectedNode(prompt = aiPrompt.value) {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || aiBusy.value) return

    const selectedNode = options.getSelectedNode()
    if (!selectedNode) {
      aiMessages.value = [
        ...aiMessages.value,
        createMessage('assistant', '请先选中一个组件，再让我优化它。'),
      ]
      return
    }

    aiBusy.value = true
    aiMessages.value = [
      ...aiMessages.value,
      createMessage('user', `优化选中组件：${trimmedPrompt}`),
    ]
    await new Promise<void>((resolve) => {
      pendingTimer = setTimeout(resolve, 280)
    })
    pendingTimer = undefined

    options.updateSelectedNode(
      createSelectedNodeUpdate(trimmedPrompt, selectedNode)
    )
    aiMessages.value = [
      ...aiMessages.value,
      createMessage(
        'assistant',
        `已只更新“${selectedNode.title}”，没有替换整个页面。`
      ),
    ]
    aiPrompt.value = ''
    aiBusy.value = false
  }

  function applySuggestion(prompt: string) {
    aiPrompt.value = prompt
    void generateFromPrompt(prompt)
  }

  return {
    aiBusy,
    aiMessages,
    aiPrompt,
    aiSuggestions,
    applyAiToSelectedNode,
    applySuggestion,
    generateFromPrompt,
  }
}
