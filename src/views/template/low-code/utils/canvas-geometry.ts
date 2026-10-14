import type { LayoutMode } from '../core/schema/types'
import type { DropTarget } from '../types'

export const NODE_ATTR = 'data-node-id'
export const CONTAINER_ATTR = 'data-drop-container'
export const UI_ATTR = 'data-canvas-ui'

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export function elementsAtPoint(clientX: number, clientY: number) {
  return document.elementsFromPoint(clientX, clientY) as HTMLElement[]
}

function nodeIdOf(element: Element | null) {
  return element?.getAttribute(NODE_ATTR) ?? undefined
}

/** 命中指针下最深的节点（排除画布 UI 与指定子树） */
export function findNodeElementAt(
  clientX: number,
  clientY: number,
  excludeIds: Set<string> = new Set()
): HTMLElement | undefined {
  const elements = elementsAtPoint(clientX, clientY)
  for (const element of elements) {
    if (element.closest(`[${UI_ATTR}]`)) continue
    const nodeElement = element.closest(`[${NODE_ATTR}]`) as HTMLElement | null
    if (!nodeElement) continue
    const id = nodeIdOf(nodeElement)
    if (!id || excludeIds.has(id)) continue
    return nodeElement
  }
  return undefined
}

/** 命中指针下的可放置容器 */
export function findDropContainerAt(
  clientX: number,
  clientY: number,
  excludeIds: Set<string> = new Set()
): HTMLElement | undefined {
  const elements = elementsAtPoint(clientX, clientY)
  for (const element of elements) {
    const container = element.closest(
      `[${CONTAINER_ATTR}]`
    ) as HTMLElement | null
    if (!container) continue
    const ownerNode = container.closest(`[${NODE_ATTR}]`) as HTMLElement | null
    if (ownerNode) {
      const ownerId = nodeIdOf(ownerNode)
      if (ownerId && excludeIds.has(ownerId)) continue
      if (
        ownerId &&
        [...excludeIds].some((id) => ownerNode.getAttribute(NODE_ATTR) === id)
      ) {
        continue
      }
    }
    return container
  }
  return undefined
}

/** 容器内的直接子节点元素（跳过拖拽中的子树） */
export function directChildElements(
  container: HTMLElement,
  excludeIds: Set<string> = new Set()
): HTMLElement[] {
  return [...container.children].filter((child) => {
    if (!(child instanceof HTMLElement)) return false
    if (child.getAttribute(UI_ATTR) !== null) return false
    const id = nodeIdOf(child)
    if (id && excludeIds.has(id)) return false
    return child.hasAttribute(NODE_ATTR)
  }) as HTMLElement[]
}

/** 将元素矩形转换为 stage 坐标系 */
export function toStageRect(
  element: HTMLElement,
  stage: HTMLElement,
  scale: number
): Rect {
  const rect = element.getBoundingClientRect()
  const stageRect = stage.getBoundingClientRect()
  return {
    x: (rect.left - stageRect.left) / scale,
    y: (rect.top - stageRect.top) / scale,
    width: rect.width / scale,
    height: rect.height / scale,
  }
}

export function pointToStage(
  clientX: number,
  clientY: number,
  stage: HTMLElement,
  scale: number
) {
  const stageRect = stage.getBoundingClientRect()
  return {
    x: (clientX - stageRect.left) / scale,
    y: (clientY - stageRect.top) / scale,
  }
}

function childCenter(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    top: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
  }
}

/**
 * 计算插入位置：
 * 拖拽行为由父容器布局模式决定（block/flex/grid/free），而不是绝对定位。
 */
export function computeInsertIndex(
  container: HTMLElement,
  clientX: number,
  clientY: number,
  layout: LayoutMode,
  direction: 'row' | 'column' = 'column',
  excludeIds: Set<string> = new Set()
): number {
  const children = directChildElements(container, excludeIds)
  if (!children.length) return 0
  if (layout === 'free') return children.length

  if (layout === 'grid') {
    for (let index = 0; index < children.length; index += 1) {
      const center = childCenter(children[index])
      if (clientY < center.y) return index
      if (clientY <= center.bottom && clientX < center.x) return index
    }
    return children.length
  }

  const isRow = layout === 'flex' && direction === 'row'
  for (let index = 0; index < children.length; index += 1) {
    const center = childCenter(children[index])
    if (isRow) {
      if (clientX < center.x) return index
    } else if (clientY < center.y) {
      return index
    }
  }
  return children.length
}

/** 计算放置指示线与容器高亮区域（stage 坐标） */
export function buildDropTarget(options: {
  container: HTMLElement
  containerId: string
  index: number
  layout: LayoutMode
  direction: 'row' | 'column'
  stage: HTMLElement
  scale: number
  excludeIds: Set<string>
  allowed: boolean
  reason?: string
}): DropTarget {
  const {
    container,
    containerId,
    index,
    layout,
    direction,
    stage,
    scale,
    excludeIds,
    allowed,
    reason,
  } = options
  const containerRect = toStageRect(container, stage, scale)
  const children = directChildElements(container, excludeIds)
  const isRow = layout === 'flex' && direction === 'row'
  const padding = 6

  if (!children.length) {
    return {
      parentId: containerId,
      index: 0,
      layout,
      allowed,
      reason,
      containerRect,
      indicator: {
        x: containerRect.x + padding,
        y: containerRect.y + Math.min(containerRect.height / 2, 24),
        length: Math.max(containerRect.width - padding * 2, 40),
        direction: isRow ? 'vertical' : 'horizontal',
      },
    }
  }

  const first = toStageRect(children[0], stage, scale)
  const last = toStageRect(children[children.length - 1], stage, scale)
  const clamped = Math.max(0, Math.min(index, children.length))

  if (isRow) {
    const boundary = clamped >= children.length ? last.x + last.width : first.x
    const target =
      clamped >= children.length
        ? last
        : toStageRect(children[clamped], stage, scale)
    return {
      parentId: containerId,
      index: clamped,
      layout,
      allowed,
      reason,
      containerRect,
      indicator: {
        x: boundary,
        y: target.y + padding,
        length: Math.max(target.height - padding * 2, 24),
        direction: 'vertical',
      },
    }
  }

  if (layout === 'grid') {
    const target =
      clamped >= children.length
        ? undefined
        : toStageRect(children[clamped], stage, scale)
    return {
      parentId: containerId,
      index: clamped,
      layout,
      allowed,
      reason,
      containerRect,
      indicator: target
        ? {
            x: target.x + 4,
            y: target.y - 2,
            length: Math.max(target.width - 8, 24),
            direction: 'horizontal',
          }
        : {
            x: last.x + 4,
            y: last.y + last.height + 2,
            length: Math.max(last.width - 8, 24),
            direction: 'horizontal',
          },
    }
  }

  const boundaryY = clamped >= children.length ? last.y + last.height : first.y
  return {
    parentId: containerId,
    index: clamped,
    layout,
    allowed,
    reason,
    containerRect,
    indicator: {
      x: containerRect.x + padding,
      y: boundaryY,
      length: Math.max(containerRect.width - padding * 2, 40),
      direction: 'horizontal',
    },
  }
}

export interface AlignmentResult {
  deltaX?: number
  deltaY?: number
  guides: {
    id: string
    orientation: 'vertical' | 'horizontal'
    position: number
    start: number
    end: number
    type: 'edge' | 'center' | 'spacing'
  }[]
}

interface CandidateRect {
  id: string
  rect: Rect
}

/**
 * 对齐吸附：左/右/上/下/水平居中/垂直居中，
 * 与父容器对齐、与其他组件对齐。
 */
export function computeAlignment(
  moving: Rect,
  targets: CandidateRect[],
  threshold = 6
): AlignmentResult {
  const result: AlignmentResult = { guides: [] }
  const movingX = [
    { value: moving.x, type: 'edge' as const },
    { value: moving.x + moving.width / 2, type: 'center' as const },
    { value: moving.x + moving.width, type: 'edge' as const },
  ]
  const movingY = [
    { value: moving.y, type: 'edge' as const },
    { value: moving.y + moving.height / 2, type: 'center' as const },
    { value: moving.y + moving.height, type: 'edge' as const },
  ]

  let bestX:
    | { delta: number; position: number; type: 'edge' | 'center' }
    | undefined
  let bestY:
    | { delta: number; position: number; type: 'edge' | 'center' }
    | undefined

  for (const target of targets) {
    const xCandidates = [
      target.rect.x,
      target.rect.x + target.rect.width / 2,
      target.rect.x + target.rect.width,
    ]
    const yCandidates = [
      target.rect.y,
      target.rect.y + target.rect.height / 2,
      target.rect.y + target.rect.height,
    ]
    for (const candidate of xCandidates) {
      for (const point of movingX) {
        const delta = candidate - point.value
        if (Math.abs(delta) <= threshold) {
          if (!bestX || Math.abs(delta) < Math.abs(bestX.delta)) {
            bestX = { delta, position: candidate, type: point.type }
          }
        }
      }
    }
    for (const candidate of yCandidates) {
      for (const point of movingY) {
        const delta = candidate - point.value
        if (Math.abs(delta) <= threshold) {
          if (!bestY || Math.abs(delta) < Math.abs(bestY.delta)) {
            bestY = { delta, position: candidate, type: point.type }
          }
        }
      }
    }
  }

  const parentRect = targets.find((target) => target.id === '__parent__')
  if (bestX) {
    result.deltaX = bestX.delta
    result.guides.push({
      id: `x-${bestX.position}`,
      orientation: 'vertical',
      position: bestX.position,
      start: parentRect ? parentRect.rect.y : 0,
      end: parentRect
        ? parentRect.rect.y + parentRect.rect.height
        : moving.y + moving.height + 200,
      type: bestX.type,
    })
  }
  if (bestY) {
    result.deltaY = bestY.delta
    result.guides.push({
      id: `y-${bestY.position}`,
      orientation: 'horizontal',
      position: bestY.position,
      start: parentRect ? parentRect.rect.x : 0,
      end: parentRect
        ? parentRect.rect.x + parentRect.rect.width
        : moving.x + moving.width + 200,
      type: bestY.type,
    })
  }
  return result
}

/** 等间距吸附：与同层其它组件的间距保持一致 */
export function computeEqualSpacing(
  moving: Rect,
  siblings: CandidateRect[],
  axis: 'x' | 'y',
  threshold = 4
): { delta?: number; guides: AlignmentResult['guides'] } {
  if (siblings.length < 2) return { guides: [] }
  const sorted = [...siblings].sort((a, b) =>
    axis === 'x' ? a.rect.x - b.rect.x : a.rect.y - b.rect.y
  )
  const gaps: number[] = []
  for (let index = 1; index < sorted.length; index += 1) {
    const prev = sorted[index - 1].rect
    const current = sorted[index].rect
    const gap =
      axis === 'x'
        ? current.x - (prev.x + prev.width)
        : current.y - (prev.y + prev.height)
    if (gap > 0) gaps.push(gap)
  }
  if (!gaps.length) return { guides: [] }
  const reference = gaps[0]

  // 找到移动矩形左右（上下）相邻的兄弟
  const guides: AlignmentResult['guides'] = []
  let delta: number | undefined
  for (const sibling of sorted) {
    const siblingRect = sibling.rect
    const distance =
      axis === 'x'
        ? moving.x - (siblingRect.x + siblingRect.width)
        : moving.y - (siblingRect.y + siblingRect.height)
    if (distance > 0 && Math.abs(distance - reference) <= threshold) {
      delta = reference - distance
      guides.push({
        id: `spacing-${sibling.id}`,
        orientation: axis === 'x' ? 'vertical' : 'horizontal',
        position:
          axis === 'x'
            ? siblingRect.x + siblingRect.width
            : siblingRect.y + siblingRect.height,
        start: axis === 'x' ? moving.y : moving.x,
        end: axis === 'x' ? moving.y + moving.height : moving.x + moving.width,
        type: 'spacing',
      })
    }
  }
  return { delta, guides }
}
