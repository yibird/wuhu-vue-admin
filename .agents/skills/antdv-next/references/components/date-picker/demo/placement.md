# Placement

## Description (en-US)

You can manually specify the position of the popup via `placement`.

## Source

```vue
<script setup lang="ts">
import type { DatePickerProps } from 'antdv-next'
import { shallowRef } from 'vue'

type PlacementType = DatePickerProps['placement']

const placement = shallowRef<PlacementType>('topLeft')
</script>

<template>
  <a-space vertical :size="12">
    <a-radio-group v-model:value="placement">
      <a-radio-button value="topLeft">
        topLeft
      </a-radio-button>
      <a-radio-button value="topRight">
        topRight
      </a-radio-button>
      <a-radio-button value="bottomLeft">
        bottomLeft
      </a-radio-button>
      <a-radio-button value="bottomRight">
        bottomRight
      </a-radio-button>
    </a-radio-group>
    <a-date-picker :placement="placement" />
    <a-range-picker :placement="placement" />
  </a-space>
</template>
```
