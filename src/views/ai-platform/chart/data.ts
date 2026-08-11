import type {
  AgentMessage,
  AgentModel,
  AgentPreset,
  AgentTool,
  ChatItem,
} from './components/types'
import { createMessage } from './utils'

export function createModels(): AgentModel[] {
  return [
    {
      id: 'qwen3-3b',
      name: 'qwen3-3b',
      type: 'CHAT',
      desc: '轻量对话与任务拆解',
      context: '32K',
      speed: '快',
    },
    {
      id: 'qwen3-32b',
      name: 'qwen3-32b',
      type: 'REASON',
      desc: '复杂分析与多步骤规划',
      context: '128K',
      speed: '稳',
    },
    {
      id: 'gpt-4.1',
      name: 'gpt-4.1',
      type: 'CHAT',
      desc: '通用写作与代码辅助',
      context: '1M',
      speed: '均衡',
    },
  ]
}

export function createPresets(): AgentPreset[] {
  return [
    {
      id: 'plan',
      title: '生成执行计划',
      desc: '拆解目标、依赖、风险和里程碑',
      icon: 'i-lucide:list-checks',
      prompt: '请把这个目标拆成可执行计划，并标注优先级、依赖、风险和交付物。',
    },
    {
      id: 'data',
      title: '分析业务数据',
      desc: '提炼趋势、异常原因和行动建议',
      icon: 'i-lucide:chart-no-axes-combined',
      prompt: '请基于这些数据分析关键趋势、异常点、可能原因和下一步建议。',
    },
    {
      id: 'meeting',
      title: '整理会议纪要',
      desc: '输出摘要、决策和待办清单',
      icon: 'i-lucide:clipboard-check',
      prompt: '请把会议内容整理成摘要、决策事项、待办清单和风险提醒。',
    },
    {
      id: 'code',
      title: '审查代码变更',
      desc: '检查风险、边界和测试缺口',
      icon: 'i-lucide:code-2',
      prompt: '请从行为风险、可维护性、性能和测试覆盖角度审查这段代码。',
    },
  ]
}

export function createInitialTools(): AgentTool[] {
  return [
    {
      key: 'search',
      label: '联网搜索',
      icon: 'i-lucide:search',
      enabled: true,
      desc: '补充实时资料和来源线索',
    },
    {
      key: 'code',
      label: '代码执行',
      icon: 'i-lucide:terminal',
      enabled: false,
      desc: '模拟运行脚本或分析代码片段',
    },
    {
      key: 'document',
      label: '文档解析',
      icon: 'i-lucide:file-text',
      enabled: true,
      desc: '读取附件并提炼结构化信息',
    },
    {
      key: 'vision',
      label: '图片理解',
      icon: 'i-lucide:image',
      enabled: false,
      desc: '分析截图、设计稿和图片素材',
    },
  ]
}

export function createInitialChats(): ChatItem[] {
  return [
    {
      id: '1',
      title: '数据分析助手',
      description: '汇总运营指标，生成周报结论与后续动作。',
      createTime: '今天 09:42',
      updateTime: '今天 09:43',
      tag: '分析',
      status: 'ready',
      messages: 2,
      pinned: true,
    },
    {
      id: '2',
      title: '代码审查 Agent',
      description: '检查变更风险、样式一致性和测试覆盖。',
      createTime: '昨天 18:20',
      updateTime: '昨天 18:21',
      tag: '研发',
      status: 'ready',
      messages: 2,
    },
    {
      id: '3',
      title: '活动方案策划',
      description: '根据用户画像生成投放文案与执行清单。',
      createTime: '周一 14:05',
      updateTime: '周一 14:06',
      tag: '营销',
      status: 'paused',
      messages: 2,
    },
  ]
}

export function createInitialMessagesByChatId(): Record<
  string,
  AgentMessage[]
> {
  return {
    1: [
      createMessage(
        'user',
        '请围绕「数据分析助手」给我一个可执行方案。',
        '今天 09:42'
      ),
      createMessage(
        'assistant',
        [
          '我会先确认业务目标和数据口径，再输出指标摘要、异常解释和下一步动作。',
          '',
          '建议执行路径：',
          '1. 确认核心指标口径和时间范围。',
          '2. 对比本周、上周和同期数据，标出异常波动。',
          '3. 把结论拆成负责人、截止时间和复盘指标。',
        ].join('\n'),
        '今天 09:43',
        {
          model: 'qwen3-3b',
          tools: ['联网搜索', '文档解析'],
        }
      ),
    ],
    2: [
      createMessage('user', '帮我检查这次页面改动的风险。', '昨天 18:20'),
      createMessage(
        'assistant',
        [
          '重点检查三类风险：组件事件是否闭环、响应式状态是否单一来源、样式是否继续使用项目语义 token。',
          '',
          '```ts',
          'const checks = ["typecheck", "lint", "interaction smoke"]',
          '```',
          '',
          '建议补充一次类型检查和一次页面交互验证。',
        ].join('\n'),
        '昨天 18:21',
        {
          model: 'qwen3-32b',
          tools: ['代码执行'],
        }
      ),
    ],
    3: [
      createMessage('user', '为新用户召回活动做一个方案。', '周一 14:05'),
      createMessage(
        'assistant',
        '方案可以拆成用户分层、触达节奏、权益策略和复盘指标。先用活跃度与最近消费时间分层，再给每层配置不同文案和优惠门槛。',
        '周一 14:06',
        {
          model: 'gpt-4.1',
          tools: ['联网搜索'],
        }
      ),
    ],
  }
}
