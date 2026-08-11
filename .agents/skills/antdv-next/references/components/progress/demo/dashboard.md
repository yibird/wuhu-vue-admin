# Dashboard

## Description (en-US)

By setting `type="dashboard"`, you can get a dashboard style of progress easily.

## Source

```vue
<script setup lang="ts">
import type { ProgressProps } from 'antdv-next'
import { ref } from 'vue'

type GapPlacement = NonNullable<ProgressProps['gapPlacement']>

const gapPlacement = ref<GapPlacement>('bottom')
const gapDegree = ref<number>(50)
</script>

<template>
  <a-flex vertical gap="large">
    <div>
      gapDegree:
      <a-segmented
        v-model:value="gapDegree"
        :options="[
          { label: 50, value: 50 },
          { label: 100, value: 100 },
        ]"
      />
    </div>
    <div>
      gapPlacement:
      <a-segmented
        v-model:value="gapPlacement"
        :options="[
          { label: 'start', value: 'start' },
          { label: 'end', value: 'end' },
          { label: 'top', value: 'top' },
          { label: 'bottom', value: 'bottom' },
        ]"
      />
    </div>
    <a-progress type="dashboard" :gap-degree="gapDegree" :percent="30" :gap-placement="gapPlacement" />
  </a-flex>
</template>
```
