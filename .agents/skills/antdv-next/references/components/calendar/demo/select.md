# Selectable Calendar

## Description (en-US)

A basic calendar component with Year/Month switch.

## Source

```vue
<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { ref } from 'vue'

const date = ref(dayjs('2017-01-25T00:00:00Z'))
const selectedValue = ref(dayjs('2017-01-25T00:00:00Z'))
function onSelect(value: Dayjs) {
  selectedValue.value = value
}
</script>

<template>
  <a-alert :title="`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`" />
  <a-calendar
    v-model:value="date"
    @select="onSelect"
  />
</template>
```
