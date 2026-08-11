# Block Segmented

## Description (en-US)

`block` property will make the Segmented fit to its parent width.

## Source

```vue
<script lang="ts" setup>
import { reactive, ref } from 'vue'

const data = reactive([123, 456, 'longtext-longtext-longtext-longtext'])
const value = ref(data[0])
</script>

<template>
  <a-segmented v-model:value="value" block :options="data" />
</template>
```
