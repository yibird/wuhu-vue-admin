# Customized Cell Rendering

## Description (en-US)

We can customize the rendering of the cells in the calendar by providing a `cellRender` slot to `DatePicker`.

## Source

```vue
<script setup lang="ts">
import { theme } from 'antdv-next'

const { token } = theme.useToken()
const highlightStyle = {
  border: `1px solid ${token.value.colorPrimary}`,
  borderRadius: '50%',
}
</script>

<template>
  <a-space vertical :size="12">
    <a-date-picker>
      <template #cellRender="{ current, info }">
        <component :is="info.originNode" v-if="info.type !== 'date'" />
        <div v-else class="ant-picker-cell-inner" :style="current.date() === 1 ? highlightStyle : {}">
          {{ current.date() }}
        </div>
      </template>
    </a-date-picker>
    <a-range-picker>
      <template #cellRender="{ current, info }">
        <component :is="info.originNode" v-if="info.type !== 'date'" />
        <div v-else class="ant-picker-cell-inner" :style="current.date() === 1 ? highlightStyle : {}">
          {{ current.date() }}
        </div>
      </template>
    </a-range-picker>
  </a-space>
</template>
```
