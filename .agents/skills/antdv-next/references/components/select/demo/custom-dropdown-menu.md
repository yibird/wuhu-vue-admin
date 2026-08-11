# Custom dropdown

## Description (en-US)

Customize the dropdown menu via `popupRender`. If you want to close the dropdown after clicking the custom content, you need to control `open` prop.

## Source

```vue
<script setup lang="ts">
import { PlusOutlined } from '@antdv-next/icons'
import { shallowRef } from 'vue'

let index = 0

const items = shallowRef(['jack', 'lucy'])
const name = shallowRef('')

function addItem(e: MouseEvent) {
  e.preventDefault()
  items.value = [...items.value, name.value || `New item ${index++}`]
  name.value = ''
}
</script>

<template>
  <a-select
    style="width: 300px"
    placeholder="custom dropdown render"
    :options="items.map((item) => ({ label: item, value: item }))"
  >
    <template #popupRender="menu">
      <component :is="menu" />
      <a-divider style="margin: 8px 0" />
      <a-space style="padding: 0 8px 4px">
        <a-input
          v-model:value="name"
          placeholder="Please enter item"
          @keydown.stop
        />
        <a-button type="text" @click="addItem">
          <template #icon>
            <PlusOutlined />
          </template>
          Add item
        </a-button>
      </a-space>
    </template>
  </a-select>
</template>
```
