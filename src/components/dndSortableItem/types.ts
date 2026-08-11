import type { Component } from 'vue'

export type DndIdentifier = number | string

export interface DndSortableItemProps {
  accept?: string | string[]
  collisionPriority?: number
  data?: Record<string, unknown>
  disabled?: boolean | { draggable?: boolean; droppable?: boolean }
  group?: DndIdentifier
  handleSelector?: string
  id: DndIdentifier
  index: number
  tag?: string | Component
  type?: string
}

export interface DndSortableItemSlotProps {
  isDragSource: boolean
  isDragging: boolean
  isDropTarget: boolean
  isDropping: boolean
}

export interface DndSortableItemSlots {
  default?: (props: DndSortableItemSlotProps) => unknown
}
