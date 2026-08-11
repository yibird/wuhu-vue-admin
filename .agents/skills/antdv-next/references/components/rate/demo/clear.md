# Clear star

## Description (en-US)

Support set allow to clear star when click again.

## Source

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const val = ref(3)
const val1 = ref(3)
</script>

<template>
  <a-flex gap="middle" vertical>
    <a-flex gap="middle">
      <a-rate v-model:value="val" />
      <span>allowClear: true</span>
    </a-flex>
    <a-flex gap="middle">
      <a-rate v-model:value="val1" :allow-clear="false" />
      <span>allowClear: false</span>
    </a-flex>
  </a-flex>
</template>
```
