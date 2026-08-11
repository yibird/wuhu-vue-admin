# Time Range Picker

## Description (en-US)

Use time range picker with `TimePicker.RangePicker`.

## Source

```vue
<script setup lang="ts">
import dayjs from 'dayjs'

const format = 'HH:mm:ss'
const defaultValue = [dayjs('12:08:23', 'HH:mm:ss'), dayjs('12:08:23', 'HH:mm:ss')]
</script>

<template>
  <a-time-range-picker :default-value="defaultValue" :format="format" />
</template>
```
