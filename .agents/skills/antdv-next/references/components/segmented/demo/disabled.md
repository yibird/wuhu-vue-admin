# Disabled

## Description (en-US)

Disabled Segmented.

## Source

```vue
<script lang="ts" setup>
import { reactive, ref } from 'vue'

const data = reactive(['Map', 'Transit', 'Satellite'])
const data2 = reactive([
  'Daily',
  { label: 'Weekly', value: 'Weekly', disabled: true },
  'Monthly',
  { label: 'Quarterly', value: 'Quarterly', disabled: true },
  'Yearly',
])
const value = ref(data[0])
const value2 = ref('Daily')
</script>

<template>
  <div>
    <a-segmented v-model:value="value" disabled :options="data" />
    <br>
    <br>
    <a-segmented v-model:value="value2" :options="data2" />
  </div>
</template>
```
