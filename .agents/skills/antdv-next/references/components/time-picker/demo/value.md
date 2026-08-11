# Under Control

## Description (en-US)

`value` and `onChange` should be used together,

## Source

```vue
<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { shallowRef } from 'vue'

const value = shallowRef<Dayjs>()
</script>

<template>
  <a-time-picker v-model:value="value" />
</template>
```
