# Customized trigger of new tab

## Description (en-US)

Hide default plus icon, and bind event for customized trigger.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface TabItem {
  key: string
  label: string
  content: string
}

const defaultPanes: TabItem[] = Array.from({ length: 2 }).map((_, index) => {
  const id = String(index + 1)
  return {
    key: id,
    label: `Tab ${id}`,
    content: `Content of Tab Pane ${index + 1}`,
  }
})

const activeKey = ref(defaultPanes[0]?.key ?? '1')
const items = ref<TabItem[]>([...defaultPanes])
let newTabIndex = 0

function onChange(key: string) {
  activeKey.value = key
}

function add() {
  const newActiveKey = `newTab${newTabIndex++}`
  items.value = [...items.value, { key: newActiveKey, label: 'New Tab', content: 'New Tab Pane' }]
  activeKey.value = newActiveKey
}

function remove(targetKey: string) {
  const targetIndex = items.value.findIndex(pane => pane.key === targetKey)
  const newPanes = items.value.filter(pane => pane.key !== targetKey)
  if (newPanes.length && targetKey === activeKey.value) {
    const nextPane = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex]
    if (nextPane) {
      activeKey.value = nextPane.key
    }
  }
  items.value = newPanes
}

function onEdit(targetKey: string | MouseEvent | KeyboardEvent, action: 'add' | 'remove') {
  if (action === 'add') {
    add()
  }
  else {
    remove(targetKey as string)
  }
}
</script>

<template>
  <div>
    <div style="margin-bottom: 16px;">
      <a-button @click="add">
        ADD
      </a-button>
    </div>
    <a-tabs
      v-model:active-key="activeKey"
      type="editable-card"
      hide-add
      :items="items"
      @change="onChange"
      @edit="onEdit"
    />
  </div>
</template>
```
