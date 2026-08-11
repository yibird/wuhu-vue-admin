# Basic

## Description (en-US)

Usage of basic Tag, and it could be closable and customize close button by set `closeIcon` property, will display default close button when `closeIcon` is setting to `true`. Closable Tag supports `onClose` events.

## Source

```vue
<script setup lang="ts">
import { CloseCircleOutlined, DeleteOutlined } from '@antdv-next/icons'
import { shallowRef } from 'vue'

function preventDefault() {
  console.log('Clicked! Default Not Close.')
}
const tag2 = shallowRef(true)
function handleCloseTag2() {
  tag2.value = false
}
const tag3 = shallowRef(true)
function handleCloseTag3() {
  tag3.value = false
}
function handleClick() {
  console.log('click')
}
</script>

<template>
  <a-flex gap="small" align="center" wrap>
    <a-tag @click="handleClick">
      Tag 1
    </a-tag>

    <a-tag>
      <a href="https://github.com/ant-design/ant-design/issues/1862" target="_blank" rel="noopener noreferrer">
        Link
      </a>
    </a-tag>
    <a-tag close-icon @close="preventDefault">
      Prevent Default
    </a-tag>
    <a-tag v-if="tag2" @close="handleCloseTag2">
      <template #closeIcon>
        <CloseCircleOutlined />
      </template>
      Tag 2
    </a-tag>

    <a-tag
      v-if="tag3"
      :closable="{
        'aria-label': 'Close Button',
      }"
      @close="handleCloseTag3"
    >
      <template #closeIcon>
        <DeleteOutlined />
      </template>
      Tag 3
    </a-tag>
  </a-flex>
</template>
```
