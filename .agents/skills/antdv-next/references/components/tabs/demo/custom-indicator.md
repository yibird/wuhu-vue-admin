# Indicator

## Description (en-US)

Set `indicator` prop to custom indicator size and align.

## Source

```vue
<script setup lang="ts">
import type { TabsProps } from 'antdv-next'
import { ref } from 'vue'

const items: TabsProps['items'] = [
  { key: '1', label: 'Tab 1', content: 'Content of Tab Pane 1' },
  { key: '2', label: 'Tab 2', content: 'Content of Tab Pane 2' },
  { key: '3', label: 'Tab 3', content: 'Content of Tab Pane 3' },
]

type Align = 'start' | 'center' | 'end'

const alignValue = ref<Align>('center')

function onChange(key: string) {
  console.log(key)
}
</script>

<template>
  <div>
    <a-segmented
      v-model:value="alignValue"
      style="margin-bottom: 8px;"
      :options="['start', 'center', 'end']"
    />
    <a-tabs
      default-active-key="1"
      :items="items"
      :indicator="{ size: (origin: number) => origin - 20, align: alignValue }"
      @change="onChange"
    />
  </div>
</template>
```
