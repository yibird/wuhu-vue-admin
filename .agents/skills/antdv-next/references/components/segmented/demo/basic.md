# Basic

## Description (en-US)

The most basic usage.

## Source

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('Daily')
</script>

<template>
  <a-segmented v-model:value="value" :options="['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']" @change="(value) => console.log(value)" />
</template>
```
