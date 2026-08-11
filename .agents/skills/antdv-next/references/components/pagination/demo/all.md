# Show All

## Description (en-US)

Show all configured prop.

## Source

```vue
<script setup lang="ts">
import type { PaginationProps } from 'antdv-next'

const showTotal: PaginationProps['showTotal'] = total => `Total ${total} items`
</script>

<template>
  <a-pagination
    :total="85"
    show-size-changer
    show-quick-jumper
    :show-total="showTotal"
  />
</template>
```
