# Standalone

## Description (en-US)

Used in standalone when children is empty.

## Source

```vue
<script setup lang="ts">
import { ClockCircleOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <a-space>
    <a-switch v-model:checked="show" />
    <a-badge :count="show ? 11 : 0" show-zero color="#faad14" />
    <a-badge :count="show ? 25 : 0" />
    <a-badge :count="show ? 1 : 0">
      <template #count>
        <ClockCircleOutlined style="color: #f5222d" />
      </template>
    </a-badge>
    <a-badge
      class="site-badge-count-109"
      :count="show ? 109 : 0"
      :style="{ backgroundColor: '#52c41a' }"
    />
  </a-space>
</template>
```
