# Prev and next

## Description (en-US)

Use text link for prev and next button.

## Source

```vue
<script setup lang="ts">
import type { PaginationProps } from 'antdv-next'
import { h } from 'vue'

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return h('a', 'Previous')
  }
  if (type === 'next') {
    return h('a', 'Next')
  }
  return originalElement
}
</script>

<template>
  <a-pagination :total="500" :item-render="itemRender" />
</template>
```
