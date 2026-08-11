# With clear icon

## Description (en-US)

Customize clear button.

## Source

```vue
<script setup lang="ts">
import { CloseSquareFilled } from '@antdv-next/icons'
import { h, ref } from 'vue'

const value = ref('hello world')
const customAllowClear = {
  clearIcon: h(CloseSquareFilled),
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-mentions v-model:value="value" allow-clear />
    <a-mentions v-model:value="value" :allow-clear="customAllowClear" />
    <a-mentions v-model:value="value" allow-clear :rows="3" />
  </a-flex>
</template>
```
