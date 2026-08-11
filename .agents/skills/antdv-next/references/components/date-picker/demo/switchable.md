# Switchable picker

## Description (en-US)

Switch in different types of pickers by Select.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

type PickerType = 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year'

const type = shallowRef<PickerType>('time')

const options = [
  { label: 'Time', value: 'time' },
  { label: 'Date', value: 'date' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
]

function handleChange(value: any) {
  console.log(value)
}
</script>

<template>
  <a-space>
    <a-select v-model:value="type" aria-label="Picker Type" :options="options" />
    <a-time-picker v-if="type === 'time'" @change="handleChange" />
    <a-date-picker v-else-if="type === 'date'" @change="handleChange" />
    <a-date-picker v-else :picker="type" @change="handleChange" />
  </a-space>
</template>
```
