# Show copywriting

## Description (en-US)

Add copywriting in rate components.

## Source

```vue
<script setup lang="ts">
import type { RateProps } from 'antdv-next'
import { ref } from 'vue'

function getDescTitle(value: number, desc: RateProps['tooltips']) {
  const item = desc?.[value - 1]
  return typeof item === 'object' ? item.title : item
}
const desc: RateProps['tooltips'] = [
  'terrible',
  { placement: 'top', title: 'bad', trigger: 'hover' },
  'normal',
  'good',
  'wonderful',
]
const value = ref(3)
</script>

<template>
  <a-flex gap="middle" vertical>
    <a-rate v-model:value="value" :tooltips="desc" />
    <template v-if="value">
      <span>{{ getDescTitle(value, desc) }}</span>
    </template>
  </a-flex>
</template>
```
