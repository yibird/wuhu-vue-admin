# disabled

## Description (en-US)

A disabled state of the `TimePicker`.

## Source

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)
const defaultValue = dayjs('12:08:23', 'HH:mm:ss')
</script>

<template>
  <a-time-picker :default-value="defaultValue" disabled />
</template>
```
