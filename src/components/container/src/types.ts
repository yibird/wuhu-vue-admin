import type { HTMLAttributes, VNodeChild } from 'vue'

export type ContainerTag = keyof HTMLElementTagNameMap

export interface ContainerSize {
  readonly width: number
  readonly height: number
}

export interface LazyContainerProps extends /* @vue-ignore */ HTMLAttributes {
  /** Root element rendered by the container. @default 'div' */
  tag?: ContainerTag
  /** Render immediately without observing viewport visibility. @default false */
  eager?: boolean
  /** Keep content mounted after its first intersection. @default true */
  once?: boolean
  /** IntersectionObserver root margin. @default '200px 0px' */
  rootMargin?: string
  /** Intersection ratio required before rendering. @default 0 */
  threshold?: number | number[]
  /** Minimum height reserved before content mounts. @default 1 */
  minHeight?: number | string
}

export interface LazyContainerSlotProps {
  /** Whether the container currently intersects the observer viewport. */
  visible: boolean
  /** Whether the default content has mounted at least once. */
  loaded: boolean
}

export interface LazyContainerSlots {
  default?: (props: LazyContainerSlotProps) => VNodeChild
  placeholder?: (props: LazyContainerSlotProps) => VNodeChild
}

export interface LazyContainerEmits {
  'visible-change': [visible: boolean]
  load: []
}

export interface ResizeContainerProps extends /* @vue-ignore */ HTMLAttributes {
  /** Root element rendered by the container. @default 'div' */
  tag?: ContainerTag
  /** Width exposed before the first measurement. @default 0 */
  initialWidth?: number
  /** Height exposed before the first measurement. @default 0 */
  initialHeight?: number
  /** ResizeObserver box model used for measurement. @default 'content-box' */
  box?: ResizeObserverBoxOptions
}

export interface ResizeContainerSlots {
  default?: (size: ContainerSize) => VNodeChild
}

export interface ResizeContainerEmits {
  resize: [size: ContainerSize]
}
