# Draggable

`Draggable` provides flat-list sorting with `@dnd-kit/vue/sortable`. It keeps
the `v-model` array as the source of truth and emits `start`, `update`, and
`end` events.

## Default slot

This form keeps the same shape as `vue-draggable-plus`:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Draggable } from '@/components'

const list = shallowRef([
  { id: 'one', name: 'One' },
  { id: 'two', name: 'Two' },
])
</script>

<template>
  <Draggable
    v-model="list"
    :animation="150"
    ghost-class="ghost"
    class="flex flex-col gap-2"
    @start="onStart"
    @update="onUpdate"
    @end="onEnd"
  >
    <div v-for="item in list" :key="item.id" class="cursor-move">
      {{ item.name }}
    </div>
  </Draggable>
</template>
```

For render-controlled lists, prefer the item slot. It avoids VNode cloning
and makes the item identity explicit:

```vue
<Draggable v-model="list" item-key="id">
  <template #item="{ element, index, isDragging }">
    <div :data-dragging="isDragging">{{ index }}: {{ element.name }}</div>
  </template>
</Draggable>
```

## Sortable item

Use `DraggableItem` when a feature already owns the `DragDropProvider`, such
as cross-list or nested sorting. It renders a wrapper by default so classes,
attributes, and sortable state stay on a predictable element:

```vue
<DragDropProvider @drag-end="handleDragEnd">
  <DraggableItem
    v-for="(item, index) in items"
    :key="item.id"
    :id="item.id"
    :index="index"
    group="board"
    type="board-item"
  >
    <TaskCard :item="item" />
  </DraggableItem>
</DragDropProvider>
```

Set `tag` to change the wrapper element. Set `unwrap` only when the sortable
attributes should be merged into a single slot root.

## Single draggable element

The exported `useDraggable` is the dnd-kit composable. The component using it
must be rendered inside a `DragDropProvider`:

```vue
<!-- PaletteItem.vue -->
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useDraggable } from '@/components'

const element = useTemplateRef<HTMLElement>('element')
const { isDragging } = useDraggable({
  id: 'palette-item',
  element,
  type: 'palette-item',
  data: computed(() => ({ kind: 'palette' })),
})
</script>

<template>
  <button ref="element" type="button" :data-dragging="isDragging">
    Drag me
  </button>
</template>
```

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { DragDropProvider } from '@dnd-kit/vue'
import PaletteItem from './PaletteItem.vue'
</script>

<template>
  <DragDropProvider>
    <PaletteItem />
  </DragDropProvider>
</template>
```
