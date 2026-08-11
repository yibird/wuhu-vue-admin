# Hour and minute

## Description (en-US)

While part of `format` is omitted, the corresponding column in panel will disappear, too.

## Source

```vue
<script setup lang="ts">
import dayjs from 'dayjs'

const format = 'HH:mm'
const defaultValue = dayjs('12:08', format)
</script>

<template>
  <a-time-picker :default-value="defaultValue" :format="format" />
</template>
```
