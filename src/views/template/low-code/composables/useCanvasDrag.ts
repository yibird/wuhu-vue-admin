import { computed, onBeforeUnmount, type Ref } from 'vue'
import {
  useDragDropMonitor,
  useDragOperation,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/vue'
import { arrayMove } from '@dnd-kit/helpers'
import { isSortable } from '@dnd-kit/vue/sortable'
import { isDesignerComponentType } from '../components/controls/registry'
import type {
  DesignerComponentType,
  DesignerDropTarget,
  DesignerNode,
} from '../types'

interface UseDesignerCanvasDragOptions {
  nodes: Readonly<Ref<DesignerNode[]>>
  rootElement: Readonly<Ref<HTMLElement | null>>
  onDropComponent: (
    type: DesignerComponentType,
    target: DesignerDropTarget
  ) => void
  onMoveNode: (id: string, target: DesignerDropTarget) => void
  onReorder: (orderedIds: string[], selectedId: string) => void
}

interface PaletteDragData {
  componentType: DesignerComponentType
  kind: 'palette'
}

interface NodeDragData {
  index: number
  kind: 'node'
  nodeId: string
  parentId?: string
}

interface RootDropData {
  kind: 'root'
}

interface ContainerDropData {
  index: number
  kind: 'container'
  parentId: string
}

type DesignerDragData = NodeDragData | PaletteDragData
type DesignerDropData = ContainerDropData | NodeDragData | RootDropData

const bodyDraggingClass = 'low-code-designer--dragging'
const groupPrefix = 'low-code-group:'
export const lowCodeRootGroup = `${groupPrefix}root`

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getDragData(value: unknown): DesignerDragData | undefined {
  if (!isRecord(value)) return undefined

  if (
    value.kind === 'palette' &&
    typeof value.componentType === 'string' &&
    isDesignerComponentType(value.componentType)
  ) {
    return { componentType: value.componentType, kind: 'palette' }
  }

  if (value.kind === 'node' && typeof value.nodeId === 'string') {
    return {
      index: typeof value.index === 'number' ? value.index : 0,
      kind: 'node',
      nodeId: value.nodeId,
      parentId: typeof value.parentId === 'string' ? value.parentId : undefined,
    }
  }

  return undefined
}

function getDropData(value: unknown): DesignerDropData | undefined {
  if (!isRecord(value)) return undefined
  if (value.kind === 'root') return { kind: 'root' }

  if (
    value.kind === 'container' &&
    typeof value.parentId === 'string' &&
    typeof value.index === 'number'
  ) {
    return {
      index: value.index,
      kind: 'container',
      parentId: value.parentId,
    }
  }

  if (
    value.kind === 'node' &&
    typeof value.nodeId === 'string' &&
    typeof value.index === 'number'
  ) {
    return {
      index: value.index,
      kind: 'node',
      nodeId: value.nodeId,
      parentId: typeof value.parentId === 'string' ? value.parentId : undefined,
    }
  }

  return undefined
}

function setDocumentDraggingState(value: boolean) {
  if (typeof document === 'undefined') return
  document.body.classList.toggle(bodyDraggingClass, value)
}

function getClientY(event: DragEndEvent) {
  const nativeEvent = event.nativeEvent
  return nativeEvent && 'clientY' in nativeEvent
    ? Number(nativeEvent.clientY)
    : undefined
}

function getClientPoint(event: DragEndEvent) {
  const nativeEvent = event.nativeEvent
  if (
    !nativeEvent ||
    !('clientX' in nativeEvent) ||
    !('clientY' in nativeEvent)
  ) {
    return undefined
  }

  return {
    x: Number(nativeEvent.clientX),
    y: Number(nativeEvent.clientY),
  }
}

function getParentId(group: unknown) {
  if (typeof group !== 'string' || !group.startsWith(groupPrefix)) {
    return undefined
  }

  const id = group.slice(groupPrefix.length)
  return id === 'root' ? undefined : id
}

export function useDesignerCanvasDrag(options: UseDesignerCanvasDragOptions) {
  const operation = useDragOperation()
  const activeDragData = computed(() => getDragData(operation.source?.data))
  const isDraggingNode = computed(
    () => !operation.status.idle && activeDragData.value?.kind === 'node'
  )

  function getRootDropTarget(clientY?: number, draggedId?: string) {
    const root = options.rootElement.value
    if (!root || clientY === undefined) {
      return { index: options.nodes.value.length }
    }

    const elements = Array.from(
      root.querySelectorAll<HTMLElement>(
        '[data-low-code-root-node-list] > [data-low-code-node-id]'
      )
    ).filter((element) => element.dataset.lowCodeNodeId !== draggedId)
    const index = elements.findIndex((element) => {
      const rect = element.getBoundingClientRect()
      return clientY < rect.top + rect.height / 2
    })

    return { index: index === -1 ? elements.length : index }
  }

  function getNodeDropTarget(data: NodeDragData, clientY?: number) {
    if (clientY === undefined) {
      return { index: data.index, parentId: data.parentId }
    }

    const element = options.rootElement.value?.querySelector<HTMLElement>(
      `[data-low-code-node-id="${data.nodeId}"]`
    )
    const isAfter = element
      ? clientY >=
        element.getBoundingClientRect().top + element.offsetHeight / 2
      : false

    return {
      index: data.index + (isAfter ? 1 : 0),
      parentId: data.parentId,
    }
  }

  function getDropDataAtPoint(
    event: DragEndEvent
  ): DesignerDropData | undefined {
    const root = options.rootElement.value
    const point = getClientPoint(event)
    if (!root || !point) return undefined

    const rootRect = root.getBoundingClientRect()
    if (
      point.x < rootRect.left ||
      point.x > rootRect.right ||
      point.y < rootRect.top ||
      point.y > rootRect.bottom
    ) {
      return undefined
    }

    const hitElements = document.elementsFromPoint(point.x, point.y)
    for (const element of hitElements) {
      const dropZone = element.closest<HTMLElement>(
        '[data-low-code-container-drop-zone]'
      )
      const parentId = dropZone?.dataset.lowCodeContainerId
      if (dropZone && parentId && root.contains(dropZone)) {
        const nodeList = dropZone.querySelector<HTMLElement>(
          ':scope > [data-low-code-node-list]'
        )
        return {
          index: nodeList?.children.length ?? 0,
          kind: 'container',
          parentId,
        }
      }

      const nodeElement = element.closest<HTMLElement>(
        '[data-low-code-node-id]'
      )
      const nodeId = nodeElement?.dataset.lowCodeNodeId
      if (!nodeElement || !nodeId || !root.contains(nodeElement)) continue

      const nodeList = nodeElement.parentElement
      const siblings = nodeList
        ? Array.from(nodeList.children).filter((child) =>
            child.hasAttribute('data-low-code-node-id')
          )
        : []
      const parentNode = nodeList?.parentElement?.closest<HTMLElement>(
        '[data-low-code-node-id]'
      )
      return {
        index: Math.max(siblings.indexOf(nodeElement), 0),
        kind: 'node',
        nodeId,
        parentId: parentNode?.dataset.lowCodeNodeId,
      }
    }

    return { kind: 'root' }
  }

  function resolveExplicitDropTarget(
    data: DesignerDropData | undefined,
    clientY: number | undefined,
    draggedId?: string
  ): DesignerDropTarget | undefined {
    if (!data) return undefined
    if (data.kind === 'container') {
      return { index: data.index, parentId: data.parentId }
    }
    if (data.kind === 'node') return getNodeDropTarget(data, clientY)
    return getRootDropTarget(clientY, draggedId)
  }

  function handlePaletteDrop(
    event: DragEndEvent,
    data: PaletteDragData,
    dropData: DesignerDropData | undefined
  ) {
    const target = resolveExplicitDropTarget(dropData, getClientY(event))
    if (!target) return
    options.onDropComponent(data.componentType, target)
  }

  function reorderRootNode(id: string, fromIndex: number, toIndex: number) {
    const ids = options.nodes.value.map((node) => node.id)
    if (fromIndex < 0 || fromIndex >= ids.length) return

    const nextIds = arrayMove(ids, fromIndex, toIndex)
    if (
      nextIds === ids ||
      nextIds.every((item, index) => item === ids[index])
    ) {
      return
    }
    options.onReorder(nextIds, id)
  }

  function handleNodeDrop(
    event: DragEndEvent,
    data: NodeDragData,
    dropData: DesignerDropData | undefined,
    preferExplicitTarget = false
  ) {
    const source = event.operation.source
    if (!source || !isSortable(source)) return

    if (preferExplicitTarget) {
      const target = resolveExplicitDropTarget(
        dropData,
        getClientY(event),
        data.nodeId
      )
      if (target) options.onMoveNode(data.nodeId, target)
      return
    }

    if (dropData?.kind === 'container') {
      options.onMoveNode(data.nodeId, {
        index: dropData.index,
        parentId: dropData.parentId,
      })
      return
    }

    if (dropData?.kind === 'root' && source.group !== lowCodeRootGroup) {
      options.onMoveNode(
        data.nodeId,
        getRootDropTarget(getClientY(event), data.nodeId)
      )
      return
    }

    const parentId = getParentId(source.group)
    const isRootReorder =
      source.initialGroup === lowCodeRootGroup &&
      source.group === lowCodeRootGroup
    if (isRootReorder) {
      reorderRootNode(data.nodeId, source.initialIndex, source.index)
      return
    }

    if (typeof source.index === 'number' && source.group) {
      const sameGroup = source.initialGroup === source.group
      const index =
        sameGroup && source.index > source.initialIndex
          ? source.index + 1
          : source.index
      options.onMoveNode(data.nodeId, { index, parentId })
      return
    }

    const target = resolveExplicitDropTarget(
      dropData,
      getClientY(event),
      data.nodeId
    )
    if (target) options.onMoveNode(data.nodeId, target)
  }

  function handleDragStart(event: DragStartEvent) {
    if (!getDragData(event.operation.source?.data)) return
    setDocumentDraggingState(true)
  }

  function handleDragEnd(event: DragEndEvent) {
    setDocumentDraggingState(false)
    if (event.canceled) return

    const data = getDragData(event.operation.source?.data)
    const registeredDropData = getDropData(event.operation.target?.data)
    const pointDropData = getDropDataAtPoint(event)
    const isStaleSourceTarget =
      data?.kind === 'node' &&
      registeredDropData?.kind === 'node' &&
      registeredDropData.nodeId === data.nodeId &&
      pointDropData?.kind === 'node' &&
      pointDropData.nodeId !== data.nodeId
    const dropData = isStaleSourceTarget
      ? pointDropData
      : (registeredDropData ?? pointDropData)
    if (!data || !dropData) return

    if (data.kind === 'palette') {
      handlePaletteDrop(event, data, dropData)
    } else {
      handleNodeDrop(
        event,
        data,
        dropData,
        !registeredDropData || isStaleSourceTarget
      )
    }
  }

  useDragDropMonitor({
    onDragEnd: handleDragEnd,
    onDragStart: handleDragStart,
  })

  onBeforeUnmount(() => setDocumentDraggingState(false))

  return {
    isDraggingNode,
  }
}
