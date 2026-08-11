# Add & close tab

## Description (en-US)

Only card type Tabs support adding & closable. Use `closable={false}` to disable close.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface TabItem {
  key: string
  label: string
  content: string
  closable?: boolean
}

const initialItems: TabItem[] = [
  { key: '1', label: 'Tab 1', content: 'Content of Tab 1' },
  { key: '2', label: 'Tab 2', content: 'Content of Tab 2' },
  { key: '3', label: 'Tab 3', content: 'Content of Tab 3', closable: false },
]

const activeKey = ref(initialItems[0]?.key ?? '1')
const items = ref<TabItem[]>([...initialItems])
let newTabIndex = 0

function onChange(newActiveKey: string) {
  activeKey.value = newActiveKey
}

function add() {
  const newActiveKey = `newTab${newTabIndex++}`
  items.value = [...items.value, { key: newActiveKey, label: 'New Tab', content: 'Content of new Tab' }]
  activeKey.value = newActiveKey
}

function remove(targetKey: string) {
  let newActiveKey = activeKey.value
  let lastIndex = -1
  items.value.forEach((item, i) => {
    if (item.key === targetKey) {
      lastIndex = i - 1
    }
  })
  const newPanes = items.value.filter(item => item.key !== targetKey)
  if (newPanes.length && newActiveKey === targetKey) {
    if (lastIndex >= 0 && newPanes[lastIndex]) {
      newActiveKey = newPanes[lastIndex]!.key!
    }
    else if (newPanes[0]) {
      newActiveKey = newPanes[0]!.key!
    }
  }
  items.value = newPanes
  activeKey.value = newActiveKey
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
  <a-tabs
    v-model:active-key="activeKey"
    type="editable-card"
    :items="items"
    @change="onChange"
    @edit="onEdit"
  />
</template>
```
