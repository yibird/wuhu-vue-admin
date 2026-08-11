# Custom Selected Label Render

## Description (en-US)

Allows custom rendering of the currently selected label, which can be used for value backfill but the corresponding option is missing and does not want to directly render the value.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const options = [
  { label: 'gold', value: 'gold' },
  { label: 'lime', value: 'lime' },
  { label: 'green', value: 'green' },
  { label: 'cyan', value: 'cyan' },
]

const value = shallowRef('1')
</script>

<template>
  <a-select
    v-model:value="value"
    style="width: 100%"
    :options="options"
  >
    <template #labelRender="{ label, value: val }">
      <template v-if="label">
        {{ val }}
      </template>
      <span v-else>No option match</span>
    </template>
  </a-select>
</template>
```
