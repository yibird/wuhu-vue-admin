# Sizes

## Description (en-US)

There are three sizes available to a numeric input box. By default, the size is `32px`. The two additional sizes are `large` and `small` which means `40px` and `24px`, respectively.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

function onChange(value: number | null) {
  console.log('changed', value)
}

const value1 = ref(3)
const value2 = ref(3)
const value3 = ref(3)
</script>

<template>
  <a-space wrap>
    <a-input-number v-model:value="value1" size="large" :min="1" :max="100000" @change="onChange" />
    <a-input-number v-model:value="value2" :min="1" :max="100000" @change="onChange" />
    <a-input-number v-model:value="value3" size="small" :min="1" :max="100000" @change="onChange" />
  </a-space>
</template>
```
