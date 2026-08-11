# Slider with InputNumber

## Description (en-US)

Synchronize with [InputNumber](../../input-number/docs.md/) component.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref<number>(1)
const inputValueDecimal = ref<number>(0)
</script>

<template>
  <a-space style="width: 100%" vertical>
    <a-row>
      <a-col :span="12">
        <a-slider
          v-model:value="inputValue"
          :min="1"
          :max="20"
        />
      </a-col>
      <a-col :span="4">
        <a-input-number
          v-model:value="inputValue"
          :min="1"
          :max="20"
          style="margin: 0 16px"
        />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-slider
          v-model:value="inputValueDecimal"
          :min="0"
          :max="1"
          :step="0.01"
        />
      </a-col>
      <a-col :span="4">
        <a-input-number
          v-model:value="inputValueDecimal"
          :min="0"
          :max="1"
          style="margin: 0 16px"
          :step="0.01"
        />
      </a-col>
    </a-row>
  </a-space>
</template>
```
