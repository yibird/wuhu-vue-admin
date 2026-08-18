<script setup lang="ts">
import { computed, reactive, shallowRef } from 'vue'
import message from 'antdv-next/dist/message/index'
import { useRoute, useRouter } from 'vue-router'
import { agentResources } from '../data'
import type { AgentStatus } from '../types'

interface AgentFormState {
  name: string
  description: string
  status: AgentStatus
  tags: string[]
  owner: string
  model: string
  temperature: number
  maxTokens: number
  enableMemory: boolean
  enableTools: string[]
  knowledgeBases: string[]
  prompt: string
  guardrails: string[]
  publishChecklist: string[]
}

const route = useRoute()
const router = useRouter()
const activeTab = shallowRef('profile')

const routeId = computed(() =>
  typeof route.query.id === 'string' ? route.query.id : undefined
)
const sourceAgent = computed(
  () =>
    agentResources.find((item) => item.id === routeId.value) ??
    agentResources[0]
)

const formState = reactive<AgentFormState>({
  name: sourceAgent.value?.name ?? '新建 Agent',
  description: sourceAgent.value?.description ?? '',
  status: sourceAgent.value?.status ?? 'draft',
  tags: [...(sourceAgent.value?.tags ?? ['运营助手'])],
  owner: sourceAgent.value?.creator.name ?? '系统管理员',
  model: 'GPT-4.1',
  temperature: 0.35,
  maxTokens: 4096,
  enableMemory: true,
  enableTools: ['knowledgeSearch', 'workflowAction'],
  knowledgeBases: ['产品能力手册', '经营指标口径库'],
  prompt:
    '你是企业内部 Agent，请基于可信知识库回答问题。遇到不确定信息时说明依据和置信度，不要编造业务规则。',
  guardrails: ['敏感字段脱敏', '仅引用授权知识库', '输出包含依据来源'],
  publishChecklist: ['intent', 'permission', 'fallback'],
})

const statusOptions = [
  { label: '运行中', value: 'online' },
  { label: '草稿', value: 'draft' },
  { label: '已停用', value: 'offline' },
]

const modelOptions = [
  { label: 'GPT-4.1', value: 'GPT-4.1' },
  { label: 'GPT-4.1 Mini', value: 'GPT-4.1 Mini' },
  { label: 'Claude Sonnet', value: 'Claude Sonnet' },
  { label: '企业私有模型', value: 'Private LLM' },
]

const toolOptions = [
  { label: '知识库检索', value: 'knowledgeSearch' },
  { label: '工作流执行', value: 'workflowAction' },
  { label: '报表查询', value: 'reportQuery' },
  { label: '工单创建', value: 'ticketCreate' },
]

const knowledgeBaseOptions = [
  { label: '产品能力手册', value: '产品能力手册' },
  { label: '经营指标口径库', value: '经营指标口径库' },
  { label: '财务制度知识库', value: '财务制度知识库' },
  { label: '客服 FAQ 知识库', value: '客服 FAQ 知识库' },
]

const checklistOptions = [
  {
    label: '意图识别测试通过',
    value: 'intent',
    description: '覆盖主要业务问法，避免命中错误流程。',
  },
  {
    label: '权限边界已校验',
    value: 'permission',
    description: '不同角色只能访问授权知识和动作。',
  },
  {
    label: '兜底策略可用',
    value: 'fallback',
    description: '低置信度时给出澄清问题或人工转接。',
  },
  {
    label: '审计日志已接入',
    value: 'audit',
    description: '关键调用可追踪、可回放、可定位。',
  },
]

const previewStatusClass = computed(() => {
  const classMap: Record<AgentStatus, string> = {
    online: 'bg-success/10 text-success',
    draft: 'bg-primary/10 text-primary',
    offline: 'bg-fill-tertiary text-secondary',
  }
  return classMap[formState.status]
})

const previewStatusLabel = computed(() => {
  const labelMap: Record<AgentStatus, string> = {
    online: '运行中',
    draft: '草稿',
    offline: '已停用',
  }
  return labelMap[formState.status]
})

function goBack() {
  void router.push('/ai-platform/agent')
}

function saveDraft() {
  message.success('Agent 配置已保存为草稿')
}

function publishAgent() {
  message.success('发布检查已提交，等待校验通过后上线')
}
</script>

<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <header
        class="flex flex-none items-center justify-between gap-12 border-b-1 border-color-2 border-b-solid bg-container px-16 py-12"
      >
        <div class="min-w-0 flex items-center gap-12">
          <a-button type="text" @click="goBack">
            <template #icon>
              <Icon name="i-lucide:arrow-left" />
            </template>
          </a-button>
          <span
            class="size-42 flex flex-none items-center justify-center rounded-8 bg-primary/10 text-primary"
          >
            <Icon name="i-lucide:bot" :size="22" />
          </span>
          <div class="min-w-0">
            <h1 class="m-0 truncate text-lg text-main font-700">编辑 Agent</h1>
            <p class="m-0 mt-3 truncate text-xs text-secondary">
              调整角色设定、模型参数、工具权限和发布检查。
            </p>
          </div>
        </div>

        <div class="flex flex-none items-center gap-8">
          <a-button @click="saveDraft">
            <template #icon>
              <Icon name="i-lucide:save" />
            </template>
            保存草稿
          </a-button>
          <a-button type="primary" @click="publishAgent">
            <template #icon>
              <Icon name="i-lucide:rocket" />
            </template>
            发布
          </a-button>
        </div>
      </header>

      <main class="min-h-0 flex-1 overflow-y-auto p-12 sm:p-16">
        <div class="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section
            class="min-w-0 rounded-8 border-1 border-color-2 border-solid bg-container"
          >
            <a-tabs v-model:active-key="activeTab" class="px-14">
              <a-tab-pane key="profile" tab="基础信息">
                <a-form :model="formState" layout="vertical" class="pb-14 pt-4">
                  <div class="grid grid-cols-1 gap-x-12 lg:grid-cols-2">
                    <a-form-item label="Agent 名称" name="name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="请输入 Agent 名称"
                      />
                    </a-form-item>
                    <a-form-item label="负责人" name="owner">
                      <a-input
                        v-model:value="formState.owner"
                        placeholder="请输入负责人"
                      />
                    </a-form-item>
                    <a-form-item label="状态" name="status">
                      <a-select
                        v-model:value="formState.status"
                        :options="statusOptions"
                      />
                    </a-form-item>
                    <a-form-item label="标签" name="tags">
                      <a-select
                        v-model:value="formState.tags"
                        mode="tags"
                        placeholder="输入后回车创建标签"
                      />
                    </a-form-item>
                  </div>
                  <a-form-item label="描述" name="description">
                    <a-textarea
                      v-model:value="formState.description"
                      :auto-size="{ minRows: 3, maxRows: 6 }"
                      placeholder="说明 Agent 能力、适用场景和用户对象"
                    />
                  </a-form-item>
                </a-form>
              </a-tab-pane>

              <a-tab-pane key="orchestration" tab="模型编排">
                <a-form :model="formState" layout="vertical" class="pb-14 pt-4">
                  <div class="grid grid-cols-1 gap-x-12 lg:grid-cols-2">
                    <a-form-item label="模型" name="model">
                      <a-select
                        v-model:value="formState.model"
                        :options="modelOptions"
                      />
                    </a-form-item>
                    <a-form-item label="上下文长度" name="maxTokens">
                      <a-input-number
                        v-model:value="formState.maxTokens"
                        class="w-full"
                        :min="1024"
                        :max="128000"
                        :step="512"
                      />
                    </a-form-item>
                    <a-form-item label="温度" name="temperature">
                      <div class="flex items-center gap-12">
                        <a-slider
                          v-model:value="formState.temperature"
                          class="min-w-0 flex-1"
                          :max="1"
                          :min="0"
                          :step="0.01"
                        />
                        <span class="w-44 text-right text-sm text-main">
                          {{ formState.temperature.toFixed(2) }}
                        </span>
                      </div>
                    </a-form-item>
                    <a-form-item label="长期记忆" name="enableMemory">
                      <a-switch v-model:checked="formState.enableMemory" />
                    </a-form-item>
                    <a-form-item label="可用工具" name="enableTools">
                      <a-select
                        v-model:value="formState.enableTools"
                        mode="multiple"
                        :options="toolOptions"
                      />
                    </a-form-item>
                    <a-form-item label="绑定知识库" name="knowledgeBases">
                      <a-select
                        v-model:value="formState.knowledgeBases"
                        mode="multiple"
                        :options="knowledgeBaseOptions"
                      />
                    </a-form-item>
                  </div>
                  <a-form-item label="系统提示词" name="prompt">
                    <a-textarea
                      v-model:value="formState.prompt"
                      :auto-size="{ minRows: 5, maxRows: 10 }"
                    />
                  </a-form-item>
                </a-form>
              </a-tab-pane>

              <a-tab-pane key="guardrails" tab="安全与发布">
                <div class="pb-14 pt-4">
                  <div
                    class="mb-12 rounded-8 border-1 border-color-2 border-solid bg-page p-12"
                  >
                    <div class="mb-10 flex items-center justify-between gap-8">
                      <div>
                        <div class="text-sm text-main font-700">安全护栏</div>
                        <div class="mt-2 text-xs text-secondary">
                          控制 Agent 可访问的数据范围、输出边界和审计要求
                        </div>
                      </div>
                      <a-tag color="blue" :bordered="false">策略集</a-tag>
                    </div>
                    <a-select
                      v-model:value="formState.guardrails"
                      mode="tags"
                      class="w-full"
                      placeholder="输入安全策略"
                    />
                  </div>

                  <a-checkbox-group
                    v-model:value="formState.publishChecklist"
                    class="w-full"
                  >
                    <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
                      <label
                        v-for="item in checklistOptions"
                        :key="item.value"
                        class="flex gap-10 rounded-8 border-1 border-color-2 border-solid bg-page p-12"
                      >
                        <a-checkbox :value="item.value" />
                        <span class="min-w-0">
                          <span class="block text-sm text-main font-700">
                            {{ item.label }}
                          </span>
                          <span class="mt-3 block text-xs text-secondary">
                            {{ item.description }}
                          </span>
                        </span>
                      </label>
                    </div>
                  </a-checkbox-group>
                </div>
              </a-tab-pane>
            </a-tabs>
          </section>

          <aside class="min-w-0 space-y-12">
            <section
              class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
            >
              <div class="mb-12 flex items-start gap-10">
                <span
                  class="size-44 flex flex-none items-center justify-center rounded-8 bg-primary/10 text-primary"
                >
                  <Icon
                    :name="sourceAgent?.icon ?? 'i-lucide:bot'"
                    :size="22"
                  />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-8">
                    <h2 class="m-0 truncate text-md text-main font-700">
                      {{ formState.name }}
                    </h2>
                    <span
                      class="rounded-full px-8 py-2 text-xs"
                      :class="previewStatusClass"
                    >
                      {{ previewStatusLabel }}
                    </span>
                  </div>
                  <p class="m-0 mt-6 line-clamp-3 text-sm text-regular">
                    {{ formState.description }}
                  </p>
                </div>
              </div>
              <div class="flex flex-wrap gap-6">
                <a-tag
                  v-for="tag in formState.tags"
                  :key="tag"
                  class="m-0"
                  :bordered="false"
                >
                  {{ tag }}
                </a-tag>
              </div>
            </section>

            <section
              class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
            >
              <div class="mb-12 flex items-center justify-between">
                <h2 class="m-0 text-md text-main font-700">运行摘要</h2>
                <Icon name="i-lucide:activity" class="text-primary" />
              </div>
              <div class="space-y-10">
                <div
                  v-for="metric in sourceAgent?.metrics ?? []"
                  :key="metric.label"
                  class="flex items-center justify-between rounded-8 bg-page px-10 py-8"
                >
                  <span class="text-xs text-secondary">{{ metric.label }}</span>
                  <strong class="text-sm text-main">{{ metric.value }}</strong>
                </div>
              </div>
            </section>

            <section
              class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
            >
              <div class="mb-12 flex items-center justify-between">
                <h2 class="m-0 text-md text-main font-700">上线建议</h2>
                <a-tag color="green" :bordered="false">生产检查</a-tag>
              </div>
              <div class="space-y-8 text-sm text-regular">
                <div class="flex items-start gap-8">
                  <Icon
                    name="i-lucide:check-circle-2"
                    class="mt-2 text-success"
                  />
                  <span>发布前完成 20 条以上业务问法回归测试。</span>
                </div>
                <div class="flex items-start gap-8">
                  <Icon
                    name="i-lucide:shield-check"
                    class="mt-2 text-primary"
                  />
                  <span>高风险工具动作建议开启二次确认。</span>
                </div>
                <div class="flex items-start gap-8">
                  <Icon name="i-lucide:history" class="mt-2 text-warning" />
                  <span>保留至少 30 天调用日志，便于追溯和优化。</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  </WView>
</template>
