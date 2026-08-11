# With Icon only

## Description (en-US)

Set icon without label for Segmented Item.

## Source

```vue
<script setup lang="ts">
import { AppstoreOutlined, BarsOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const options = [
  { value: 'List', icon: h(BarsOutlined) },
  { value: 'Kanban', icon: h(AppstoreOutlined) },
]
const options2 = [
  { value: 'List' },
  { value: 'Kanban' },
]
</script>

<template>
  <a-segmented :options="options" />
  <br>
  <br>
  <a-segmented :options="options2">
    <template #iconRender="{ value }">
      <template v-if="value === 'List'">
        <BarsOutlined />
      </template>
      <template v-else-if="value === 'Kanban'">
        <AppstoreOutlined />
      </template>
    </template>
  </a-segmented>
</template>
```
