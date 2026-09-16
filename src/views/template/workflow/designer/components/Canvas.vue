<script setup lang="ts">
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { useTheme } from '@/composables'
import { ThemeMode } from '@/constants'
import {
  areWorkflowDataSchemasCompatible,
  getWorkflowNodeDefinition,
} from '../../domain'
import {
  ConnectionLineType,
  SelectionMode,
  VueFlow,
  useVueFlow,
  type Connection,
  type ConnectionLineOptions,
  type DefaultEdgeOptions,
  type EdgeMouseEvent,
  type NodeDragEvent,
  type NodeMouseEvent,
  type ValidConnectionFunc,
} from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/minimap/dist/style.css'
import CanvasHeader from './CanvasHeader.vue'
import CanvasToolbar from './CanvasToolbar.vue'
import CustomEdge from './CustomEdge.vue'
import { workflowNodeTypes } from './nodes'
import { WORKFLOW_FLOW_ID } from '../constants'
import { Icon } from '@/components'
import type {
  WorkflowCanvasTab,
  WorkflowEdge,
  WorkflowNode,
  WorkflowPaletteItem,
  WorkflowRunLog,
  WorkflowTestCase,
  WorkflowValidationIssue,
} from '../types'

const nodes = defineModel<WorkflowNode[]>('nodes', { required: true })
const edges = defineModel<WorkflowEdge[]>('edges', { required: true })
const { themeMode } = useTheme()
const showCanvasGrid = computed(() => themeMode.value !== ThemeMode.Dark)

const { fitView, zoomIn, zoomOut, zoomTo, viewport } =
  useVueFlow(WORKFLOW_FLOW_ID)

const props = defineProps<{
  canRedo: boolean
  canRemoveSelected: boolean
  canUndo: boolean
  validationIssues: WorkflowValidationIssue[]
  defaultEdgeOptions: DefaultEdgeOptions
  isPaused: boolean
  isRunning: boolean
  nodesLocked: boolean
  palette: WorkflowPaletteItem[]
  runLogs: WorkflowRunLog[]
  selectedTestCaseId: string
  sourcePanelOpen: boolean
  testCases: WorkflowTestCase[]
  title: string
}>()

const emit = defineEmits<{
  'add-node': [item: WorkflowPaletteItem]
  'arrange-nodes': []
  'cancel-run': []
  connect: [connection: Connection]
  'copy-schema': []
  'edge-context-menu': [event: EdgeMouseEvent]
  'download-schema': []
  'node-click': [event: NodeMouseEvent]
  'node-context-menu': [event: NodeMouseEvent]
  'node-drag-start': [event: NodeDragEvent]
  'node-drag-stop': [event: NodeDragEvent]
  'pane-click': []
  'pane-context-menu': [event: MouseEvent]
  'remove-selected': []
  publish: []
  redo: []
  run: []
  'share-workflow': []
  'select-test-case': [id: string]
  'toggle-nodes-locked': []
  'toggle-source': []
  'resume-run': []
  undo: []
}>()

const activeTab = shallowRef<WorkflowCanvasTab>('design')
type CanvasInteractionMode = 'pan' | 'select'

const interactionMode = shallowRef<CanvasInteractionMode>('select')
const panOnDrag = computed(() => interactionMode.value === 'pan')
const selectionKeyCode = computed(() => interactionMode.value === 'select')

const connectionLineOptions: ConnectionLineOptions = {
  type: ConnectionLineType.Bezier,
  style: {
    stroke: 'rgb(var(--w-color-primary))',
    strokeWidth: 2,
    strokeDasharray: '6 4',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
}

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

function handlePaneReady() {
  fitView({ padding: 0.2, maxZoom: 0.85 })
}

function handleFitView() {
  fitView({ padding: 0.2, maxZoom: 1 })
}

function handleZoomReset() {
  zoomTo(1)
}

function handleNodeDragStart(event: NodeDragEvent) {
  emit('node-drag-start', event)
}

function handleNodeDragStop(event: NodeDragEvent) {
  emit('node-drag-stop', event)
}

const isValidConnection: ValidConnectionFunc = (connection) => {
  if (connection.source === connection.target) return false
  const connectionId = 'id' in connection ? connection.id : undefined
  const source = nodes.value.find((node) => node.id === connection.source)
  const target = nodes.value.find((node) => node.id === connection.target)
  if (!source || !target) return false
  const sourcePort = source.data.outputs.find(
    (port) => port.id === connection.sourceHandle
  )
  const targetPort = target.data.inputs.find(
    (port) => port.id === connection.targetHandle
  )
  if (!sourcePort || !targetPort) return false
  if (
    edges.value.some(
      (edge) =>
        edge.id !== connectionId &&
        edge.source === connection.source &&
        edge.sourceHandle === connection.sourceHandle &&
        edge.target === connection.target &&
        edge.targetHandle === connection.targetHandle
    )
  )
    return false
  if (
    !targetPort.multiple &&
    edges.value.some(
      (edge) =>
        edge.id !== connectionId &&
        edge.target === connection.target &&
        edge.targetHandle === connection.targetHandle
    )
  )
    return false
  const sourceDefinition = getWorkflowNodeDefinition(source.data.kind)
  const targetDefinition = getWorkflowNodeDefinition(target.data.kind)
  const sourceSchema = sourceDefinition?.outputs.find(
    (port) => port.id === sourcePort.id
  )?.schema
  const targetSchema = targetDefinition?.inputs.find(
    (port) => port.id === targetPort.id
  )?.schema
  return Boolean(
    sourceSchema &&
    targetSchema &&
    areWorkflowDataSchemasCompatible(sourceSchema, targetSchema)
  )
}
</script>

<template>
  <main
    class="h-full min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-12 border-1 border-color-2 border-solid bg-main shadow-card max-[900px]:min-h-620 max-[900px]:mt-10 max-[900px]:ml-0"
  >
    <CanvasHeader
      v-model:active-tab="activeTab"
      :is-paused="isPaused"
      :is-running="isRunning"
      :palette="palette"
      :source-panel-open="sourcePanelOpen"
      @add-node="$emit('add-node', $event)"
      @copy-schema="$emit('copy-schema')"
      @download-schema="$emit('download-schema')"
      @publish="$emit('publish')"
      @resume-run="$emit('resume-run')"
      @run="$emit('run')"
      @share-workflow="$emit('share-workflow')"
      @toggle-source="$emit('toggle-source')"
    />

    <VueFlow
      v-if="activeTab === 'design'"
      :id="WORKFLOW_FLOW_ID"
      v-model:nodes="nodes"
      v-model:edges="edges"
      class="min-h-0 min-w-0 [background:var(--w-workflow-canvas-background)] [&_.vue-flow\_\_pane.dragging]:cursor-grabbing [&_.vue-flow\_\_selection]:bg-primary/12 [&_.vue-flow\_\_selection]:border-1 [&_.vue-flow\_\_selection]:border-primary [&_.vue-flow\_\_selection]:border-solid [&_.vue-flow\_\_selection]:shadow-focus [&_.vue-flow\_\_node]:rounded-12 [&_.vue-flow\_\_node.selected]:shadow-none [&_.vue-flow\_\_node.dragging]:!z-30 [&_.vue-flow\_\_node.dragging]:!transition-none [&_.vue-flow\_\_node.dragging]:will-change-transform [&_.vue-flow\_\_edge-path]:[stroke-linecap:round] [&_.vue-flow\_\_edge-path]:[stroke-linejoin:round] [&_.vue-flow\_\_handle.valid]:shadow-focus-strong [&.canvas-mode-pan_.vue-flow\_\_pane]:cursor-grab [&.canvas-mode-select_.vue-flow\_\_pane]:cursor-crosshair"
      :class="{
        'canvas-mode-pan': interactionMode === 'pan',
        'canvas-mode-select': interactionMode === 'select',
      }"
      :node-types="workflowNodeTypes"
      :default-edge-options="defaultEdgeOptions"
      :delete-key-code="null"
      :default-viewport="{ x: 80, y: 60, zoom: 0.7 }"
      :elevate-edges-on-select="true"
      :elevate-nodes-on-select="true"
      :connection-line-options="connectionLineOptions"
      :is-valid-connection="isValidConnection"
      :connection-radius="24"
      :max-zoom="1.6"
      :min-zoom="0.35"
      :nodes-draggable="!nodesLocked"
      :nodes-connectable="true"
      :node-drag-threshold="4"
      :auto-pan-on-node-drag="true"
      :auto-pan-on-connect="true"
      :pan-on-drag="panOnDrag"
      :pan-on-scroll="true"
      :select-nodes-on-drag="true"
      :selection-key-code="selectionKeyCode"
      :selection-mode="SelectionMode.Partial"
      :snap-grid="[16, 16]"
      :snap-to-grid="true"
      @connect="$emit('connect', $event)"
      @edge-context-menu="$emit('edge-context-menu', $event)"
      @node-click="$emit('node-click', $event)"
      @node-context-menu="$emit('node-context-menu', $event)"
      @node-drag-start="handleNodeDragStart"
      @node-drag-stop="handleNodeDragStop"
      @pane-click="$emit('pane-click')"
      @pane-context-menu="$emit('pane-context-menu', $event)"
      @pane-ready="handlePaneReady"
    >
      <Background
        v-if="showCanvasGrid"
        :gap="18"
        pattern-color="rgb(var(--w-workflow-grid-color))"
      />
      <MiniMap
        pannable
        zoomable
        class="workflow-minimap !overflow-hidden !rounded-12 !border-1 !border-color-secondary !border-solid !bg-main !shadow-minimap"
        node-color="rgb(var(--w-workflow-minimap-node-color))"
        mask-color="var(--w-workflow-minimap-mask)"
      />
      <CanvasToolbar
        v-model:interaction-mode="interactionMode"
        :can-redo="canRedo"
        :can-remove-selected="canRemoveSelected"
        :can-undo="canUndo"
        :nodes-locked="nodesLocked"
        :zoom="viewport.zoom"
        @arrange-nodes="$emit('arrange-nodes')"
        @fit-view="handleFitView"
        @remove-selected="$emit('remove-selected')"
        @redo="$emit('redo')"
        @toggle-nodes-locked="$emit('toggle-nodes-locked')"
        @undo="$emit('undo')"
        @zoom-in="zoomIn()"
        @zoom-out="zoomOut()"
        @zoom-reset="handleZoomReset"
      />

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
            <div class="flex items-center gap-8">
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
              <a-button
                v-if="isPaused"
                type="primary"
                size="small"
                class="!h-32 shrink-0"
                @click="$emit('resume-run')"
              >
                <Icon name="i-lucide:play" :size="14" />
                继续
              </a-button>
              <a-button
                v-if="isRunning"
                size="small"
                class="!h-32 shrink-0"
                @click="$emit('cancel-run')"
              >
                <Icon name="i-lucide:square" :size="14" />
                停止
              </a-button>
            </div>
          </div>
          <div
            v-if="validationIssues.length"
            class="m-10 flex items-start gap-8 rounded-4 bg-warning-tint px-10 py-9 text-xs text-warning"
          >
            <Icon
              name="i-lucide:triangle-alert"
              :size="15"
              class="mt-1 shrink-0"
            />
            <span>{{ validationIssues[0]?.message }}</span>
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
