import { reactive, ref, shallowRef } from 'vue'
import type { Ref } from 'vue'
import { collectIds, ROOT_ID } from '../core/schema'
import { componentRegistry } from '../core/registry'
import { getLayout, mergeStyle } from '../core/runtime/style'
import {
  buildDropTarget,
  computeEqualSpacing,
  directChildElements,
  findDropContainerAt,
  findNodeElementAt,
  pointToStage,
  toStageRect,
} from '../utils/canvasGeometry'
import type { Rect } from '../utils/canvasGeometry'
import {
  endPaletteDrag,
  paletteDragType,
  paletteDragging,
} from './usePaletteDrag'
import type { DesignerApi } from './useDesigner'
import type { CanvasViewApi } from './useCanvasView'
import type {
  DragState,
  DropTarget,
  GuideLine,
  MarqueeState,
  ResizeState,
} from '../types'
import type { ComponentSchema, LayoutMode } from '../core/schema/types'

export interface CanvasInteractionOptions {
  designer: DesignerApi
  view: CanvasViewApi
  viewport: Ref<HTMLElement | undefined>
  stage: Ref<HTMLElement | undefined>
  spacePressed: Ref<boolean>
}

interface CandidateTarget {
  id: string
  rect: Rect
}

type Gesture = 'none' | 'pan' | 'marquee' | 'drag' | 'resize'

/**
 * 画布交互：选择 / 多选框选 / 拖拽移动 / 调整尺寸 / 拖拽放置 / 对齐辅助线。
 * 所有操作最终都作用于 Component Tree（SchemaIndex），并进入 History。
 */
export function useCanvasInteraction(options: CanvasInteractionOptions) {
  const { designer, view } = options

  const dragState = shallowRef<DragState | null>(null)
  const dropTarget = shallowRef<DropTarget | null>(null)
  const resizeState = shallowRef<ResizeState | null>(null)
  const guides = shallowRef<GuideLine[]>([])
  const marquee = reactive<MarqueeState>({
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  })

  let gesture: Gesture = 'none'
  let freeStart: { left: number; top: number } | null = null
  let candidates: CandidateTarget[] = []
  let resizePrev: Record<string, unknown> | null = null
  let resizeStartRect: Rect | null = null

  const cursor = ref<'default' | 'grab' | 'grabbing' | 'move'>('default')

  function index() {
    return designer.activeIndex.value
  }

  function stageElement() {
    return options.stage.value
  }

  function excludeSubtree(ids: string[]) {
    const exclude = new Set<string>()
    for (const id of ids) {
      const node = index().get(id)
      if (node) collectIds(node).forEach((item) => exclude.add(item))
    }
    return exclude
  }

  function collectCandidates(parentId: string): CandidateTarget[] {
    const stage = stageElement()
    if (!stage) return []
    const result: CandidateTarget[] = []
    const parentNodeEl =
      parentId === ROOT_ID
        ? stage
        : (stage.querySelector(
            `[data-node-id="${parentId}"]`
          ) as HTMLElement | null)
    if (parentNodeEl) {
      result.push({
        id: '__parent__',
        rect: toStageRect(parentNodeEl, stage, view.zoom.value),
      })
    }
    const containerEl =
      parentId === ROOT_ID
        ? stage.querySelector('[data-drop-container="__root__"]')
        : parentNodeEl
    if (containerEl) {
      for (const child of directChildElements(containerEl as HTMLElement)) {
        const id = child.getAttribute('data-node-id')
        if (!id) continue
        result.push({
          id,
          rect: toStageRect(child, stage, view.zoom.value),
        })
      }
    }
    return result
  }

  function resolveContainerLayout(containerEl: HTMLElement) {
    const ownerId = containerEl.getAttribute('data-drop-container')
    if (!ownerId || ownerId === ROOT_ID) {
      return { layout: 'block' as LayoutMode, direction: 'column' as const }
    }
    const node = index().get(ownerId)
    if (!node) {
      return { layout: 'block' as LayoutMode, direction: 'column' as const }
    }
    const style = mergeStyle(node.style, designer.runtime.device.value)
    return {
      layout: getLayout(style),
      direction: (style.direction ?? 'column') as 'row' | 'column',
    }
  }

  /** 计算拖拽/放置目标 */
  function resolveDropTarget(
    clientX: number,
    clientY: number,
    exclude: Set<string>,
    dragType?: string
  ): DropTarget | null {
    const stage = stageElement()
    if (!stage) return null
    const containerEl = findDropContainerAt(clientX, clientY, exclude)
    if (!containerEl) return null
    const ownerId = containerEl.getAttribute('data-drop-container') ?? ROOT_ID
    if (ownerId !== ROOT_ID && exclude.has(ownerId)) return null

    const { layout, direction } = resolveContainerLayout(containerEl)
    const owner = ownerId === ROOT_ID ? undefined : index().get(ownerId)
    const definition = owner
      ? componentRegistry.getDefinition(owner.type)
      : undefined
    let allowed = true
    let reason: string | undefined
    if (owner) {
      if (!definition?.acceptsChildren) {
        allowed = false
        reason = '目标组件不是容器'
      } else if (
        dragType &&
        definition.allowedChildren?.length &&
        !definition.allowedChildren.includes(dragType)
      ) {
        allowed = false
        reason = '该容器不支持放置此组件'
      }
    }

    const position = computePosition(
      containerEl,
      clientX,
      clientY,
      layout,
      direction,
      exclude
    )
    return buildDropTarget({
      container: containerEl,
      containerId: ownerId,
      index: position,
      layout,
      direction,
      stage,
      scale: view.zoom.value,
      excludeIds: exclude,
      allowed,
      reason,
    })
  }

  function computePosition(
    containerEl: HTMLElement,
    clientX: number,
    clientY: number,
    layout: LayoutMode,
    direction: 'row' | 'column',
    exclude: Set<string>
  ) {
    if (layout === 'free') {
      return directChildElements(containerEl, exclude).length
    }
    const children = directChildElements(containerEl, exclude)
    if (layout === 'grid') {
      for (let i = 0; i < children.length; i += 1) {
        const rect = children[i].getBoundingClientRect()
        if (clientY < rect.top + rect.height / 2) return i
        if (clientY <= rect.bottom && clientX < rect.left + rect.width / 2) {
          return i
        }
      }
      return children.length
    }
    const isRow = layout === 'flex' && direction === 'row'
    for (let i = 0; i < children.length; i += 1) {
      const rect = children[i].getBoundingClientRect()
      const before = isRow
        ? clientX < rect.left + rect.width / 2
        : clientY < rect.top + rect.height / 2
      if (before) return i
    }
    return children.length
  }

  /** ---------------- 指针手势 ---------------- */

  function onViewportPointerDown(event: PointerEvent) {
    if (event.button === 2) return
    const target = event.target as HTMLElement
    if (target.closest('[data-canvas-ui]')) return

    if (
      event.button === 1 ||
      (event.button === 0 && options.spacePressed.value)
    ) {
      event.preventDefault()
      view.startPan(event)
      gesture = 'pan'
      cursor.value = 'grabbing'
      attachWindowListeners()
      return
    }

    if (event.button !== 0) return

    const nodeEl = findNodeElementAt(event.clientX, event.clientY)
    if (!nodeEl) {
      const stage = stageElement()
      if (!stage) return
      const point = pointToStage(
        event.clientX,
        event.clientY,
        stage,
        view.zoom.value
      )
      marquee.active = true
      marquee.startX = point.x
      marquee.startY = point.y
      marquee.currentX = point.x
      marquee.currentY = point.y
      if (!event.shiftKey) designer.clearSelection()
      gesture = 'marquee'
      attachWindowListeners()
      return
    }

    const id = nodeEl.getAttribute('data-node-id')
    if (!id) return
    const node = index().get(id)
    if (!node) return

    if (event.shiftKey) {
      designer.toggleSelect(id)
    } else if (!designer.selectedIds.value.includes(id)) {
      designer.select(id)
    }

    if (node.locked) return

    dragState.value = {
      ids: [...designer.selectedIds.value],
      startX: event.clientX,
      startY: event.clientY,
      pointerX: event.clientX,
      pointerY: event.clientY,
      active: false,
      target: null,
      free: null,
    }
    freeStart = null
    gesture = 'drag'
    attachWindowListeners()
  }

  function activateDrag(event: PointerEvent) {
    const state = dragState.value
    if (!state) return
    state.active = true
    state.pointerX = event.clientX
    state.pointerY = event.clientY

    if (state.ids.length === 1) {
      const node = index().get(state.ids[0])
      const parentId = index().getParentId(state.ids[0])
      const parent = parentId === ROOT_ID ? undefined : index().get(parentId)
      const parentLayout = parent
        ? getLayout(mergeStyle(parent.style, designer.runtime.device.value))
        : 'block'
      if (node && parentLayout === 'free') {
        freeStart = {
          left: Number(node.style?.left ?? 0),
          top: Number(node.style?.top ?? 0),
        }
        candidates = collectCandidates(parentId)
        const stage = stageElement()
        const el = stage?.querySelector(
          `[data-node-id="${node.id}"]`
        ) as HTMLElement | null
        if (el && stage) {
          resizeStartRect = toStageRect(el, stage, view.zoom.value)
          state.freeSize = {
            width: resizeStartRect.width,
            height: resizeStartRect.height,
          }
        }
      }
    }
    cursor.value = 'move'
  }

  function onDragMove(event: PointerEvent) {
    const state = dragState.value
    if (!state) return
    if (!state.active) {
      const distance = Math.hypot(
        event.clientX - state.startX,
        event.clientY - state.startY
      )
      if (distance < 4) return
      activateDrag(event)
    }
    state.pointerX = event.clientX
    state.pointerY = event.clientY

    // 自由布局：实时移动并显示对齐辅助线
    if (freeStart && resizeStartRect && state.ids.length === 1) {
      const deltaX = (event.clientX - state.startX) / view.zoom.value
      const deltaY = (event.clientY - state.startY) / view.zoom.value
      const rect: Rect = {
        x: Math.round(freeStart.left + deltaX),
        y: Math.round(freeStart.top + deltaY),
        width: resizeStartRect.width,
        height: resizeStartRect.height,
      }
      const alignment = alignRect(rect, candidates, true)
      const left = Math.round(rect.x + (alignment.deltaX ?? 0))
      const top = Math.round(rect.y + (alignment.deltaY ?? 0))
      guides.value = alignment.guides
      state.free = { left, top }
      state.target = null
      return
    }

    // 常规布局：计算放置目标
    const exclude = excludeSubtree(state.ids)
    const dragType = index().get(state.ids[0])?.type
    const target = resolveDropTarget(
      event.clientX,
      event.clientY,
      exclude,
      dragType
    )
    if (target && state.ids.includes(target.parentId)) {
      state.target = null
      dropTarget.value = null
      return
    }
    state.target = target
    dropTarget.value = target
    guides.value = []
  }

  function endDrag() {
    const state = dragState.value
    if (!state) return
    if (state.active) {
      if (state.free && state.ids.length === 1 && freeStart) {
        const id = state.ids[0]
        const node = index().get(id)
        if (
          node &&
          (state.free.left !== freeStart.left ||
            state.free.top !== freeStart.top)
        ) {
          designer.updateNode(
            id,
            { style: { left: state.free.left, top: state.free.top } },
            { label: '移动组件' }
          )
        }
      } else if (state.target?.allowed) {
        const target = state.target
        const single = state.ids.length === 1 ? state.ids[0] : undefined
        const currentParent = single ? index().getParentId(single) : undefined
        const currentIndex = single ? index().indexOf(single) : -1
        const samePosition =
          single !== undefined &&
          currentParent === target.parentId &&
          (currentIndex === target.index || currentIndex + 1 === target.index)
        if (!samePosition) {
          designer.moveNodes(state.ids, target.parentId, target.index)
        }
      }
    }
    dragState.value = null
    dropTarget.value = null
    guides.value = []
    freeStart = null
    candidates = []
    resizeStartRect = null
  }

  function onMarqueeMove(event: PointerEvent) {
    const stage = stageElement()
    if (!stage) return
    const point = pointToStage(
      event.clientX,
      event.clientY,
      stage,
      view.zoom.value
    )
    marquee.currentX = point.x
    marquee.currentY = point.y
  }

  function endMarquee(event: PointerEvent) {
    const stage = stageElement()
    if (!stage) return
    const x = Math.min(marquee.startX, marquee.currentX)
    const y = Math.min(marquee.startY, marquee.currentY)
    const width = Math.abs(marquee.currentX - marquee.startX)
    const height = Math.abs(marquee.currentY - marquee.startY)
    const moved = Math.hypot(
      (marquee.currentX - marquee.startX) * view.zoom.value,
      (marquee.currentY - marquee.startY) * view.zoom.value
    )

    if (moved >= 4) {
      const rect: Rect = { x, y, width, height }
      const matched: string[] = []
      const nodeElements = stage.querySelectorAll<HTMLElement>('[data-node-id]')
      nodeElements.forEach((element) => {
        const id = element.getAttribute('data-node-id')
        if (!id) return
        const nodeRect = toStageRect(element, stage, view.zoom.value)
        const intersects =
          nodeRect.x < rect.x + rect.width &&
          nodeRect.x + nodeRect.width > rect.x &&
          nodeRect.y < rect.y + rect.height &&
          nodeRect.y + nodeRect.height > rect.y
        if (intersects) matched.push(id)
      })
      const idSet = new Set(matched)
      const roots = matched.filter((id) => {
        let parent = index().getParentId(id)
        while (parent !== ROOT_ID) {
          if (idSet.has(parent)) return false
          parent = index().getParentId(parent)
        }
        return true
      })
      if (event.shiftKey) {
        designer.selectMany([...designer.selectedIds.value, ...roots])
      } else {
        designer.selectMany(roots)
      }
    }
    marquee.active = false
  }

  /** ---------------- 拖拽放置（组件面板） ---------------- */

  function onViewportDragOver(event: DragEvent) {
    if (!paletteDragType.value) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
    paletteDragging.value = true
    dropTarget.value = resolveDropTarget(
      event.clientX,
      event.clientY,
      new Set(),
      paletteDragType.value
    )
  }

  function onViewportDragLeave(event: DragEvent) {
    const viewport = options.viewport.value
    if (!viewport) return
    const related = event.relatedTarget
    if (related instanceof Node && viewport.contains(related)) return
    dropTarget.value = null
  }

  function onViewportDrop(event: DragEvent) {
    const type = paletteDragType.value
    if (!type) return
    event.preventDefault()
    const target = dropTarget.value
    paletteDragging.value = false
    dropTarget.value = null
    endPaletteDrag()
    if (!target || !target.allowed) return
    designer.addNode(type, { parentId: target.parentId, index: target.index })
  }

  /** ---------------- 调整尺寸 ---------------- */

  function onResizePointerDown(event: PointerEvent) {
    const handleEl = (event.target as HTMLElement).closest(
      '[data-resize-handle]'
    ) as HTMLElement | null
    if (!handleEl) return
    event.preventDefault()
    event.stopPropagation()
    const nodeEl = handleEl.closest('[data-node-id]') as HTMLElement | null
    const stage = stageElement()
    if (!nodeEl || !stage) return
    const id = nodeEl.getAttribute('data-node-id')
    if (!id) return
    const node = index().get(id)
    if (!node) return
    const rect = toStageRect(nodeEl, stage, view.zoom.value)
    resizeStartRect = rect
    resizePrev = {
      width: node.style?.width,
      height: node.style?.height,
      left: node.style?.left,
      top: node.style?.top,
      position: node.style?.position,
    }
    resizeState.value = {
      id,
      handle: handleEl.getAttribute('data-resize-handle') ?? 'se',
      startX: event.clientX,
      startY: event.clientY,
      active: true,
      width: rect.width,
      height: rect.height,
      left: rect.x,
      top: rect.y,
    }
    candidates = collectCandidates(index().getParentId(id))
    gesture = 'resize'
    cursor.value = 'move'
    attachWindowListeners()
  }

  function onResizeMove(event: PointerEvent) {
    const state = resizeState.value
    const startRect = resizeStartRect
    if (!state || !startRect) return
    const dx = (event.clientX - state.startX) / view.zoom.value
    const dy = (event.clientY - state.startY) / view.zoom.value
    let left = startRect.x
    let top = startRect.y
    let width = startRect.width
    let height = startRect.height
    const handle = state.handle
    const hasEast = handle.includes('e')
    const hasWest = handle.includes('w')
    const hasSouth = handle.includes('s')
    const hasNorth = handle.includes('n')

    if (hasEast) width = Math.max(8, startRect.width + dx)
    if (hasSouth) height = Math.max(8, startRect.height + dy)
    if (hasWest) {
      width = Math.max(8, startRect.width - dx)
      left = startRect.x + (startRect.width - width)
    }
    if (hasNorth) {
      height = Math.max(8, startRect.height - dy)
      top = startRect.y + (startRect.height - height)
    }

    const nextGuides: GuideLine[] = []
    if (hasEast || hasWest) {
      const edge = hasEast ? left + width : left
      const snap = findSnap(edge, candidates, 'vertical')
      if (snap) {
        if (hasEast) width += snap.delta
        else {
          left += snap.delta
          width -= snap.delta
        }
        nextGuides.push(snap.guide)
      }
    }
    if (hasNorth || hasSouth) {
      const edge = hasSouth ? top + height : top
      const snap = findSnap(edge, candidates, 'horizontal')
      if (snap) {
        if (hasSouth) height += snap.delta
        else {
          top += snap.delta
          height -= snap.delta
        }
        nextGuides.push(snap.guide)
      }
    }

    width = Math.max(8, Math.round(width))
    height = Math.max(8, Math.round(height))
    left = Math.round(left)
    top = Math.round(top)

    resizeState.value = { ...state, width, height, left, top }
    guides.value = nextGuides

    const node = index().get(state.id)
    if (!node) return
    const style: Record<string, unknown> = {
      ...(node.style as Record<string, unknown> | undefined),
      width,
      height,
    }
    if (hasWest || hasNorth) {
      style.left = left
      style.top = top
    }
    node.style = style as ComponentSchema['style']
  }

  function endResize() {
    const state = resizeState.value
    const prev = resizePrev
    if (!state || !prev) return
    const node = index().get(state.id)
    if (node) {
      const next = {
        width: node.style?.width,
        height: node.style?.height,
        left: node.style?.left,
        top: node.style?.top,
        position: node.style?.position,
      }
      const changed = (Object.keys(next) as (keyof typeof next)[]).some(
        (key) => next[key] !== prev[key]
      )
      if (changed) {
        const apply = (values: Record<string, unknown>) => {
          const style: Record<string, unknown> = {
            ...(node.style as Record<string, unknown> | undefined),
          }
          for (const [key, value] of Object.entries(values)) {
            if (value === undefined) delete style[key]
            else style[key] = value
          }
          node.style = style as ComponentSchema['style']
        }
        designer.recordHistory({
          label: '调整尺寸',
          undo: () => apply(prev),
          redo: () => apply(next),
        })
      }
    }
    resizeState.value = null
    resizePrev = null
    resizeStartRect = null
    guides.value = []
    candidates = []
  }

  /** ---------------- 对齐辅助 ---------------- */

  function alignRect(
    rect: Rect,
    targets: CandidateTarget[],
    withSpacing: boolean
  ) {
    const result: {
      deltaX?: number
      deltaY?: number
      guides: GuideLine[]
    } = { guides: [] }
    const xSnap = findSnapFromRect(rect, targets, 'x', true)
    const ySnap = findSnapFromRect(rect, targets, 'y', true)
    if (xSnap) {
      result.deltaX = xSnap.delta
      result.guides.push(xSnap.guide)
    }
    if (ySnap) {
      result.deltaY = ySnap.delta
      result.guides.push(ySnap.guide)
    }
    if (withSpacing) {
      const siblings = targets.filter((target) => target.id !== '__parent__')
      const spacingX = computeEqualSpacing(rect, siblings, 'x')
      const spacingY = computeEqualSpacing(rect, siblings, 'y')
      if (spacingX.delta !== undefined && result.deltaX === undefined) {
        result.deltaX = spacingX.delta
        result.guides.push(...spacingX.guides)
      }
      if (spacingY.delta !== undefined && result.deltaY === undefined) {
        result.deltaY = spacingY.delta
        result.guides.push(...spacingY.guides)
      }
    }
    return result
  }

  function findSnapFromRect(
    rect: Rect,
    targets: CandidateTarget[],
    axis: 'x' | 'y',
    includeCenter: boolean
  ): { delta: number; guide: GuideLine } | undefined {
    const edges =
      axis === 'x'
        ? [rect.x, rect.x + rect.width / 2, rect.x + rect.width]
        : [rect.y, rect.y + rect.height / 2, rect.y + rect.height]
    const movingValues = includeCenter ? edges : [edges[0]]
    const threshold = 6 / view.zoom.value
    let best:
      | { delta: number; position: number; start: number; end: number }
      | undefined
    for (const target of targets) {
      const candidateValues =
        axis === 'x'
          ? [
              target.rect.x,
              target.rect.x + target.rect.width / 2,
              target.rect.x + target.rect.width,
            ]
          : [
              target.rect.y,
              target.rect.y + target.rect.height / 2,
              target.rect.y + target.rect.height,
            ]
      for (const candidate of candidateValues) {
        for (const value of movingValues) {
          const delta = candidate - value
          if (Math.abs(delta) <= threshold) {
            if (!best || Math.abs(delta) < Math.abs(best.delta)) {
              best = {
                delta,
                position: candidate,
                start: axis === 'x' ? target.rect.y : target.rect.x,
                end:
                  axis === 'x'
                    ? target.rect.y + target.rect.height
                    : target.rect.x + target.rect.width,
              }
            }
          }
        }
      }
    }
    if (!best) return undefined
    return {
      delta: best.delta,
      guide: {
        id: `${axis}-${best.position}-${Math.round(performance.now())}`,
        orientation: axis === 'x' ? 'vertical' : 'horizontal',
        position: best.position,
        start: best.start,
        end: best.end,
        type: 'edge',
      },
    }
  }

  function findSnap(
    edge: number,
    targets: CandidateTarget[],
    orientation: 'vertical' | 'horizontal'
  ) {
    const axis = orientation === 'vertical' ? 'x' : 'y'
    return findSnapFromRect(
      {
        x: axis === 'x' ? edge : 0,
        y: axis === 'y' ? edge : 0,
        width: 0,
        height: 0,
      },
      targets,
      axis,
      false
    )
  }

  /** ---------------- 事件绑定 ---------------- */

  let attached = false

  function onWindowPointerMove(event: PointerEvent) {
    switch (gesture) {
      case 'pan':
        view.updatePan(event)
        break
      case 'marquee':
        onMarqueeMove(event)
        break
      case 'drag':
        onDragMove(event)
        break
      case 'resize':
        onResizeMove(event)
        break
      default:
        break
    }
  }

  function onWindowPointerUp(event: PointerEvent) {
    switch (gesture) {
      case 'pan':
        view.endPan()
        cursor.value = 'default'
        break
      case 'marquee':
        endMarquee(event)
        break
      case 'drag':
        endDrag()
        cursor.value = 'default'
        break
      case 'resize':
        endResize()
        cursor.value = 'default'
        break
      default:
        break
    }
    gesture = 'none'
    detachWindowListeners()
  }

  function attachWindowListeners() {
    if (attached) return
    attached = true
    window.addEventListener('pointermove', onWindowPointerMove)
    window.addEventListener('pointerup', onWindowPointerUp)
    window.addEventListener('pointercancel', onWindowPointerUp)
  }

  function detachWindowListeners() {
    if (!attached) return
    attached = false
    window.removeEventListener('pointermove', onWindowPointerMove)
    window.removeEventListener('pointerup', onWindowPointerUp)
    window.removeEventListener('pointercancel', onWindowPointerUp)
  }

  function onDispose() {
    detachWindowListeners()
    gesture = 'none'
  }

  return {
    dragState,
    dropTarget,
    resizeState,
    guides,
    marquee,
    cursor,
    onViewportPointerDown,
    onResizePointerDown,
    onViewportDragOver,
    onViewportDragLeave,
    onViewportDrop,
    onDispose,
  }
}
