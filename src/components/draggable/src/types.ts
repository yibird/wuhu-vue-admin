import type { Component, VNode, VNodeArrayChildren } from 'vue'
import type { SortableTransition } from '@dnd-kit/dom/sortable'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/vue'

export type DraggableIdentifier = string | number

export type DraggableDisabled =
  | boolean
  | {
      draggable?: boolean
      droppable?: boolean
    }

export type DraggableItemKey<T> =
  | string
  | ((element: T, index: number) => DraggableIdentifier)

export type DraggableItemData<T> =
  | Record<string, unknown>
  | ((element: T, index: number) => Record<string, unknown>)

export interface DraggableProps<T = unknown> {
  /** The tag used for the list container. */
  tag?: string | Component
  /** The fallback tag used when an item slot returns multiple root nodes. */
  itemTag?: string | Component
  /** The list item identifier field or resolver. */
  itemKey?: DraggableItemKey<T>
  /** Disables dragging and/or dropping for every item in this list. */
  disabled?: DraggableDisabled
  /** The duration of the sortable transition in milliseconds. */
  animation?: number
  /** The class applied to the active drag source. */
  ghostClass?: string
  /** Restricts the drag activator to a descendant matching this selector. */
  handleSelector?: string
  /** The sortable group. Lists with the same group can exchange items. */
  group?: DraggableIdentifier
  /** The accepted draggable type(s). */
  accept?: string | string[]
  /** Prioritizes this list when multiple drop targets overlap. */
  collisionPriority?: number
  /** The draggable type for each item. */
  type?: string
  /** Data attached to each sortable item. */
  data?: DraggableItemData<T>
  /** Advanced dnd-kit transition configuration. Overrides animation. */
  transition?: SortableTransition | null
}

export interface DraggableItemState {
  isDragSource: boolean
  isDragging: boolean
  isDropTarget: boolean
  isDropping: boolean
}

export interface DraggableItemSlotProps<T> extends DraggableItemState {
  element: T
  index: number
}

export interface DraggableSlots<T = unknown> {
  default?: () => VNodeArrayChildren
  item?: (props: DraggableItemSlotProps<T>) => VNodeArrayChildren
  header?: () => VNodeArrayChildren
  footer?: () => VNodeArrayChildren
}

export interface DraggableEmits<T = unknown> {
  start: [event: DragStartEvent]
  update: [event: DragEndEvent, items: T[]]
  end: [event: DragEndEvent]
}

export interface DraggableItemProps {
  vnode?: VNode
  id: DraggableIdentifier
  index: number
  disabled?: DraggableDisabled
  ghostClass?: string
  handleSelector?: string
  group?: DraggableIdentifier
  accept?: string | string[]
  collisionPriority?: number
  type?: string
  data?: Record<string, unknown>
  transition?: SortableTransition | null
  /** The wrapper element used by the standalone sortable item. */
  tag?: string | Component
  /** Clones a single slot root instead of rendering the wrapper. */
  unwrap?: boolean
}
