import type { ComponentSchema, LayoutMode } from './core/schema/types'
import type { DeviceKind } from './core/runtime/style'

export type DesignerDevice = DeviceKind

export interface DevicePreset {
  value: DesignerDevice
  label: string
  icon: string
  width: number
  height: number
}

export const DEVICE_PRESETS: DevicePreset[] = [
  {
    value: 'pc',
    label: 'PC',
    icon: 'i-lucide:monitor',
    width: 1440,
    height: 900,
  },
  {
    value: 'tablet',
    label: '平板',
    icon: 'i-lucide:tablet',
    width: 768,
    height: 1024,
  },
  {
    value: 'mobile',
    label: '移动端',
    icon: 'i-lucide:smartphone',
    width: 390,
    height: 844,
  },
  {
    value: 'custom',
    label: '自定义',
    icon: 'i-lucide:settings-2',
    width: 1280,
    height: 800,
  },
]

export interface DropTarget {
  parentId: string
  index: number
  layout: LayoutMode
  /** 放置指示线（stage 坐标系） */
  indicator: {
    x: number
    y: number
    length: number
    direction: 'horizontal' | 'vertical'
  }
  /** 目标容器高亮区域 */
  containerRect: { x: number; y: number; width: number; height: number }
  allowed: boolean
  reason?: string
}

export interface GuideLine {
  id: string
  orientation: 'vertical' | 'horizontal'
  /** stage 坐标系位置 */
  position: number
  start: number
  end: number
  type: 'edge' | 'center' | 'spacing'
}

export interface DragState {
  ids: string[]
  startX: number
  startY: number
  active: boolean
  pointerX: number
  pointerY: number
  target: DropTarget | null
  free: { left: number; top: number } | null
  /** 自由布局拖拽时的节点尺寸（stage 坐标） */
  freeSize?: { width: number; height: number }
}

export interface MarqueeState {
  active: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
}

export interface ResizeState {
  id: string
  handle: string
  startX: number
  startY: number
  active: boolean
  width: number
  height: number
  left: number
  top: number
}

export interface ContextMenuState {
  open: boolean
  x: number
  y: number
  nodeId?: string
}

export interface CanvasViewState {
  zoom: number
  panX: number
  panY: number
}

export type DesignerMode = 'design' | 'preview'

export interface NodeMeta {
  node: ComponentSchema
  depth: number
}
