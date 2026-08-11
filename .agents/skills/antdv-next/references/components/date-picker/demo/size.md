# Three Sizes

## Description (en-US)

The input box comes in three sizes: small, middle and large. The `middle` size will be used if `size` is omitted.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

type SizeType = 'large' | 'middle' | 'small'

const size = shallowRef<SizeType>('middle')
</script>

<template>
  <a-space vertical :size="12">
    <a-radio-group v-model:value="size">
      <a-radio-button value="large">
        Large
      </a-radio-button>
      <a-radio-button value="middle">
        middle
      </a-radio-button>
      <a-radio-button value="small">
        Small
      </a-radio-button>
    </a-radio-group>
    <a-date-picker :size="size" />
    <a-date-picker :size="size" picker="month" />
    <a-range-picker :size="size" />
    <a-date-picker :size="size" picker="week" />
  </a-space>
</template>
```
