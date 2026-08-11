# Controlled

## Description (en-US)

Controlled page number.

## Source

```vue
<script setup lang="ts">
import type { PaginationEmits } from 'antdv-next'
import { ref } from 'vue'

const current = ref(3)

const handleChange: PaginationEmits['change'] = (page) => {
  console.log(page)
  current.value = page
}
</script>

<template>
  <a-pagination :current="current" :total="50" @change="handleChange" />
</template>
```
