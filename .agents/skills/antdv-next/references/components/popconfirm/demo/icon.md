# Customize icon

## Description (en-US)

Set `icon` props to customize the icon.

## Source

```vue
<script setup lang="ts">
import { QuestionCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
  >
    <template #icon>
      <QuestionCircleOutlined style="color: red" />
    </template>
    <a-button danger>
      Delete
    </a-button>
  </a-popconfirm>
</template>
```
