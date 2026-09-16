import { computed, reactive, ref, shallowRef, toRaw } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import {
  cloneComponent,
  createNodeId,
  ROOT_ID,
  SchemaIndex,
  structuredCloneSafe,
} from '../core/schema'
import { createDefaultApplication } from '../core/schema/defaults'
import {
  createBatchUpdateCommand,
  createDuplicateCommand,
  createInsertCommand,
  createMoveCommand,
  createRemoveCommand,
  createReorderCommand,
  createUpdateCommand,
} from '../core/commands'
import { HistoryManager } from '../core/history'
import type { HistoryEntry } from '../core/history'
import {
  clearDraft,
  deletePublished,
  listPublished,
  loadDraft,
  loadDraftSavedAt,
  publishApp,
  saveDraft,
  setCurrentVersion as persistCurrentVersion,
} from '../core/persistence'
import { componentRegistry } from '../core/registry'
import { createRuntime } from '../core/runtime'
import type { RuntimeApi } from '../core/runtime'
import type {
  ApplicationSchema,
  ComponentSchema,
  ComponentKind,
  PageSchema,
  StyleSchema,
} from '../core/schema/types'
import type { NodePatch } from '../core/commands'
import { DEVICE_PRESETS } from '../types'
import type { DesignerDevice } from '../types'

const DEFAULT_APP_ID = 'low-code-demo'

export interface AddNodeOptions {
  parentId?: string
  index?: number
  select?: boolean
}

export interface PublishedVersion {
  id: string
  version: string
  time: number
  note?: string
  current?: boolean
  snapshotSchema: ApplicationSchema
}

export interface DesignerApi {
  schema: ApplicationSchema
  pages: ComputedRef<PageSchema[]>
  activePageId: Ref<string>
  activePage: ComputedRef<PageSchema>
  activeIndex: ComputedRef<SchemaIndex>
  selectedIds: Ref<string[]>
  selectedNodes: ComputedRef<ComponentSchema[]>
  primarySelectedId: ComputedRef<string | undefined>
  primarySelectedNode: ComputedRef<ComponentSchema | undefined>
  hoveredId: Ref<string | undefined>
  history: HistoryManager
  historyVersion: Ref<number>
  canUndo: ComputedRef<boolean>
  canRedo: ComputedRef<boolean>
  runtime: RuntimeApi
  previewDevice: Ref<DesignerDevice>
  deviceSize: ComputedRef<{ width: number; height: number }>
  setDevice: (device: DesignerDevice) => void
  setDeviceSize: (size: { width?: number; height?: number }) => void
  rotateDevice: () => void
  customDeviceSize: { width: number; height: number }
  previewUser: Record<string, unknown>
  clipboardSize: Ref<number>
  versions: Ref<PublishedVersion[]>
  // selection
  select: (id: string, additive?: boolean) => void
  selectMany: (ids: string[]) => void
  toggleSelect: (id: string) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean
  // node crud
  addNode: (
    type: string,
    options?: AddNodeOptions
  ) => ComponentSchema | undefined
  removeNodes: (ids: string[]) => void
  removeSelected: () => void
  duplicateNodes: (ids: string[]) => void
  duplicateSelected: () => void
  moveNode: (id: string, parentId: string, index: number) => void
  moveNodes: (ids: string[], parentId: string, index: number) => void
  reorderNode: (id: string, direction: 'up' | 'down') => void
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
  moveOut: (id: string) => void
  moveIn: (id: string) => void
  wrapInContainer: (ids: string[], containerType: string) => void
  // updates
  updateNode: (
    id: string,
    patch: NodePatch,
    options?: { label?: string; mergeKey?: string }
  ) => void
  updateNodes: (ids: string[], patch: NodePatch, label?: string) => void
  updateStyle: (id: string, style: Partial<StyleSchema>) => void
  setBinding: (id: string, prop: string, expression: string | undefined) => void
  setEvents: (id: string, events: ComponentSchema['events']) => void
  toggleLock: (id: string) => void
  toggleHidden: (id: string) => void
  renameNode: (id: string, name: string) => void
  recordHistory: (
    entry: Omit<HistoryEntry, 'timestamp'>,
    options?: { mergeKey?: string; structural?: boolean }
  ) => void
  markDirty: () => void
  // clipboard
  copySelection: () => void
  pasteClipboard: (targetId?: string) => void
  // schema sections
  editSection: <K extends keyof ApplicationSchema>(
    key: K,
    label: string,
    mutator: (value: ApplicationSchema[K]) => void,
    mergeKey?: string
  ) => void
  // pages
  addPage: (name: string, path: string) => void
  removePage: (id: string) => void
  setActivePage: (id: string) => void
  // persistence
  saveDraftNow: () => boolean
  dirty: Ref<boolean>
  lastSavedAt: Ref<number | undefined>
  currentVersion: ComputedRef<PublishedVersion | undefined>
  publish: (options: {
    version: string
    note?: string
    setCurrent?: boolean
  }) => PublishedVersion
  setCurrentVersion: (id: string) => void
  deleteVersion: (id: string) => void
  restoreVersion: (snapshot: ApplicationSchema) => void
  resetApplication: () => void
  refreshVersions: () => void
}

/**
 * useDesigner：页面设计器状态与命令入口。
 * Schema 是唯一事实来源，所有修改都通过 Command / History 系统。
 */
export function useDesigner(): DesignerApi {
  const stored = loadDraft(DEFAULT_APP_ID)
  const initial = stored?.pages?.length ? stored : createDefaultApplication()
  const schema = reactive<ApplicationSchema>(
    structuredCloneSafe(initial)
  ) as ApplicationSchema

  const activePageId = ref(schema.pages[0]?.id ?? '')
  const selectedIds = ref<string[]>([])
  const hoveredId = ref<string | undefined>(undefined)
  const previewDevice = ref<DesignerDevice>('pc')
  const customDeviceSize = reactive({ width: 1280, height: 800 })
  const dirty = ref(false)
  const lastSavedAt = ref<number | undefined>(loadDraftSavedAt(DEFAULT_APP_ID))

  const deviceSize = computed(() => {
    if (previewDevice.value === 'custom') {
      return {
        width: customDeviceSize.width,
        height: customDeviceSize.height,
      }
    }
    const preset =
      DEVICE_PRESETS.find((item) => item.value === previewDevice.value) ??
      DEVICE_PRESETS[0]
    return { width: preset.width, height: preset.height }
  })

  const MIN_DEVICE_SIZE = 240
  const MAX_DEVICE_SIZE = 4000

  function clampDeviceSize(value: number) {
    if (!Number.isFinite(value)) return MIN_DEVICE_SIZE
    return Math.min(
      MAX_DEVICE_SIZE,
      Math.max(MIN_DEVICE_SIZE, Math.round(value))
    )
  }

  /** 切换设备预设；切到自定义时以当前尺寸初始化 */
  function setDevice(device: DesignerDevice) {
    if (device === 'custom') {
      const current = deviceSize.value
      customDeviceSize.width = current.width
      customDeviceSize.height = current.height
    }
    previewDevice.value = device
  }

  /** 手动修改画布尺寸（Chrome 移动端调试交互），自动进入自定义模式 */
  function setDeviceSize(size: { width?: number; height?: number }) {
    const current = deviceSize.value
    customDeviceSize.width = clampDeviceSize(size.width ?? current.width)
    customDeviceSize.height = clampDeviceSize(size.height ?? current.height)
    previewDevice.value = 'custom'
  }

  /** 横竖屏切换 */
  function rotateDevice() {
    const current = deviceSize.value
    customDeviceSize.width = current.height
    customDeviceSize.height = current.width
    previewDevice.value = 'custom'
  }
  const previewUser = reactive<Record<string, unknown>>({
    id: 'preview-user',
    name: '预览用户',
    role: 'admin',
  })
  const clipboard = shallowRef<ComponentSchema[]>([])
  const clipboardSize = ref(0)
  const versions = ref<PublishedVersion[]>([])

  const history = new HistoryManager()
  const historyVersion = ref(0)
  history.onChange = () => {
    historyVersion.value += 1
  }

  const structureVersion = ref(0)
  const indexCache = new Map<string, { version: number; index: SchemaIndex }>()

  const activePage = computed<PageSchema>(
    () =>
      schema.pages.find((item) => item.id === activePageId.value) ??
      schema.pages[0]
  )

  const activeIndex = computed<SchemaIndex>(() => {
    const page = activePage.value
    const version = structureVersion.value
    const cached = indexCache.get(page?.id ?? ROOT_ID)
    if (cached && cached.version === version) return cached.index
    const index = new SchemaIndex(page?.components ?? [])
    indexCache.set(page?.id ?? ROOT_ID, { version, index })
    return index
  })

  const pages = computed(() => schema.pages)

  const selectedNodes = computed(() =>
    selectedIds.value
      .map((id) => activeIndex.value.get(id))
      .filter((node): node is ComponentSchema => !!node)
  )

  const primarySelectedId = computed(() =>
    selectedIds.value.length
      ? selectedIds.value[selectedIds.value.length - 1]
      : undefined
  )
  const primarySelectedNode = computed(() =>
    primarySelectedId.value
      ? activeIndex.value.get(primarySelectedId.value)
      : undefined
  )

  const canUndo = computed(() => {
    historyVersion.value
    return history.canUndo
  })
  const canRedo = computed(() => {
    historyVersion.value
    return history.canRedo
  })

  const runtime = createRuntime({
    schema,
    page: activePage,
    device: previewDevice,
    user: previewUser,
    navigate: (path, query) => {
      const search = query
        ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
        : ''
      window.open(`${path}${search}`, '_blank')
    },
    onWorkflowRun: (workflowId, result) => {
      if (result.status === 'error') {
        console.warn(`[low-code] 工作流 ${workflowId} 执行失败`, result)
      }
    },
  })

  let saveTimer: number | undefined
  function markDirty() {
    dirty.value = true
    if (saveTimer) window.clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => {
      saveDraft(structuredCloneSafe(toRaw(schema)) as ApplicationSchema)
      lastSavedAt.value = Date.now()
      dirty.value = false
      saveTimer = undefined
    }, 800)
  }

  function bumpStructure() {
    structureVersion.value += 1
  }

  function execute(
    entry: HistoryEntry,
    options: { mergeKey?: string; structural?: boolean } = {}
  ) {
    entry.redo()
    history.push(entry, { mergeKey: options.mergeKey })
    if (options.structural) bumpStructure()
    markDirty()
  }

  /** 记录一个已实时应用的操作（如拖拽中已直接修改样式，结束时补记录） */
  function recordHistory(
    entry: Omit<HistoryEntry, 'timestamp'>,
    options: { mergeKey?: string; structural?: boolean } = {}
  ) {
    history.push(entry, { mergeKey: options.mergeKey })
    if (options.structural) bumpStructure()
    markDirty()
  }

  function select(id: string, additive = false) {
    if (!activeIndex.value.get(id)) return
    if (additive) {
      if (selectedIds.value.includes(id)) {
        selectedIds.value = selectedIds.value.filter((item) => item !== id)
      } else {
        selectedIds.value = [...selectedIds.value, id]
      }
    } else {
      selectedIds.value = [id]
    }
  }

  function selectMany(ids: string[]) {
    selectedIds.value = [
      ...new Set(ids.filter((id) => !!activeIndex.value.get(id))),
    ]
  }

  function toggleSelect(id: string) {
    select(id, true)
  }

  function clearSelection() {
    selectedIds.value = []
  }

  function isSelected(id: string) {
    return selectedIds.value.includes(id)
  }

  function createNode(
    type: string,
    kind?: ComponentKind
  ): ComponentSchema | undefined {
    const definition = componentRegistry.getDefinition(type)
    if (!definition) {
      console.warn(`[low-code] 未注册的组件类型: ${type}`)
      return undefined
    }
    const props: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(definition.defaultProps)) {
      props[key] = structuredCloneSafe(value)
    }
    for (const field of definition.props) {
      if (field.defaultValue !== undefined && props[field.key] === undefined) {
        props[field.key] = structuredCloneSafe(field.defaultValue)
      }
    }
    const node: ComponentSchema = {
      id: createNodeId(type),
      __type: kind ?? definition.kind,
      type,
      props,
      style: definition.defaultStyle
        ? structuredCloneSafe(definition.defaultStyle)
        : undefined,
    }
    if (definition.defaultChildren) {
      const children =
        typeof definition.defaultChildren === 'function'
          ? definition.defaultChildren()
          : definition.defaultChildren
      node.children = children.map((child) =>
        cloneComponent(child, () => createNodeId(child.type))
      )
    }
    return node
  }

  function resolveParentId(type: string, parentId?: string) {
    const index = activeIndex.value
    if (parentId) {
      const parent = index.get(parentId)
      const definition = parent
        ? componentRegistry.getDefinition(parent.type)
        : undefined
      if (
        parent &&
        definition?.acceptsChildren &&
        (!definition.allowedChildren?.length ||
          definition.allowedChildren.includes(type))
      ) {
        return parentId
      }
      return ROOT_ID
    }
    const primary = primarySelectedNode.value
    if (primary) {
      const definition = componentRegistry.getDefinition(primary.type)
      if (
        definition?.acceptsChildren &&
        (!definition.allowedChildren?.length ||
          definition.allowedChildren.includes(type))
      ) {
        return primary.id
      }
    }
    return ROOT_ID
  }

  function addNode(type: string, options: AddNodeOptions = {}) {
    const node = createNode(type)
    if (!node) return undefined
    const parentId = resolveParentId(type, options.parentId)
    execute(
      createInsertCommand(
        activeIndex.value,
        [node],
        parentId,
        options.index,
        '添加组件'
      ),
      { structural: true }
    )
    if (options.select !== false) selectMany([node.id])
    return node
  }

  function removeNodes(ids: string[]) {
    const valid = ids.filter((id) => !!activeIndex.value.get(id))
    if (!valid.length) return
    execute(createRemoveCommand(activeIndex.value, valid), { structural: true })
    selectedIds.value = selectedIds.value.filter((id) => !valid.includes(id))
  }

  function removeSelected() {
    removeNodes(selectedIds.value)
  }

  function duplicateNodes(ids: string[]) {
    const created: string[] = []
    for (const id of [...ids].reverse()) {
      const { entry, node } = createDuplicateCommand(
        activeIndex.value,
        id,
        () => createNodeId(activeIndex.value.get(id)?.type ?? 'node')
      )
      execute(entry, { structural: true })
      if (node) created.unshift(node.id)
    }
    if (created.length) selectMany(created)
  }

  function duplicateSelected() {
    duplicateNodes(selectedIds.value)
  }

  function moveNode(id: string, parentId: string, position: number) {
    if (id === parentId) return
    if (activeIndex.value.contains(id, parentId)) return
    execute(createMoveCommand(activeIndex.value, id, parentId, position), {
      structural: true,
    })
  }

  /** 批量移动（多选拖拽），合并为一条历史记录 */
  function moveNodes(ids: string[], parentId: string, position: number) {
    const index = activeIndex.value
    const valid = ids.filter(
      (id) =>
        !!index.get(id) && id !== parentId && !index.contains(id, parentId)
    )
    if (!valid.length) return
    const moves = valid.map((id, offset) => ({
      entry: createMoveCommand(index, id, parentId, position + offset),
    }))
    execute(
      {
        label: '移动组件',
        undo: () => {
          for (const move of [...moves].reverse()) move.entry.undo()
        },
        redo: () => {
          for (const move of moves) move.entry.redo()
        },
        timestamp: 0,
      },
      { structural: true }
    )
  }

  function reorderNode(id: string, direction: 'up' | 'down') {
    const entry = createReorderCommand(activeIndex.value, id, direction)
    if (entry) execute(entry, { structural: true })
  }

  function bringToFront(id: string) {
    const index = activeIndex.value
    const parentId = index.getParentId(id)
    moveNode(id, parentId, index.getChildren(parentId).length - 1)
  }

  function sendToBack(id: string) {
    moveNode(id, activeIndex.value.getParentId(id), 0)
  }

  function moveOut(id: string) {
    const index = activeIndex.value
    const parentId = index.getParentId(id)
    if (parentId === ROOT_ID) return
    moveNode(id, index.getParentId(parentId), index.indexOf(parentId) + 1)
  }

  function moveIn(id: string) {
    const index = activeIndex.value
    const parentId = index.getParentId(id)
    const siblings = index.getChildren(parentId)
    for (let i = index.indexOf(id) - 1; i >= 0; i -= 1) {
      const candidate = siblings[i]
      if (componentRegistry.getDefinition(candidate.type)?.acceptsChildren) {
        moveNode(id, candidate.id, index.getChildren(candidate.id).length)
        return
      }
    }
  }

  /** 将选中节点包进一个新容器 */
  function wrapInContainer(ids: string[], containerType: string) {
    const index = activeIndex.value
    const roots = ids.filter(
      (id) =>
        !!index.get(id) &&
        !ids.some((other) => other !== id && index.contains(other, id))
    )
    const first = roots[0]
    if (!first) return
    const wrapper = createNode(containerType)
    if (!wrapper) return
    const parentId = index.getParentId(first)
    const position = index.indexOf(first)
    const nodes = roots
      .map((id) => index.get(id))
      .filter((node): node is ComponentSchema => !!node)

    const insert = createInsertCommand(
      index,
      [wrapper],
      parentId,
      position,
      '添加容器'
    )
    const moves = nodes.map((node, offset) => ({
      entry: createMoveCommand(index, node.id, wrapper.id, offset, '移入容器'),
    }))

    execute(
      {
        label: '创建容器',
        undo: () => {
          for (const move of [...moves].reverse()) move.entry.undo()
          insert.undo()
        },
        redo: () => {
          insert.redo()
          for (const move of moves) move.entry.redo()
        },
        timestamp: 0,
      },
      { structural: true }
    )
    selectMany([wrapper.id])
  }

  function updateNode(
    id: string,
    patch: NodePatch,
    options: { label?: string; mergeKey?: string } = {}
  ) {
    execute(createUpdateCommand(activeIndex.value, id, patch, options.label), {
      mergeKey: options.mergeKey,
    })
  }

  function updateNodes(ids: string[], patch: NodePatch, label?: string) {
    if (!ids.length) return
    execute(createBatchUpdateCommand(activeIndex.value, ids, patch, label))
  }

  function updateStyle(id: string, style: Partial<StyleSchema>) {
    updateNode(id, { style }, { label: '更新样式', mergeKey: `style:${id}` })
  }

  function setBinding(
    id: string,
    prop: string,
    expression: string | undefined
  ) {
    updateNode(
      id,
      { bindings: { [prop]: expression } },
      {
        label: expression ? `绑定 ${prop}` : `解除 ${prop} 绑定`,
        mergeKey: `binding:${id}:${prop}`,
      }
    )
  }

  function setEvents(id: string, events: ComponentSchema['events']) {
    updateNode(id, { events }, { label: '更新事件' })
  }

  function toggleLock(id: string) {
    const node = activeIndex.value.get(id)
    if (!node) return
    updateNode(
      id,
      { locked: !node.locked },
      {
        label: node.locked ? '解锁' : '锁定',
      }
    )
  }

  function toggleHidden(id: string) {
    const node = activeIndex.value.get(id)
    if (!node) return
    updateNode(
      id,
      { hidden: !node.hidden },
      {
        label: node.hidden ? '显示' : '隐藏',
      }
    )
  }

  function renameNode(id: string, name: string) {
    updateNode(id, { name }, { label: '重命名', mergeKey: `rename:${id}` })
  }

  function copySelection() {
    const index = activeIndex.value
    const roots = selectedIds.value.filter(
      (id) =>
        !selectedIds.value.some(
          (other) => other !== id && index.contains(other, id)
        )
    )
    clipboard.value = roots
      .map((id) => index.get(id))
      .filter((node): node is ComponentSchema => !!node)
      .map((node) => structuredCloneSafe(node) as ComponentSchema)
    clipboardSize.value = clipboard.value.length
  }

  function pasteClipboard(targetId?: string) {
    if (!clipboard.value.length) return
    const index = activeIndex.value
    const target = targetId ? index.get(targetId) : primarySelectedNode.value
    let parentId = ROOT_ID
    let position: number | undefined
    if (target) {
      const definition = componentRegistry.getDefinition(target.type)
      if (definition?.acceptsChildren) {
        parentId = target.id
        position = index.getChildren(target.id).length
      } else {
        parentId = index.getParentId(target.id)
        position = index.indexOf(target.id) + 1
      }
    }
    const clones = clipboard.value.map((node) =>
      cloneComponent(node, () => createNodeId(node.type))
    )
    execute(
      createInsertCommand(index, clones, parentId, position, '粘贴组件'),
      {
        structural: true,
      }
    )
    selectMany(clones.map((node) => node.id))
  }

  function editSection<K extends keyof ApplicationSchema>(
    key: K,
    label: string,
    mutator: (value: ApplicationSchema[K]) => void,
    mergeKey?: string
  ) {
    const before = structuredCloneSafe(toRaw(schema[key]))
    mutator(schema[key])
    const after = structuredCloneSafe(toRaw(schema[key]))
    history.push(
      {
        label,
        undo: () => {
          ;(schema as unknown as Record<string, unknown>)[key as string] =
            before
          bumpStructure()
        },
        redo: () => {
          ;(schema as unknown as Record<string, unknown>)[key as string] =
            structuredCloneSafe(after)
          bumpStructure()
        },
      },
      { mergeKey }
    )
    bumpStructure()
    markDirty()
  }

  function addPage(name: string, path: string) {
    editSection('pages', '新增页面', (pages) => {
      pages.push({ id: createNodeId('page'), name, path, components: [] })
    })
  }

  function removePage(id: string) {
    if (schema.pages.length <= 1) return
    editSection('pages', '删除页面', (pages) => {
      const index = pages.findIndex((page) => page.id === id)
      if (index >= 0) pages.splice(index, 1)
    })
    if (activePageId.value === id) {
      activePageId.value = schema.pages[0]?.id ?? ''
      clearSelection()
    }
  }

  function setActivePage(id: string) {
    if (!schema.pages.some((page) => page.id === id)) return
    activePageId.value = id
    clearSelection()
  }

  /** 手动保存到草稿（未发布） */
  function saveDraftNow() {
    if (saveTimer) {
      window.clearTimeout(saveTimer)
      saveTimer = undefined
    }
    const saved = saveDraft(
      structuredCloneSafe(toRaw(schema)) as ApplicationSchema
    )
    if (saved) {
      lastSavedAt.value = Date.now()
      dirty.value = false
    }
    return saved
  }

  function refreshVersions() {
    versions.value = listPublished(schema.app.id).map((item) => ({
      id: item.id,
      version: item.version,
      time: item.time,
      note: item.note,
      current: item.current,
      snapshotSchema: item.schema,
    }))
  }

  const currentVersion = computed(() =>
    versions.value.find((item) => item.current)
  )

  /** 发布新版本：写入版本记录、发布说明，并维护当前线上版本 */
  function publish(options: {
    version: string
    note?: string
    setCurrent?: boolean
  }) {
    const snapshot = publishApp(
      structuredCloneSafe(toRaw(schema)) as ApplicationSchema,
      options
    )
    // 应用版本号跟随发布版本，便于下一次自增
    if (schema.app.version !== options.version) {
      editSection(
        'app',
        '更新应用版本号',
        (app) => {
          app.version = options.version
        },
        undefined
      )
    }
    refreshVersions()
    saveDraftNow()
    return versions.value.find(
      (item) => item.id === snapshot.id
    ) as PublishedVersion
  }

  function setCurrentVersion(id: string) {
    persistCurrentVersion(schema.app.id, id)
    refreshVersions()
  }

  function deleteVersion(id: string) {
    deletePublished(schema.app.id, id)
    refreshVersions()
  }

  function applySnapshot(snapshot: ApplicationSchema) {
    const next = structuredCloneSafe(snapshot)
    schema.version = next.version
    schema.app = next.app
    schema.pages = next.pages
    schema.dataSources = next.dataSources
    schema.queries = next.queries
    schema.actions = next.actions
    schema.workflows = next.workflows
    schema.variables = next.variables
    schema.theme = next.theme
    schema.permissions = next.permissions
    if (!schema.pages.length) {
      schema.pages = createDefaultApplication().pages
    }
    activePageId.value = schema.pages[0]?.id ?? ''
    clearSelection()
    bumpStructure()
  }

  function restoreVersion(snapshot: ApplicationSchema) {
    const before = structuredCloneSafe(toRaw(schema)) as ApplicationSchema
    const after = structuredCloneSafe(snapshot)
    applySnapshot(after)
    history.push({
      label: '恢复版本',
      undo: () => applySnapshot(before),
      redo: () => applySnapshot(after),
    })
    markDirty()
  }

  function resetApplication() {
    clearDraft(schema.app.id)
    applySnapshot(createDefaultApplication())
    history.clear()
    saveDraftNow()
  }

  refreshVersions()

  return {
    schema,
    pages,
    activePageId,
    activePage,
    activeIndex,
    selectedIds,
    selectedNodes,
    primarySelectedId,
    primarySelectedNode,
    hoveredId,
    history,
    historyVersion,
    canUndo,
    canRedo,
    runtime,
    previewDevice,
    deviceSize,
    setDevice,
    setDeviceSize,
    rotateDevice,
    customDeviceSize,
    previewUser,
    clipboardSize,
    versions,
    select,
    selectMany,
    toggleSelect,
    clearSelection,
    isSelected,
    addNode,
    removeNodes,
    removeSelected,
    duplicateNodes,
    duplicateSelected,
    moveNode,
    moveNodes,
    reorderNode,
    bringToFront,
    sendToBack,
    moveOut,
    moveIn,
    wrapInContainer,
    updateNode,
    updateNodes,
    updateStyle,
    setBinding,
    setEvents,
    toggleLock,
    toggleHidden,
    renameNode,
    recordHistory,
    markDirty,
    copySelection,
    pasteClipboard,
    editSection,
    addPage,
    removePage,
    setActivePage,
    saveDraftNow,
    dirty,
    lastSavedAt,
    currentVersion,
    publish,
    setCurrentVersion,
    deleteVersion,
    restoreVersion,
    resetApplication,
    refreshVersions,
  }
}
