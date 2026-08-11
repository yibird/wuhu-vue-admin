<script setup lang="ts">
import { onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { useMediaQuery } from '@vueuse/core'
import { Icon } from '@/components'
import type { ScrollbarInstance } from '@/components'

type AiRole = 'assistant' | 'user'

interface AiMessage {
  id: string
  role: AiRole
  content: string
  createdAt: string
}

interface PromptAction {
  key: string
  title: string
  prompt: string
  icon: string
}

const show = defineModel('show', { default: false })
const isNarrowScreen = useMediaQuery('(max-width: 768px)')
const drawerSize = computed(() => (isNarrowScreen.value ? '100%' : 860))

const inputText = shallowRef('')
const activeMode = shallowRef('运营')
const thinking = shallowRef(false)
const messageListRef = useTemplateRef<ScrollbarInstance>('messageList')
let replyTimer: number | null = null
onUnmounted(() => {
  if (replyTimer) clearTimeout(replyTimer)
})

const promptActions: PromptAction[] = [
  {
    key: 'summary',
    title: '总结当前页面',
    prompt: '请总结当前后台页面的核心信息，并列出需要关注的风险。',
    icon: 'i-lucide:panel-top',
  },
  {
    key: 'sql',
    title: '生成查询思路',
    prompt: '我想分析本周客户转化下降原因，请给出数据查询和排查思路。',
    icon: 'i-lucide:database',
  },
  {
    key: 'copy',
    title: '优化运营文案',
    prompt: '请帮我把这段运营通知改得更清晰、克制、有行动指引。',
    icon: 'i-lucide:text',
  },
  {
    key: 'check',
    title: '排查异常',
    prompt: '下载任务失败时，我应该按什么顺序排查网络、权限和数据问题？',
    icon: 'i-lucide:stethoscope',
  },
]

const modes = ['运营', '数据', '研发', '客服']

const messages = shallowRef<AiMessage[]>([
  {
    id: 'assistant-welcome',
    role: 'assistant',
    content:
      '你好，我可以帮你梳理页面信息、生成排查步骤、整理运营文案，或把复杂任务拆成可执行清单。',
    createdAt: dayjs().format('HH:mm'),
  },
])

const canSend = computed(
  () => inputText.value.trim().length > 0 && !thinking.value
)

function scrollToBottom() {
  nextTick(() => {
    const element = messageListRef.value?.getScrollElement()
    element?.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
  })
}

function sendPrompt(prompt = inputText.value) {
  const content = prompt.trim()
  if (!content || thinking.value) return

  messages.value = [
    ...messages.value,
    {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: dayjs().format('HH:mm'),
    },
  ]
  inputText.value = ''
  thinking.value = true
  scrollToBottom()

  replyTimer = window.setTimeout(() => {
    replyTimer = null
    messages.value = [
      ...messages.value,
      {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: createMockAnswer(content),
        createdAt: dayjs().format('HH:mm'),
      },
    ]
    thinking.value = false
    scrollToBottom()
  }, 520)
}

function createMockAnswer(prompt: string) {
  if (prompt.includes('下载') || prompt.includes('失败')) {
    return [
      '建议先按三层排查：',
      '1. 网络层：确认资源地址、跨域策略和超时配置。',
      '2. 权限层：确认当前账号是否具备导出或下载权限。',
      '3. 数据层：确认文件是否生成完成、校验码是否可用。',
      '如果是批量任务，可以先重试失败项，再清理已完成项保持列表可读。',
    ].join('\n')
  }

  if (prompt.includes('文案')) {
    return '可以按“结论先行 + 时间范围 + 行动入口 + 影响说明”重写。示例：本周客户转化数据已更新，请在今日 18:00 前完成异常渠道复核；如发现口径问题，请在任务中心提交修正任务。'
  }

  if (prompt.includes('页面') || prompt.includes('总结')) {
    return '当前页面可重点关注三类信息：进行中的任务、异常状态和需要人工确认的配置。建议把失败/等待任务放在首屏，并保留一键复制上下文，方便协作排查。'
  }

  return `我会按「${activeMode.value}」视角处理：先明确目标，再拆成输入、处理、输出和风险四块。下一步建议把问题补充为具体对象、时间范围和期望结果。`
}

function usePromptAction(action: PromptAction) {
  sendPrompt(action.prompt)
}

function clearMessages() {
  messages.value = messages.value.slice(0, 1)
}

function handleEnter(event: KeyboardEvent) {
  if (event.shiftKey) return
  event.preventDefault()
  sendPrompt()
}
</script>

<template>
  <a-drawer
    v-model:open="show"
    title="AI 助手"
    :size="drawerSize"
    placement="right"
    closable
    :classes="{ body: 'p-0! overflow-hidden!' }"
  >
    <div class="h-full min-h-0 overflow-hidden bg-page">
      <div
        class="h-full min-h-0 grid grid-cols-[260px_minmax(0,1fr)] max-md:grid-cols-1"
      >
        <aside
          class="min-h-0 border-r-1 border-r-solid border-color-1 bg-container p-14 max-md:hidden"
        >
          <div class="mb-14">
            <div class="text-sm text-main font-700">工作模式</div>
            <div class="mt-10 grid grid-cols-2 gap-8">
              <button
                v-for="mode in modes"
                :key="mode"
                type="button"
                class="button h-34 rounded-6 border-1 border-color-2 border-solid text-sm transition-colors"
                :class="
                  activeMode === mode
                    ? 'border-color-primary bg-primary-tint text-primary'
                    : 'bg-container text-secondary hover:bg-hover'
                "
                @click="activeMode = mode"
              >
                {{ mode }}
              </button>
            </div>
          </div>

          <div class="text-sm text-main font-700">快捷能力</div>
          <div class="mt-10 grid gap-8">
            <button
              v-for="action in promptActions"
              :key="action.key"
              type="button"
              class="button min-h-54 justify-start gap-10 rounded-8 border-1 border-color-1 border-solid bg-container px-10 text-left transition-colors hover:(border-color-primary bg-hover)"
              @click="usePromptAction(action)"
            >
              <span
                class="size-32 shrink-0 flex items-center justify-center rounded-7 icon-primary-soft"
              >
                <Icon :name="action.icon" :size="16" />
              </span>
              <span class="truncate text-sm text-main">{{ action.title }}</span>
            </button>
          </div>
        </aside>

        <section class="min-h-0 flex flex-col">
          <div
            class="h-58 shrink-0 flex items-center justify-between border-b-1 border-b-solid border-color-1 bg-container px-14"
          >
            <div>
              <div class="text-sm text-main font-700">智能工作台</div>
              <div class="mt-2 text-xs text-secondary">
                当前模式：{{ activeMode }}
              </div>
            </div>
            <a-button size="small" @click="clearMessages">
              <template #icon>
                <Icon name="i-lucide:trash-2" :size="14" />
              </template>
              清空
            </a-button>
          </div>

          <Scrollbar
            ref="messageList"
            class="min-h-0 flex-1"
            content-class="min-h-full p-16"
          >
            <div class="mx-auto flex max-w-680 flex-col gap-12">
              <div
                v-for="item in messages"
                :key="item.id"
                class="flex gap-10"
                :class="item.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[82%] rounded-10 px-12 py-10 shadow-all-sm"
                  :class="
                    item.role === 'user'
                      ? 'bg-primary text-white rounded-tr-2'
                      : 'bg-container text-main rounded-tl-2'
                  "
                >
                  <div class="whitespace-pre-wrap text-sm leading-22px">
                    {{ item.content }}
                  </div>
                  <div
                    class="mt-6 text-11px"
                    :class="
                      item.role === 'user' ? 'text-white/72' : 'text-secondary'
                    "
                  >
                    {{ item.createdAt }}
                  </div>
                </div>
              </div>

              <div v-if="thinking" class="flex justify-start">
                <div
                  class="inline-flex items-center gap-6 rounded-10 bg-container px-12 py-9 text-sm text-secondary shadow-all-sm"
                >
                  <Icon
                    name="i-lucide:loader-circle"
                    :size="15"
                    class="animate-spin"
                  />
                  正在生成
                </div>
              </div>
            </div>
          </Scrollbar>

          <div
            class="shrink-0 border-t-1 border-t-solid border-color-1 bg-container p-14"
          >
            <div class="mx-auto max-w-680">
              <textarea
                v-model="inputText"
                class="box-border block max-h-120 min-h-74 w-full resize-none rounded-10 border-1 border-color-2 border-solid bg-container px-12 py-10 text-sm text-main outline-none transition-[border-color,box-shadow] placeholder:text-placeholder focus:(border-color-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)/10%)])"
                placeholder="输入问题或选择快捷能力"
                @keydown.enter="handleEnter"
              />
              <div class="mt-10 flex items-center justify-between gap-10">
                <div class="flex min-w-0 flex-wrap gap-6 md:hidden">
                  <button
                    v-for="action in promptActions.slice(0, 2)"
                    :key="action.key"
                    type="button"
                    class="button rounded-6 bg-fill-quaternary px-8 py-5 text-xs text-secondary"
                    @click="usePromptAction(action)"
                  >
                    {{ action.title }}
                  </button>
                </div>
                <a-button
                  type="primary"
                  :disabled="!canSend"
                  @click="sendPrompt()"
                >
                  <template #icon>
                    <Icon name="i-lucide:send" :size="15" />
                  </template>
                  发送
                </a-button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </a-drawer>
</template>
