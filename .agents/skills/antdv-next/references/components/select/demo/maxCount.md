# Max Count

## Description (en-US)

You can set the `maxCount` prop to control the max number of items can be selected. When the limit is exceeded, the options will become disabled.

## Source

```vue
<script setup lang="ts">
import { DownOutlined } from '@antdv-next/icons'
import { shallowRef } from 'vue'

const MAX_COUNT = 3

const value = shallowRef<string[]>(['Ava Swift'])

const options = [
  { value: 'Ava Swift', label: 'Ava Swift' },
  { value: 'Cole Reed', label: 'Cole Reed' },
  { value: 'Mia Blake', label: 'Mia Blake' },
  { value: 'Jake Stone', label: 'Jake Stone' },
  { value: 'Lily Lane', label: 'Lily Lane' },
  { value: 'Ryan Chase', label: 'Ryan Chase' },
  { value: 'Zoe Fox', label: 'Zoe Fox' },
  { value: 'Alex Grey', label: 'Alex Grey' },
  { value: 'Elle Blair', label: 'Elle Blair' },
]
</script>

<template>
  <a-select
    v-model:value="value"
    mode="multiple"
    :max-count="MAX_COUNT"
    style="width: 100%"
    placeholder="Please select"
    :options="options"
  >
    <template #suffixIcon>
      <span>{{ value.length }} / {{ MAX_COUNT }}</span>
      <DownOutlined />
    </template>
  </a-select>
</template>
```
