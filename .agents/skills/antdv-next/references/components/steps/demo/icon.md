# With icon

## Description (en-US)

You can use your own custom icons by setting the property `icon` for `items`.

## Source

```vue
<script setup lang="ts">
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items = [
  {
    title: 'Login',
    status: 'finish' as const,
    icon: h(UserOutlined),
  },
  {
    title: 'Verification',
    status: 'finish' as const,
    icon: h(SolutionOutlined),
  },
  {
    title: 'Pay',
    status: 'process' as const,
    icon: h(LoadingOutlined),
  },
  {
    title: 'Done',
    status: 'wait' as const,
    icon: h(SmileOutlined),
  },
]
</script>

<template>
  <a-steps :items="items" />
</template>
```
