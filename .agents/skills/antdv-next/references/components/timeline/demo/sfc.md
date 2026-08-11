# SFC Mode

## Description (en-US)

support sfc mode

## Source

```vue
<script setup lang="ts">
import { ClockCircleFilled } from '@antdv-next/icons'
</script>

<template>
  <div>
    <a-timeline>
      <a-timeline-item>
        测试
      </a-timeline-item>
      <a-timeline-item color="red">
        <div class="c-primary">
          测试
        </div>
        <template #icon>
          <ClockCircleFilled />
        </template>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>
```
