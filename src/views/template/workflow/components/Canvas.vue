<script setup lang="ts">
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import type { MenuProps } from 'antdv-next'
import {
  ConnectionLineType,
  SelectionMode,
  VueFlow,
  type Connection,
  type ConnectionLineOptions,
  type DefaultEdgeOptions,
  type EdgeMouseEvent,
  type NodeDragEvent,
  type NodeMouseEvent,
  type NodeProps,
} from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/minimap/dist/style.css'
import CustomEdge from '../CustomEdge.vue'
import AgentNode from './nodes/AgentNode.vue'
import CodeNode from './nodes/CodeNode.vue'
import ConditionNode from './nodes/ConditionNode.vue'
import DatabaseNode from './nodes/DatabaseNode.vue'
import EndNode from './nodes/EndNode.vue'
import HttpNode from './nodes/HttpNode.vue'
import KnowledgeNode from './nodes/KnowledgeNode.vue'
import LlmNode from './nodes/LlmNode.vue'
import LoopNode from './nodes/LoopNode.vue'
import MessageNode from './nodes/MessageNode.vue'
import PluginNode from './nodes/PluginNode.vue'
import StartNode from './nodes/StartNode.vue'
import VariableNode from './nodes/VariableNode.vue'
import UtilityNode from './nodes/UtilityNode.vue'
import { renderIcon } from '@/utils'
import { workflowPaletteGroupLabels } from '../data'
import type {
  WorkflowCanvasTab,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeData,
  WorkflowPaletteGroup,
  WorkflowPaletteItem,
  WorkflowRunLog,
  WorkflowTestCase,
} from '../types'

const nodes = defineModel<WorkflowNode[]>('nodes', { required: true })
const edges = defineModel<WorkflowEdge[]>('edges', { required: true })

const props = defineProps<{
  canRedo: boolean
  canRemoveSelected: boolean
  canUndo: boolean
  defaultEdgeOptions: DefaultEdgeOptions
  isRunning: boolean
  nodesLocked: boolean
  palette: WorkflowPaletteItem[]
  runLogs: WorkflowRunLog[]
  selectedTestCaseId: string
  testCases: WorkflowTestCase[]
}>()

const emit = defineEmits<{
  'add-node': [item: WorkflowPaletteItem]
  'arrange-nodes': []
  connect: [connection: Connection]
  'edge-context-menu': [event: EdgeMouseEvent]
  'fit-view': []
  'node-click': [event: NodeMouseEvent]
  'node-context-menu': [event: NodeMouseEvent]
  'node-drag-start': [event: NodeDragEvent]
  'node-drag-stop': [event: NodeDragEvent]
  'pane-click': []
  'pane-context-menu': [event: MouseEvent]
  'remove-selected': []
  redo: []
  run: []
  'select-test-case': [id: string]
  'toggle-nodes-locked': []
  undo: []
  'zoom-in': []
  'zoom-out': []
}>()

const activeTab = shallowRef<WorkflowCanvasTab>('design')
const isConnecting = shallowRef(false)
const isDraggingNode = shallowRef(false)
const isDesignTab = computed(() => activeTab.value === 'design')

const paletteGroups = Object.entries(workflowPaletteGroupLabels) as Array<
  [WorkflowPaletteGroup, string]
>
const paletteMenuItems = computed(() =>
  paletteGroups.map(([group, label]) => ({
    type: 'group' as const,
    label,
    children: props.palette
      .filter((item) => item.group === group)
      .map((item) => ({
        key: item.kind,
        label: item.title,
        icon: renderIcon(item.icon),
      })),
  }))
)

const handleAddNodeMenuClick: MenuProps['onClick'] = ({ key }) => {
  const item = props.palette.find((paletteItem) => paletteItem.kind === key)
  if (item) emit('add-node', item)
}

const addNodeMenu = computed(() => ({
  items: paletteMenuItems.value,
  onClick: handleAddNodeMenuClick,
}))

const connectionLineOptions: ConnectionLineOptions = {
  type: ConnectionLineType.Bezier,
  style: {
    stroke: 'rgb(var(--w-color-primary))',
    strokeWidth: 2,
    strokeDasharray: '6 4',
    strokeLinecap: 'round',
  },
}

const tabItems = [
  { value: 'design', label: '编排', iconName: 'i-lucide:workflow' },
  { value: 'test', label: '测试', iconName: 'i-lucide:flask-conical' },
  { value: 'log', label: '日志', iconName: 'i-lucide:scroll-text' },
]

const testStatusClass: Record<WorkflowTestCase['status'], string> = {
  ready: 'bg-fill-quaternary text-secondary',
  passed: 'bg-success-tint text-success',
  warning: 'bg-warning-tint text-warning',
}

const selectedTestCase = computed(() => {
  return (
    props.testCases.find((item) => item.id === props.selectedTestCaseId) ??
    props.testCases[0]
  )
})

function handleSlotNodeContextMenu(
  event: MouseEvent,
  nodeProps: NodeProps<WorkflowNodeData>
) {
  event.preventDefault()
  emit('node-context-menu', {
    event,
    node: {
      id: nodeProps.id,
      type: nodeProps.type,
      position: nodeProps.position,
      data: nodeProps.data,
    },
  } as NodeMouseEvent)
}

function handleNodeDragStart(event: NodeDragEvent) {
  isDraggingNode.value = true
  emit('node-drag-start', event)
}

function handleNodeDragStop(event: NodeDragEvent) {
  isDraggingNode.value = false
  emit('node-drag-stop', event)
}

function handleConnectStart() {
  isConnecting.value = true
}

function handleConnectEnd() {
  isConnecting.value = false
}
</script>

<template>
  <main
    class="workflow-canvas h-full min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-12 border-1 border-color-2 border-solid bg-main shadow-[0_10px_24px_rgb(15_23_42_/_8%)]"
  >
    <div
      class="min-w-0 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-10 border-b-1 border-b-solid border-color-2 px-10 py-8 max-md:flex max-md:flex-wrap max-md:justify-center"
    >
      <div
        class="min-w-0 flex items-center gap-6 justify-self-start max-md:order-2 max-md:flex-1"
      >
        <a-dropdown :trigger="['click']" :menu="addNodeMenu">
          <a-button type="primary" :disabled="!isDesignTab">
            <template #icon>
              <Icon name="i-lucide:plus" :size="15" />
            </template>
            添加节点
          </a-button>
        </a-dropdown>
      </div>

      <a-segmented
        v-model:value="activeTab"
        :options="tabItems"
        class="workflow-canvas-segmented justify-self-center max-md:order-1 max-md:w-full"
        size="small"
      >
        <template #labelRender="payload">
          <div class="inline-flex items-center">
            <Icon :name="payload.iconName" :size="16" class="mr-5" />
            <span>{{ payload.label }}</span>
          </div>
        </template>
      </a-segmented>

      <div aria-hidden="true" class="min-w-0 max-md:hidden" />
    </div>

    <VueFlow
      v-if="activeTab === 'design'"
      v-model:nodes="nodes"
      v-model:edges="edges"
      class="workflow-flow min-h-0 min-w-0"
      :class="{
        'workflow-flow--dragging': isDraggingNode,
        'workflow-flow--connecting': isConnecting,
      }"
      fit-view-on-init
      :default-edge-options="defaultEdgeOptions"
      :default-viewport="{ x: 80, y: 60, zoom: 0.85 }"
      :elevate-edges-on-select="true"
      :elevate-nodes-on-select="true"
      :connection-line-options="connectionLineOptions"
      :connection-radius="24"
      :max-zoom="1.6"
      :min-zoom="0.35"
      :nodes-draggable="!nodesLocked"
      :nodes-connectable="true"
      :node-drag-threshold="4"
      :auto-pan-on-node-drag="true"
      :auto-pan-on-connect="true"
      :pan-on-drag="[1]"
      :pan-on-scroll="true"
      :select-nodes-on-drag="true"
      :selection-key-code="true"
      :selection-mode="SelectionMode.Partial"
      :snap-grid="[16, 16]"
      :snap-to-grid="true"
      @connect="$emit('connect', $event)"
      @edge-context-menu="$emit('edge-context-menu', $event)"
      @node-click="$emit('node-click', $event)"
      @node-context-menu="$emit('node-context-menu', $event)"
      @node-drag-start="handleNodeDragStart"
      @node-drag-stop="handleNodeDragStop"
      @connect-start="handleConnectStart"
      @connect-end="handleConnectEnd"
      @pane-click="$emit('pane-click')"
      @pane-context-menu="$emit('pane-context-menu', $event)"
    >
      <Background :gap="18" pattern-color="#d5dce7" />
      <MiniMap
        pannable
        zoomable
        class="workflow-minimap !overflow-hidden !rounded-12 !border-1 !border-color-secondary !border-solid !bg-main !shadow-[0_12px_26px_rgb(15_23_42_/_10%)]"
        node-color="#6b7280"
        mask-color="rgb(15 23 42 / 8%)"
      />
      <div
        role="toolbar"
        aria-label="画布导航"
        class="workflow-canvas-controls absolute bottom-14 left-1/2 z-5 flex -translate-x-1/2 items-center gap-4 rounded-12 border-1 border-color-2 border-solid bg-main p-5 shadow-[0_12px_26px_rgb(15_23_42_/_12%)] backdrop-blur-10"
      >
        <a-button
          type="text"
          class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
          :disabled="!canUndo"
          title="撤销"
          aria-label="撤销"
          @click="$emit('undo')"
        >
          <Icon name="i-lucide:undo-2" :size="16" />
        </a-button>
        <a-button
          type="text"
          class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
          :disabled="!canRedo"
          title="重做"
          aria-label="重做"
          @click="$emit('redo')"
        >
          <Icon name="i-lucide:redo-2" :size="16" />
        </a-button>
        <span
          aria-hidden="true"
          class="mx-1 h-18 border-l-1 border-color-2 border-l-solid"
        />
        <a-button
          type="text"
          class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
          title="放大"
          @click="$emit('zoom-in')"
        >
          <Icon name="i-lucide:plus" :size="16" />
        </a-button>
        <a-button
          type="text"
          class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
          title="缩小"
          @click="$emit('zoom-out')"
        >
          <Icon name="i-lucide:minus" :size="16" />
        </a-button>
        <a-button
          type="text"
          class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
          title="适配画布"
          @click="$emit('fit-view')"
        >
          <Icon name="i-lucide:scan" :size="16" />
        </a-button>
        <a-button
          type="text"
          class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
          title="自动整理节点"
          aria-label="自动整理节点"
          @click="$emit('arrange-nodes')"
        >
          <Icon name="i-lucide:wand-sparkles" :size="16" />
        </a-button>
        <a-button
          type="text"
          class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
          :class="{ 'bg-fill-tertiary text-primary': nodesLocked }"
          :title="nodesLocked ? '解锁节点拖拽' : '锁定节点拖拽'"
          :aria-pressed="nodesLocked"
          @click="$emit('toggle-nodes-locked')"
        >
          <Icon
            :name="nodesLocked ? 'i-lucide:lock' : 'i-lucide:unlock'"
            :size="16"
          />
        </a-button>
        <span
          aria-hidden="true"
          class="mx-1 h-18 border-l-1 border-color-2 border-l-solid"
        />
        <a-button
          type="text"
          class="!h-32 !w-32 !p-0 text-regular hover:text-error"
          :disabled="!canRemoveSelected"
          title="删除选中节点"
          aria-label="删除选中节点"
          @click="$emit('remove-selected')"
        >
          <Icon name="i-lucide:trash-2" :size="16" />
        </a-button>
      </div>

      <template #node-workflow-start="nodeProps">
        <StartNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-llm="nodeProps">
        <LlmNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-agent="nodeProps">
        <AgentNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-knowledge="nodeProps">
        <KnowledgeNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-condition="nodeProps">
        <ConditionNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-code="nodeProps">
        <CodeNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-plugin="nodeProps">
        <PluginNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-http="nodeProps">
        <HttpNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-database="nodeProps">
        <DatabaseNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-variable="nodeProps">
        <VariableNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-loop="nodeProps">
        <LoopNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-delay="nodeProps">
        <UtilityNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-approval="nodeProps">
        <UtilityNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-parallel="nodeProps">
        <UtilityNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-subflow="nodeProps">
        <UtilityNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-webhook="nodeProps">
        <UtilityNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-message="nodeProps">
        <MessageNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>
      <template #node-workflow-end="nodeProps">
        <EndNode
          v-bind="nodeProps"
          @contextmenu="handleSlotNodeContextMenu($event, nodeProps)"
        />
      </template>

      <template #edge-custom="edgeProps">
        <CustomEdge v-bind="edgeProps" />
      </template>
    </VueFlow>

    <Scrollbar
      v-else-if="activeTab === 'test'"
      class="min-h-0 bg-page"
      content-class="p-14"
    >
      <div class="grid gap-12 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section
          class="min-w-0 rounded-10 border-1 border-color-2 border-solid bg-main"
        >
          <div
            class="flex items-center justify-between gap-12 border-b-1 border-b-solid border-color-2 px-14 py-12"
          >
            <div class="min-w-0">
              <div class="truncate text-15px text-main font-700">测试用例</div>
              <div class="mt-2 text-xs text-muted">
                使用模拟输入验证节点分支、插件降级和最终输出
              </div>
            </div>
            <a-button
              type="primary"
              size="small"
              class="!h-32 shrink-0"
              :disabled="isRunning"
              @click="$emit('run')"
            >
              <Icon
                :name="isRunning ? 'i-lucide:loader-2' : 'i-lucide:play'"
                :size="15"
                :class="{ 'animate-spin': isRunning }"
              />
              <span>{{ isRunning ? '运行中' : '运行测试' }}</span>
            </a-button>
          </div>

          <div class="grid gap-10 p-12">
            <a-button
              v-for="item in testCases"
              :key="item.id"
              type="text"
              class="!h-auto !w-full !flex-col !items-start !justify-start !whitespace-normal !rounded-8 !border-1 !border-solid !bg-container !p-12 !text-left transition hover:(!border-color-primary !bg-hover)"
              :class="
                item.id === selectedTestCaseId
                  ? '!border-color-primary'
                  : '!border-color-2'
              "
              @click="$emit('select-test-case', item.id)"
            >
              <span class="flex w-full items-start justify-between gap-10">
                <span class="min-w-0">
                  <span class="block truncate text-sm text-main font-700">
                    {{ item.title }}
                  </span>
                  <span class="mt-4 block text-xs text-muted leading-18px">
                    {{ item.description }}
                  </span>
                </span>
                <span
                  class="shrink-0 rounded-full px-7 py-2 text-xs"
                  :class="testStatusClass[item.status]"
                >
                  {{
                    item.status === 'passed'
                      ? '通过'
                      : item.status === 'warning'
                        ? '警告'
                        : '待测'
                  }}
                </span>
              </span>
              <span
                class="mt-10 grid w-full gap-8 rounded-7 bg-fill-quaternary p-10 text-xs text-secondary"
              >
                <span class="block">
                  <span class="text-muted">输入：</span>{{ item.input }}
                </span>
                <span class="block">
                  <span class="text-muted">预期：</span>{{ item.expected }}
                </span>
              </span>
            </a-button>
          </div>
        </section>

        <aside
          class="rounded-10 border-1 border-color-2 border-solid bg-main p-14"
        >
          <div class="text-15px text-main font-700">当前测试</div>
          <div class="mt-10 rounded-8 bg-fill-quaternary p-12">
            <div class="text-sm text-main font-700">
              {{ selectedTestCase?.title }}
            </div>
            <div class="mt-6 text-xs text-muted leading-18px">
              {{ selectedTestCase?.description }}
            </div>
            <div class="mt-12 grid grid-cols-2 gap-8">
              <div class="rounded-7 bg-main p-10">
                <div class="text-xs text-muted">状态</div>
                <div class="mt-5 text-sm text-main font-700">
                  {{
                    selectedTestCase?.status === 'passed'
                      ? '通过'
                      : selectedTestCase?.status === 'warning'
                        ? '警告'
                        : '待测'
                  }}
                </div>
              </div>
              <div class="rounded-7 bg-main p-10">
                <div class="text-xs text-muted">耗时</div>
                <div class="mt-5 text-sm text-main font-700">
                  {{ selectedTestCase?.duration }}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Scrollbar>

    <Scrollbar v-else class="min-h-0 bg-page" content-class="p-14">
      <section
        class="min-h-full rounded-10 border-1 border-color-2 border-solid bg-main"
      >
        <div
          class="flex items-center justify-between border-b-1 border-b-solid border-color-2 px-14 py-12"
        >
          <div>
            <div class="text-15px text-main font-700">运行日志</div>
            <div class="mt-2 text-xs text-muted">
              记录测试执行、节点状态和插件降级事件
            </div>
          </div>
          <a-tag type="info">{{ runLogs.length }} 条</a-tag>
        </div>

        <div class="grid gap-0 p-12">
          <div
            v-for="log in runLogs"
            :key="log.id"
            class="flex items-center gap-10 border-b-1 border-b-solid border-color-1 px-4 py-10 last:border-b-0 max-sm:grid-cols-1"
          >
            <span class="w-100 text-xs text-muted">{{ log.time }}</span>
            <div class="w-100">
              <a-tag variant="solid" :color="log.level">
                {{ log.level }}
              </a-tag>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-8">
                <span class="text-sm text-main font-700">{{ log.title }}</span>
                <span class="text-xs text-placeholder">{{ log.nodeId }}</span>
              </div>
              <div class="mt-4 text-xs text-secondary leading-18px">
                {{ log.message }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Scrollbar>
  </main>
</template>

<style scoped>
.workflow-flow {
  background:
    radial-gradient(circle at 20% 10%, rgb(37 99 235 / 8%), transparent 26%),
    linear-gradient(180deg, rgb(var(--w-bg-page)), rgb(var(--w-bg-container)));
}

.workflow-flow :deep(.vue-flow__pane) {
  cursor: crosshair;
}

.workflow-flow :deep(.vue-flow__pane.dragging) {
  cursor: grabbing;
}

.workflow-flow :deep(.vue-flow__selection) {
  background: rgb(var(--w-color-primary) / 12%);
  border: 1px solid rgb(var(--w-color-primary));
  box-shadow: 0 0 0 1px rgb(var(--w-color-primary) / 18%);
}

.workflow-flow :deep(.vue-flow__node) {
  border-radius: 12px;
}

.workflow-flow :deep(.vue-flow__node.selected) {
  box-shadow: none;
}

.workflow-flow :deep(.vue-flow__node.dragging) {
  z-index: 30 !important;
  transition: none !important;
  will-change: transform;
}

.workflow-flow :deep(.vue-flow__edge-path) {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.workflow-flow :deep(.vue-flow__connection-path) {
  stroke: rgb(var(--w-color-primary));
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 6 4;
}

.workflow-flow--connecting :deep(.vue-flow__handle.valid) {
  box-shadow: 0 0 0 4px rgb(var(--w-color-primary) / 16%);
}

.workflow-canvas-segmented {
  flex-shrink: 0;
}

.workflow-canvas-segmented :deep(.ant-segmented-item-label) {
  min-height: 28px;
  padding-inline: 12px;
  line-height: 28px;
}

@media (width <= 900px) {
  .workflow-canvas {
    min-height: 620px;
    margin-top: 10px;
    margin-left: 0;
  }
}
</style>
