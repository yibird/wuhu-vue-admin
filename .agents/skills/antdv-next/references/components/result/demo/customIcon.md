# Custom icon

## Description (en-US)

Custom icon.

## Source

```vue
<script lang="ts" setup>
import { SmileOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-result
    title="Great, we have done all the operations!"
  >
    <template #extra>
      <a-button type="primary">
        Next
      </a-button>
    </template>
    <template #icon>
      <SmileOutlined />
    </template>
  </a-result>
</template>
```
