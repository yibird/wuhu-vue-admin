<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type {
  WorkflowEdge,
  WorkflowJsonSchema,
  WorkflowNode,
  WorkflowNodeKind,
  WorkflowRunLog,
  WorkflowTestCase,
} from '../types'

interface WorkflowIssue {
  id: string
  title: string
  desc: string
  nodeId?: string
  tone: 'error' | 'warning' | 'info'
}

interface WorkflowTemplate {
  id: string
  title: string
  desc: string
  icon: string
  nodes: WorkflowNodeKind[]
}

interface WorkflowDraft {
  id: string
  title: string
  savedAt: string
  desc: string
}

const props = defineProps<{
  edges: WorkflowEdge[]
  isRunning: boolean
  nodes: WorkflowNode[]
  runLogs: WorkflowRunLog[]
  selectedNodeId: string
  selectedTestCaseId: string
  testCases: WorkflowTestCase[]
  workflowSchema: WorkflowJsonSchema
}>()

const emit = defineEmits<{
  applyTemplate: [nodes: WorkflowNodeKind[]]
  copySchema: []
  downloadSchema: []
  duplicateNode: [id: string]
  locateNode: [id: string]
  run: []
  selectTestCase: [id: string]
}>()

const activeKey = shallowRef('validate')
const drafts = shallowRef<WorkflowDraft[]>([])

const templates: WorkflowTemplate[] = [
  {
    id: 'rag-answer',
    title: 'RAG 问答',
    desc: '知识库、模型、消息回复',
    icon: 'i-lucide:book-open-text',
    nodes: ['knowledge', 'llm', 'message'],
  },
  {
    id: 'risk-review',
    title: '风险拦截',
    desc: '条件分支、代码校验、人工提示',
    icon: 'i-lucide:shield-alert',
    nodes: ['condition', 'code', 'message'],
  },
  {
    id: 'tool-agent',
    title: '工具 Agent',
    desc: 'Agent、HTTP、插件、数据库',
    icon: 'i-lucide:bot',
    nodes: ['agent', 'http', 'plugin', 'database'],
  },
]

const nodeIds = computed(() => new Set(props.nodes.map((node) => node.id)))

const validationIssues = computed<WorkflowIssue[]>(() => {
  const issues: WorkflowIssue[] = []
  const incoming = new Set(props.edges.map((edge) => edge.target))
  const outgoing = new Set(props.edges.map((edge) => edge.source))
  const startNode = props.nodes.find((node) => node.data.kind === 'start')
  const endNode = props.nodes.find((node) => node.data.kind === 'end')

  if (!startNode) {
    issues.push({
      id: 'missing-start',
      title: '缺少开始节点',
      desc: '流程需要明确输入入口。',
      tone: 'error',
    })
  }

  if (!endNode) {
    issues.push({
      id: 'missing-end',
      title: '缺少结束节点',
      desc: '流程需要明确输出边界。',
      tone: 'error',
    })
  }

  for (const node of props.nodes) {
    if (node.data.kind !== 'start' && !incoming.has(node.id)) {
      issues.push({
        id: `${node.id}-no-input`,
        nodeId: node.id,
        title: `${node.data.title} 没有输入`,
        desc: '请补充上游连线，或确认它是独立触发节点。',
        tone: 'warning',
      })
    }

    if (node.data.kind !== 'end' && !outgoing.has(node.id)) {
      issues.push({
        id: `${node.id}-no-output`,
        nodeId: node.id,
        title: `${node.data.title} 没有输出`,
        desc: '请补充下游连线，避免执行链路中断。',
        tone: 'warning',
      })
    }
  }

  for (const edge of props.edges) {
    if (!nodeIds.value.has(edge.source) || !nodeIds.value.has(edge.target)) {
      issues.push({
        id: `${edge.id}-dangling`,
        title: '存在无效连线',
        desc: `${edge.source} -> ${edge.target}`,
        tone: 'error',
      })
    }
  }

  return issues
})

const warningLogs = computed(() => {
  return props.runLogs.filter((log) => log.level === 'warning').slice(0, 3)
})

const selectedTestCase = computed(() => {
  return (
    props.testCases.find((item) => item.id === props.selectedTestCaseId) ??
    props.testCases[0]
  )
})

function saveDraft() {
  drafts.value = [
    {
      id: `draft-${Date.now()}`,
      title: props.workflowSchema.title || '未命名流程',
      savedAt: new Date().toISOString(),
      desc: `${props.nodes.length} 节点 / ${props.edges.length} 连线`,
    },
    ...drafts.value,
  ].slice(0, 6)
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function getIssueClass(tone: WorkflowIssue['tone']) {
  return {
    error: 'workflow-governance-panel__issue--error',
    info: 'workflow-governance-panel__issue--info',
    warning: 'workflow-governance-panel__issue--warning',
  }[tone]
}
</script>

<template>
  <section class="workflow-governance-panel">
    <header class="workflow-governance-panel__header">
      <div>
        <span>Governance</span>
        <h3>运行治理</h3>
      </div>
      <a-button
        size="small"
        type="primary"
        :loading="isRunning"
        @click="emit('run')"
      >
        <template #icon>
          <Icon name="i-lucide:play" />
        </template>
        模拟运行
      </a-button>
    </header>

    <a-tabs v-model:active-key="activeKey" size="small">
      <a-tab-pane key="validate" tab="校验">
        <div class="workflow-governance-panel__stack">
          <a-select
            :value="selectedTestCaseId"
            size="small"
            class="w-full"
            @change="(value: unknown) => emit('selectTestCase', String(value))"
          >
            <a-select-option
              v-for="item in testCases"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>

          <div class="workflow-governance-panel__case">
            <strong>{{ selectedTestCase?.title }}</strong>
            <span>{{ selectedTestCase?.description }}</span>
          </div>

          <a-button
            v-for="issue in validationIssues"
            :key="issue.id"
            type="text"
            class="workflow-governance-panel__issue !h-auto !w-full !justify-start !whitespace-normal"
            :class="getIssueClass(issue.tone)"
            @click="issue.nodeId && emit('locateNode', issue.nodeId)"
          >
            <Icon
              :name="
                issue.tone === 'error'
                  ? 'i-lucide:circle-alert'
                  : 'i-lucide:triangle-alert'
              "
              :size="16"
            />
            <span>
              <strong>{{ issue.title }}</strong>
              <small>{{ issue.desc }}</small>
            </span>
          </a-button>

          <a-empty v-if="!validationIssues.length" description="流程校验通过" />
        </div>
      </a-tab-pane>

      <a-tab-pane key="templates" tab="模板">
        <div class="workflow-governance-panel__stack">
          <a-button
            v-for="template in templates"
            :key="template.id"
            type="text"
            class="workflow-governance-panel__template !h-auto !w-full !justify-start !whitespace-normal"
            @click="emit('applyTemplate', template.nodes)"
          >
            <Icon :name="template.icon" :size="18" />
            <span>
              <strong>{{ template.title }}</strong>
              <small>{{ template.desc }}</small>
            </span>
          </a-button>
        </div>
      </a-tab-pane>

      <a-tab-pane key="drafts" tab="草稿">
        <div class="workflow-governance-panel__stack">
          <div class="workflow-governance-panel__actions">
            <a-button size="small" @click="saveDraft">
              <template #icon>
                <Icon name="i-lucide:bookmark-plus" />
              </template>
              保存草稿
            </a-button>
            <a-button size="small" @click="emit('copySchema')">
              <template #icon>
                <Icon name="i-lucide:copy" />
              </template>
              复制
            </a-button>
            <a-button size="small" @click="emit('downloadSchema')">
              <template #icon>
                <Icon name="i-lucide:download" />
              </template>
              导出
            </a-button>
          </div>

          <a-button
            v-if="selectedNodeId"
            type="text"
            class="workflow-governance-panel__template !h-auto !w-full !justify-start !whitespace-normal"
            @click="emit('duplicateNode', selectedNodeId)"
          >
            <Icon name="i-lucide:copy-plus" :size="18" />
            <span>
              <strong>复制当前节点</strong>
              <small>{{ selectedNodeId }}</small>
            </span>
          </a-button>

          <article
            v-for="draft in drafts"
            :key="draft.id"
            class="workflow-governance-panel__draft"
          >
            <strong>{{ draft.title }}</strong>
            <span>{{ formatTime(draft.savedAt) }} · {{ draft.desc }}</span>
          </article>

          <a-empty v-if="!drafts.length" description="暂无草稿" />
        </div>
      </a-tab-pane>

      <a-tab-pane key="warnings" tab="告警">
        <div class="workflow-governance-panel__stack">
          <a-button
            v-for="log in warningLogs"
            :key="log.id"
            type="text"
            class="workflow-governance-panel__issue workflow-governance-panel__issue--warning !h-auto !w-full !justify-start !whitespace-normal"
            @click="emit('locateNode', log.nodeId)"
          >
            <Icon name="i-lucide:radar" :size="16" />
            <span>
              <strong>{{ log.title }}</strong>
              <small>{{ log.time }} · {{ log.message }}</small>
            </span>
          </a-button>

          <a-empty v-if="!warningLogs.length" description="暂无运行告警" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<style scoped lang="less">
.workflow-governance-panel {
  min-height: 0;
  overflow: hidden;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.workflow-governance-panel__header {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.workflow-governance-panel__header span {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: rgb(var(--w-text-color-3));
  text-transform: uppercase;
}

.workflow-governance-panel__header h3 {
  margin: 2px 0 0;
  font-size: 15px;
  color: rgb(var(--w-text-color));
}

.workflow-governance-panel :deep(.ant-tabs-nav) {
  padding: 0 12px;
  margin: 0;
}

.workflow-governance-panel__stack {
  display: grid;
  gap: 8px;
  max-height: 330px;
  padding: 12px;
  overflow: auto;
}

.workflow-governance-panel__case,
.workflow-governance-panel__draft {
  display: grid;
  gap: 4px;
  padding: 10px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.workflow-governance-panel__case strong,
.workflow-governance-panel__draft strong,
.workflow-governance-panel__issue strong,
.workflow-governance-panel__template strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(var(--w-text-color));
  white-space: nowrap;
}

.workflow-governance-panel__case span,
.workflow-governance-panel__draft span,
.workflow-governance-panel__issue small,
.workflow-governance-panel__template small {
  display: block;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: rgb(var(--w-text-color-3));
  white-space: nowrap;
}

.workflow-governance-panel__issue,
.workflow-governance-panel__template {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding: 10px;
  text-align: left;
  cursor: pointer;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  transition:
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.workflow-governance-panel__issue:hover,
.workflow-governance-panel__template:hover {
  background: rgb(var(--w-color-primary) / 8%);
  border-color: rgb(var(--w-color-primary) / 32%);
}

.workflow-governance-panel__issue--error {
  color: rgb(var(--w-color-error));
}

.workflow-governance-panel__issue--warning {
  color: rgb(var(--w-color-warning));
}

.workflow-governance-panel__issue--info {
  color: rgb(var(--w-color-primary));
}

.workflow-governance-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
