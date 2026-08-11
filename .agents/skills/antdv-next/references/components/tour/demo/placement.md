# Placement

## Description (en-US)

Change the placement of the guide relative to the target, there are 12 placements available. When `target={null}` the guide will show in the center.

## Source

```vue
<script setup lang="ts">
import type { TourStepItem } from 'antdv-next'
import { shallowRef } from 'vue'

const ref = shallowRef()
const open = shallowRef(false)
const steps: TourStepItem[] = [
  {
    title: 'Center',
    description: 'Displayed in the center of screen.',
    target: null,
  },
  {
    title: 'Right',
    description: 'On the right of target.',
    placement: 'right',
    target: ref,
  },
  {
    title: 'Top',
    description: 'On the top of target.',
    placement: 'top',
    target: ref,
  },
]
</script>

<template>
  <div class="mt-300px ml-300px">
    <a-button ref="ref" type="primary" @click="open = true">
      Begin Tour
    </a-button>
  </div>

  <a-tour v-model:open="open" :steps="steps" />
</template>
```
