# Dynamic

## Description (en-US)

A dynamic progress bar is better.

## Source

```vue
<script setup lang="ts">
import { MinusOutlined, PlusOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const percent = ref(0)

function increase() {
  percent.value = Math.min(100, percent.value + 10)
}

function decline() {
  percent.value = Math.max(0, percent.value - 10)
}
</script>

<template>
  <a-flex vertical gap="small">
    <a-flex vertical gap="small">
      <a-progress :percent="percent" type="line" />
      <a-progress :percent="percent" type="circle" />
    </a-flex>
    <a-space-compact>
      <a-button @click="decline">
        <template #icon>
          <MinusOutlined />
        </template>
      </a-button>
      <a-button @click="increase">
        <template #icon>
          <PlusOutlined />
        </template>
      </a-button>
    </a-space-compact>
  </a-flex>
</template>
```
