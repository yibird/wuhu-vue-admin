# Custom Tag Render

## Description (en-US)

Allows for custom rendering of tags.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const options = [
  { value: 'gold' },
  { value: 'lime' },
  { value: 'green' },
  { value: 'cyan' },
]

const value = shallowRef(['gold', 'cyan'])

function onPreventMouseDown(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
}
</script>

<template>
  <a-select
    v-model:value="value"
    mode="multiple"
    style="width: 100%"
    :options="options"
  >
    <template #tagRender="{ label, value: tagValue, closable, onClose }">
      <a-tag
        :color="tagValue"
        :closable="closable"
        style="margin-inline-end: 4px"
        @mousedown="onPreventMouseDown"
        @close="onClose"
      >
        {{ label }}
      </a-tag>
    </template>
  </a-select>
</template>
```
