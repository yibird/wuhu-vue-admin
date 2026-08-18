import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  mergeProps,
  shallowRef,
  type ComponentPublicInstance,
  type PropType,
  type VNode,
} from 'vue'
import { useSortable } from '@dnd-kit/vue/sortable'
import type { DraggableItemProps } from './types'
import { flattenDraggableVNodes } from './utils'

type DraggableElement = HTMLElement | ComponentPublicInstance

function getRootElement(value: DraggableElement | null) {
  if (!value) return undefined
  if (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement) {
    return value
  }

  const component = value as ComponentPublicInstance
  return typeof Element !== 'undefined' && component.$el instanceof Element
    ? component.$el
    : undefined
}

export default defineComponent({
  name: 'WDraggableItem',
  inheritAttrs: false,
  props: {
    vnode: {
      type: Object as PropType<VNode>,
      default: undefined,
    },
    id: {
      type: [String, Number] as PropType<DraggableItemProps['id']>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    disabled: {
      type: [Boolean, Object] as PropType<DraggableItemProps['disabled']>,
      default: false,
    },
    ghostClass: {
      type: String,
      default: undefined,
    },
    handleSelector: {
      type: String,
      default: undefined,
    },
    group: {
      type: [String, Number] as PropType<DraggableItemProps['group']>,
      default: undefined,
    },
    accept: {
      type: [String, Array] as PropType<DraggableItemProps['accept']>,
      default: undefined,
    },
    collisionPriority: {
      type: Number,
      default: undefined,
    },
    type: {
      type: String,
      default: undefined,
    },
    data: {
      type: Object as PropType<DraggableItemProps['data']>,
      default: undefined,
    },
    transition: {
      type: Object as PropType<DraggableItemProps['transition']>,
      default: undefined,
    },
    tag: {
      type: [String, Object, Function] as PropType<DraggableItemProps['tag']>,
      default: 'div',
    },
    unwrap: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs, slots }) {
    const elementRef = shallowRef<DraggableElement | null>(null)
    const handleRef = computed(() => {
      if (!props.handleSelector) return undefined
      return getRootElement(elementRef.value)?.querySelector<HTMLElement>(
        props.handleSelector
      )
    })

    const { isDragSource, isDragging, isDropTarget, isDropping } = useSortable({
      accept: computed(() => props.accept),
      collisionPriority: computed(() => props.collisionPriority),
      data: computed(() => props.data),
      disabled: computed(() => props.disabled),
      element: elementRef,
      group: computed(() => props.group),
      handle: handleRef,
      id: computed(() => props.id),
      index: computed(() => props.index),
      transition: computed(() => props.transition),
      type: computed(() => props.type),
    })

    function setElement(value: Element | ComponentPublicInstance | null) {
      elementRef.value = value as DraggableElement | null
    }

    function getState() {
      return {
        isDragSource: isDragSource.value,
        isDragging: isDragging.value,
        isDropTarget: isDropTarget.value,
        isDropping: isDropping.value,
      }
    }

    function renderItem(children: VNode[]) {
      const state = getState()
      const itemProps = mergeProps(attrs, {
        ref: setElement,
        'data-w-draggable-id': String(props.id),
        'data-w-draggable-drag-source': state.isDragSource || undefined,
        'data-w-draggable-dragging': state.isDragging || undefined,
        'data-w-draggable-drop-target': state.isDropTarget || undefined,
        'data-w-draggable-dropping': state.isDropping || undefined,
        class: state.isDragSource ? props.ghostClass : undefined,
      })

      if (props.unwrap && children.length === 1) {
        return cloneVNode(children[0], itemProps, true)
      }

      return h(props.tag ?? 'div', itemProps, children)
    }

    return () => {
      const children = props.vnode
        ? [props.vnode]
        : flattenDraggableVNodes(slots.default?.(getState()) ?? [])
      if (children.length === 0) return null
      return renderItem(children)
    }
  },
})
