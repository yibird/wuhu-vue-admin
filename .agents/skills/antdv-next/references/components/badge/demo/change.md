# Dynamic

## Description (en-US)

The count will be animated as it changes.

## Source

```vue
<script setup lang="ts">
import { MinusOutlined, PlusOutlined, QuestionOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const count = ref(5)
const show = ref(true)

function increase() {
  count.value++
}

function decline() {
  let newCount = count.value - 1
  if (newCount < 0) {
    newCount = 0
  }
  count.value = newCount
}

function random() {
  const newCount = Math.floor(Math.random() * 100)
  count.value = newCount
}
</script>

<template>
  <a-space vertical>
    <a-space size="large">
      <a-badge :count="count">
        <a-avatar shape="square" size="large" />
      </a-badge>
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
        <a-button @click="random">
          <template #icon>
            <QuestionOutlined />
          </template>
        </a-button>
      </a-space-compact>
    </a-space>
    <a-space size="large">
      <a-badge :dot="show">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-switch v-model:checked="show" />
    </a-space>
  </a-space>
</template>
```
