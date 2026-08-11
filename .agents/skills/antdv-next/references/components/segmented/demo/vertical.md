# Vertical Direction

## Description (en-US)

Make it vertical.

## Source

```vue
<script setup lang="ts">
import { AppstoreOutlined, BarsOutlined } from '@antdv-next/icons'

const iconObj: Record<string, any> = {
  List: BarsOutlined,
  Kanban: AppstoreOutlined,
}
</script>

<template>
  <a-segmented
    orientation="vertical"
    :options="[
      { value: 'List' },
      { value: 'Kanban' },
    ]"
  >
    <template #iconRender="{ value }">
      <component :is="iconObj[value]" v-if="iconObj[value]" />
    </template>
  </a-segmented>
</template>
```
