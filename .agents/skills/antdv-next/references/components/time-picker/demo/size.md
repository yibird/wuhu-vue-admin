# Three Sizes

## Description (en-US)

The input box comes in three sizes: large, middle and small. Large is used in the form, while the medium size is the default.

## Source

```vue
<script setup lang="ts">
import dayjs from 'dayjs'

const defaultValue = dayjs('12:08:23', 'HH:mm:ss')
</script>

<template>
  <a-space wrap>
    <a-time-picker :default-value="defaultValue" size="large" />
    <a-time-picker :default-value="defaultValue" />
    <a-time-picker :default-value="defaultValue" size="small" />
  </a-space>
</template>
```
