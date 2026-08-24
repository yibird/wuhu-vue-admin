import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { useClipboard } from '@vueuse/core'
import { message } from 'antdv-next'
import {
  createDesignerNode,
  paletteItems,
  paletteTabs,
} from '../components/controls/registry'
import { useLowCodeAi } from './useAi'
import {
  cloneNodes,
  cloneSchema,
  createSchema,
  formatSchema,
  parseSchema,
  sanitizeSchemaFileName,
} from './useSchema'
import {
  canAddNodeToTarget,
  canMoveNodeToTarget,
  duplicateDesignerNode,
  duplicateDesignerNodes,
  findDesignerNode,
  findDesignerNodeLocation,
  flattenDesignerNodes,
  getExistingDesignerNodeIds,
  insertDesignerNode,
  moveDesignerNode,
  moveDesignerNodeByStep,
  removeDesignerNodes,
  updateDesignerNode,
} from '../utils/nodeTree'
import type {
  DesignerComponentType,
  DesignerDropTarget,
  DesignerJsonSchema,
  DesignerNode,
  DesignerPlatform,
  DesignerPlatformOption,
  DesignerVersion,
  DesignerNodeUpdate,
} from '../types'

const MAX_HISTORY = 50
const EDIT_BURST_MS = 300

const getUniqueIds = (ids: string[]) => Array.from(new Set(ids.filter(Boolean)))

function getExistingSelection(ids: string[], nodes: DesignerNode[]) {
  return getExistingDesignerNodeIds(nodes, getUniqueIds(ids))
}

const createVersionId = () => `version-${Date.now().toString(36)}`

const formatVersionTime = () =>
  new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

export function useLowCodeDesigner() {
  const { copy, isSupported } = useClipboard({ legacy: true })

  const palette = paletteItems

  const platforms: DesignerPlatformOption[] = [
    { value: 'pc', label: 'PC', icon: 'i-lucide:monitor', width: 1440 },
    { value: 'tablet', label: '平板', icon: 'i-lucide:tablet', width: 1024 },
    { value: 'mobile', label: '手机', icon: 'i-lucide:smartphone', width: 480 },
  ]

  const platform = shallowRef<DesignerPlatform>('pc')
  const selectedId = shallowRef('')
  const selectedIds = shallowRef<string[]>([])
  const historyIndex = shallowRef(0)
  const sourcePanelOpen = shallowRef(false)
  let editBurstTimer: number | null = null
  const flatNodes = computed(() => flattenDesignerNodes(nodes.value))
  const nodes = shallowRef<DesignerNode[]>([
    createDesignerNode('hero', {
      id: 'hero-main',
      title: '企业增长工作台',
      description:
        '统一承载获客、销售转化、交付跟踪与自动化运营，让团队在一个页面完成日常判断。',
    }),
    createDesignerNode('stats', { id: 'stats-main' }),
    createDesignerNode('chart', { id: 'chart-main' }),
    createDesignerNode('table', { id: 'table-main' }),
    createDesignerNode('flex', {
      id: 'flex-main',
      title: '搜索操作栏',
      description: '弹性布局容器，可嵌套子组件。',
      children: [
        createDesignerNode('input', {
          id: 'flex-search',
          title: '搜索输入',
          props: { placeholder: '输入关键词搜索///' },
        }),
        createDesignerNode('button', {
          id: 'flex-action',
          title: '搜索按钮',
          props: { label: '搜索' },
        }),
      ],
    }),
  ])
  const schema = shallowRef<DesignerJsonSchema>(createSchema(nodes.value))
  const schemaCode = shallowRef(formatSchema(schema.value))
  const schemaError = shallowRef('')
  const history = shallowRef<DesignerNode[][]>([cloneNodes(nodes.value)])
  const historySelections = shallowRef<string[][]>([[]])
  const activeVersionId = shallowRef('version-baseline')
  const versions = shallowRef<DesignerVersion[]>([
    {
      id: 'version-baseline',
      name: '默认版本',
      time: formatVersionTime(),
      nodes: cloneNodes(nodes.value),
      schema: createSchema(nodes.value),
    },
  ])

  const selectedNodes = computed(() => {
    const ids = new Set(selectedIds.value)
    return flatNodes.value.filter((node) => ids.has(node.id))
  })
  const selectedNode = computed(() =>
    selectedIds.value.length === 1
      ? findDesignerNode(nodes.value, selectedId.value)
      : undefined
  )
  const activePlatform = computed(() =>
    platforms.find((item) => item.value === platform.value)
  )
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)
  const componentCount = computed(() => flatNodes.value.length)
  const selectedCount = computed(() => selectedIds.value.length)

  function syncSchemaFromNodes(nextNodes = nodes.value) {
    schema.value = createSchema(nextNodes, schema.value)
    schemaCode.value = formatSchema(schema.value)
    schemaError.value = ''
  }

  function setSelection(ids: string[]) {
    const nextSelection = getExistingSelection(ids, nodes.value)
    selectedIds.value = nextSelection
    selectedId.value = nextSelection[0] ?? ''
  }

  function selectNode(id: string) {
    setSelection(id ? [id] : [])
  }

  function selectNodes(ids: string[]) {
    setSelection(ids)
  }

  function clearSelection() {
    setSelection([])
  }

  function commit(
    nextNodes: DesignerNode[],
    selectedNodeId = selectedId.value,
    shouldSyncSchema = true,
    nextSelectedIds = selectedNodeId ? [selectedNodeId] : selectedIds.value
  ) {
    const clonedNodes = cloneNodes(nextNodes)
    const nextSelection = getExistingSelection(nextSelectedIds, clonedNodes)

    const nextHistory = history.value.slice(0, historyIndex.value + 1)
    const nextHistorySelections = historySelections.value.slice(
      0,
      historyIndex.value + 1
    )
    nextHistory.push(clonedNodes)
    nextHistorySelections.push([...nextSelection])

    if (nextHistory.length > MAX_HISTORY) {
      nextHistory.shift()
      nextHistorySelections.shift()
    } else {
      historyIndex.value = nextHistory.length - 1
    }

    nodes.value = clonedNodes
    history.value = nextHistory
    historySelections.value = nextHistorySelections
    selectedIds.value = nextSelection
    selectedId.value = nextSelection[0] ?? ''
    if (shouldSyncSchema) syncSchemaFromNodes(clonedNodes)
  }

  function replaceNodes(nextNodes: DesignerNode[]) {
    commit(
      nextNodes,
      nextNodes[0]?.id ?? '',
      true,
      nextNodes[0]?.id ? [nextNodes[0].id] : []
    )
  }

  function applySchemaCode(value = schemaCode.value) {
    try {
      const nextSchema = parseSchema(value)
      schema.value = cloneSchema(nextSchema)
      schemaCode.value = value
      schemaError.value = ''
      commit(
        schema.value.components,
        schema.value.components[0]?.id ?? selectedId.value,
        false
      )
      return true
    } catch (error) {
      schemaCode.value = value
      schemaError.value =
        error instanceof Error ? error.message : 'JsonSchema 解析失败'
      return false
    }
  }

  function updateSchemaCode(value: string) {
    schemaCode.value = value
    applySchemaCode(value)
  }

  function formatSchemaCode() {
    if (!applySchemaCode()) return
    schemaCode.value = formatSchema(schema.value)
  }

  function exportSchema() {
    syncSchemaFromNodes()
    return formatSchema(schema.value)
  }

  function copySchemaCode() {
    copyText(exportSchema(), '低代码 JSONSchema 已复制')
  }

  function downloadSchemaCode() {
    const content = exportSchema()
    const blob = new Blob([content], { type: 'application.json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${sanitizeSchemaFileName(schema.value.title)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    message.success('低代码 JSONSchema 已导出')
  }

  function batchAddNodes(types: DesignerComponentType[]) {
    if (!types.length) return
    const newNodes = types.map((type) => createDesignerNode(type))
    let nextNodes = nodes.value
    for (const node of newNodes) {
      nextNodes = insertDesignerNode(
        nextNodes,
        { index: nextNodes.length },
        node
      )
    }
    commit(
      nextNodes,
      newNodes[0].id,
      true,
      newNodes.map((node) => node.id)
    )
  }

  function addNode(
    type: DesignerComponentType,
    target: DesignerDropTarget | number = nodes.value.length
  ) {
    const node = createDesignerNode(type)
    const dropTarget = typeof target === 'number' ? { index: target } : target
    const validation = canAddNodeToTarget(nodes.value, dropTarget)
    if (!validation.allowed) {
      message.warning(validation.reason ?? '无法添加到目标位置')
      return
    }
    const nextNodes = insertDesignerNode(nodes.value, dropTarget, node)
    commit(nextNodes, node.id)
  }

  function moveNode(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    const node = nodes.value[fromIndex]
    if (!node) return
    const nextNodes = moveDesignerNode(nodes.value, node.id, { index: toIndex })
    if (nextNodes === nodes.value) return
    commit(nextNodes, node.id)
  }

  function moveNodeUp(id: string) {
    const nextNodes = moveDesignerNodeByStep(nodes.value, id, -1)
    if (nextNodes === nodes.value) return
    commit(nextNodes, id)
  }

  function moveNodeDown(id: string) {
    const nextNodes = moveDesignerNodeByStep(nodes.value, id, 1)
    if (nextNodes === nodes.value) return
    commit(nextNodes, id)
  }

  function moveNodeToTarget(id: string, target: DesignerDropTarget) {
    const validation = canMoveNodeToTarget(nodes.value, id, target)
    if (!validation.allowed) {
      message.warning(validation.reason ?? '无法移动到目标位置')
      return
    }
    const nextNodes = moveDesignerNode(nodes.value, id, target)
    if (nextNodes === nodes.value) return
    commit(nextNodes, id)
  }

  function reorderNodes(
    orderedIds: string[],
    nextSelectedId = selectedId.value
  ) {
    if (orderedIds.length !== nodes.value.length) return

    const nodeMap = new Map(nodes.value.map((node) => [node.id, node]))
    const nextNodes = orderedIds
      .map((id) => nodeMap.get(id))
      .filter((node): node is DesignerNode => !!node)

    if (nextNodes.length !== nodes.value.length) return

    const isSameOrder = nextNodes.every(
      (node, index) => node.id === nodes.value[index]?.id
    )
    if (isSameOrder) return

    commit(nextNodes, nextSelectedId)
  }

  function updateSelectedNode(update: DesignerNodeUpdate) {
    const id = selectedId.value
    if (!id || selectedIds.value.length !== 1) return

    const nextNodes = updateDesignerNode(nodes.value, id, (node) => ({
      ...node,
      ...update,
      props: update.props
        ? ({
            ...node.props,
            ...update.props,
          } as DesignerNode['props'])
        : node.props,
      style: {
        ...node.style,
        ...update.style,
      },
    }))

    if (editBurstTimer) {
      nodes.value = nextNodes
    } else {
      commit(nextNodes, id)
    }

    if (editBurstTimer) window.clearTimeout(editBurstTimer)
    editBurstTimer = window.setTimeout(() => {
      editBurstTimer = null
      syncSchemaFromNodes()
    }, EDIT_BURST_MS)
  }

  onBeforeUnmount(() => {
    if (editBurstTimer) window.clearTimeout(editBurstTimer)
  })

  const {
    aiBusy,
    aiMessages,
    aiPrompt,
    aiSuggestions,
    applyAiToSelectedNode,
    applySuggestion,
    generateFromPrompt,
  } = useLowCodeAi({
    getSelectedNode: () => selectedNode.value,
    replaceNodes,
    updateSelectedNode,
  })

  function removeSelectedNode() {
    const ids = selectedIds.value.length
      ? selectedIds.value
      : [selectedId.value]
    removeNodes(ids)
  }

  function removeNodes(ids: string[]) {
    const selection = getExistingSelection(ids, nodes.value)
    if (!selection.length) return

    const selectionSet = new Set(selection)
    const firstRemoved = selection[0] ?? ''
    const location = findDesignerNodeLocation(nodes.value, firstRemoved)
    const nextNodes = removeDesignerNodes(nodes.value, selectionSet)
    const nextSelected =
      flatNodes.value[Math.max(0, (location?.index ?? 1) - 1)]?.id ??
      flatNodes.value[0]?.id ??
      ''
    commit(nextNodes, nextSelected, true, nextSelected ? [nextSelected] : [])
  }

  function removeNode(id: string) {
    if (!id) return

    const location = findDesignerNodeLocation(nodes.value, id)
    if (!location) return

    const nextNodes = removeDesignerNodes(nodes.value, new Set([id]))
    const nextSelected =
      flatNodes.value[Math.max(0, location.index - 1)]?.id ??
      flatNodes.value[0]?.id ??
      ''
    commit(nextNodes, nextSelected)
  }

  function duplicateSelectedNode() {
    const ids = selectedIds.value.length
      ? selectedIds.value
      : [selectedId.value]
    duplicateNodes(ids)
  }

  function duplicateNodes(ids: string[]) {
    const selection = getExistingSelection(ids, nodes.value)
    if (!selection.length) return

    const selectionSet = new Set(selection)
    const flatSelection = flatNodes.value
      .map((node) => node.id)
      .filter((id) => selectionSet.has(id))
    const result = duplicateDesignerNodes(nodes.value, flatSelection)

    commit(result.nodes, result.selectedIds[0] ?? '', true, result.selectedIds)
  }

  function duplicateNode(id: string) {
    const result = duplicateDesignerNode(nodes.value, id)
    const nextSelectedId = result.selectedIds[0]
    if (!nextSelectedId) return
    commit(result.nodes, nextSelectedId, true, result.selectedIds)
  }

  function undo() {
    if (!canUndo.value) return

    historyIndex.value -= 1
    nodes.value = cloneNodes(history.value[historyIndex.value] ?? [])
    const savedSelection = historySelections.value[historyIndex.value] ?? []
    setSelection(savedSelection)
    syncSchemaFromNodes()
  }

  function redo() {
    if (!canRedo.value) return

    historyIndex.value += 1
    nodes.value = cloneNodes(history.value[historyIndex.value] ?? [])
    const savedSelection = historySelections.value[historyIndex.value] ?? []
    setSelection(savedSelection)
    syncSchemaFromNodes()
  }

  function saveVersion() {
    syncSchemaFromNodes()
    const nextVersion: DesignerVersion = {
      id: createVersionId(),
      name: `版本 ${versions.value.length + 1}`,
      time: formatVersionTime(),
      nodes: cloneNodes(nodes.value),
      schema: cloneSchema(schema.value),
    }

    versions.value = [nextVersion, ...versions.value]
    activeVersionId.value = nextVersion.id
  }

  function restoreVersion(version: DesignerVersion) {
    activeVersionId.value = version.id
    const nextSchema = cloneSchema(version.schema)
    schema.value = nextSchema
    schemaCode.value = formatSchema(nextSchema)
    schemaError.value = ''
    commit(nextSchema.components, nextSchema.components[0]?.id ?? '', false)
  }

  function restoreVersionById(id: string) {
    const version = versions.value.find((item) => item.id === id)
    if (!version) return
    restoreVersion(version)
  }

  function toggleSourcePanel() {
    sourcePanelOpen.value = !sourcePanelOpen.value
  }

  function closeSourcePanel() {
    sourcePanelOpen.value = false
  }

  function copyText(text: string, successText: string) {
    if (!isSupported.value) {
      message.warning('当前环境不支持复制')
      return
    }

    copy(text)
      .then(() => {
        message.success(successText)
      })
      .catch(() => {
        message.error('复制失败，请稍后重试')
      })
  }

  return {
    activePlatform,
    activeVersionId,
    aiBusy,
    aiMessages,
    aiPrompt,
    aiSuggestions,
    batchAddNodes,
    canRedo,
    canUndo,
    componentCount,
    history,
    historyIndex,
    nodes,
    palette,
    paletteTabs,
    platform,
    platforms,
    schema,
    schemaCode,
    schemaError,
    selectedId,
    selectedIds,
    selectedCount,
    selectedNode,
    selectedNodes,
    sourcePanelOpen,
    versions,
    addNode,
    applyAiToSelectedNode,
    applySchemaCode,
    applySuggestion,
    clearSelection,
    closeSourcePanel,
    copySchemaCode,
    downloadSchemaCode,
    duplicateNode,
    duplicateNodes,
    duplicateSelectedNode,
    exportSchema,
    formatSchemaCode,
    generateFromPrompt,
    moveNode,
    moveNodeDown,
    moveNodeToTarget,
    moveNodeUp,
    redo,
    reorderNodes,
    removeNode,
    removeNodes,
    removeSelectedNode,
    restoreVersion,
    restoreVersionById,
    saveVersion,
    selectNode,
    selectNodes,
    toggleSourcePanel,
    undo,
    updateSchemaCode,
    updateSelectedNode,
  }
}
