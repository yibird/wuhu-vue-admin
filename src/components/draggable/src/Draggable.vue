<script setup lang="ts" generic="T = unknown">
import { arrayMove } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/vue'
import { isSortable } from '@dnd-kit/vue/sortable'
import DraggableItem from './DraggableItem'
import type {
  DraggableEmits,
  DraggableItemData,
  DraggableItemKey,
  DraggableProps,
  DraggableSlots,
} from './types'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DraggableProps<T>>(), {
  tag: 'div',
  itemTag: 'div',
  animation: 150,
})
const emit = defineEmits<DraggableEmits<T>>()
const slots = defineSlots<DraggableSlots<T>>()
const attrs = useAttrs()
const items = defineModel<T[]>({ default: () => [] })
const instanceId = useId()

const sortableGroup = `w-draggable-group:${instanceId}`
const transition = computed(() => {
  if (props.transition !== undefined) return props.transition
  if (props.animation === undefined) return undefined
  return { duration: Math.max(0, props.animation) }
})

function normalizeIdentifier(value: unknown, index: number) {
  if (typeof value === 'string' || typeof value === 'number') return value
  throw new Error(`Draggable item at index ${index} has no stable identifier`)
}

function resolveItemId(element: T, index: number) {
  const itemKey = props.itemKey as DraggableItemKey<T> | undefined
  if (typeof itemKey === 'function') {
    return normalizeIdentifier(itemKey(element, index), index)
  }

  if (typeof itemKey === 'string' && element != null) {
    const value = (element as Record<string, unknown>)[itemKey]
    if (value !== undefined && value !== null) {
      return normalizeIdentifier(value, index)
    }
  }
  return normalizeIdentifier(undefined, index)
}

function resolveItemData(element: T, index: number) {
  const data = props.data as DraggableItemData<T> | undefined
  return typeof data === 'function' ? data(element, index) : data
}

const itemEntries = computed(() => {
  const identifiers = new Set<string>()
  return items.value.map((element, index) => {
    const id = resolveItemId(element, index)
    const identifier = `${typeof id}:${String(id)}`
    if (identifiers.has(identifier)) {
      throw new Error(`Duplicate Draggable item identifier: ${String(id)}`)
    }
    identifiers.add(identifier)
    return {
      data: resolveItemData(element, index),
      element,
      id,
      index,
    }
  })
})

function handleDragStart(event: DragStartEvent) {
  emit('start', event)
}

function handleDragEnd(event: DragEndEvent) {
  const source = event.operation.source
  if (!event.canceled && source && isSortable(source)) {
    const from = source.initialIndex
    const to = source.index
    const currentItems = items.value

    if (
      from !== to &&
      from >= 0 &&
      to >= 0 &&
      from < currentItems.length &&
      to < currentItems.length
    ) {
      const nextItems = arrayMove(currentItems, from, to)
      items.value = nextItems
      emit('update', event, nextItems)
    }
  }

  emit('end', event)
}
</script>

<template>
  <DragDropProvider @drag-start="handleDragStart" @drag-end="handleDragEnd">
    <component :is="props.tag" v-bind="attrs">
      <slot name="header" />

      <DraggableItem
        v-for="entry in itemEntries"
        :key="entry.id"
        :data="entry.data"
        :disabled="props.disabled"
        :ghost-class="props.ghostClass"
        :group="sortableGroup"
        :handle-selector="props.handleSelector"
        :id="entry.id"
        :index="entry.index"
        :tag="props.itemTag"
        :transition="transition"
        :type="props.type"
        unwrap
      >
        <template #default="state">
          <slot
            name="item"
            :element="entry.element"
            :index="entry.index"
            v-bind="state"
          />
        </template>
      </DraggableItem>

      <slot name="footer" />
    </component>
  </DragDropProvider>
</template>
