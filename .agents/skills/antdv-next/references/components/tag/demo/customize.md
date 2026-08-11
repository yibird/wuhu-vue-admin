# Customize close

## Description (en-US)

The close icon can be customized using `closeIcon`.

## Source

```vue
<script setup lang="ts">
import { CloseCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-flex gap="small" align="center" wrap>
    <a-tag closable close-icon="关闭">
      Tag 1
    </a-tag>
    <a-tag closable>
      Tag 2
      <template #closeIcon>
        <CloseCircleOutlined />
      </template>
    </a-tag>
  </a-flex>
</template>
```
