# Custom action

## Description (en-US)

Custom action.

## Source

```vue
<script setup lang="ts">
import type { TourStepItem } from 'antdv-next'
import { EllipsisOutlined } from '@antdv-next/icons'
import { Button } from 'antdv-next'
import { h, shallowRef } from 'vue'

const ref1 = shallowRef()
const ref2 = shallowRef()
const ref3 = shallowRef()
const open = shallowRef(false)

const steps: TourStepItem[] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    target: ref1,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: ref2,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: ref3,
  },
]

function actionsRender(originNode: any, info: { current: number, total: number }) {
  const nodes: any[] = []
  if (info.current !== info.total - 1) {
    nodes.push(
      h(
        Button,
        {
          size: 'small',
          onClick: () => {
            open.value = false
          },
        },
        {
          default: () => 'Skip',
        },
      ),
    )
  }
  if (Array.isArray(originNode)) {
    nodes.push(...originNode)
  }
  else {
    nodes.push(originNode)
  }
  return nodes
}
</script>

<template>
  <a-button type="primary" @click="open = true">
    Begin Tour
  </a-button>
  <a-divider />
  <a-space>
    <a-button ref="ref1">
      Upload
    </a-button>
    <a-button ref="ref2" type="primary">
      Save
    </a-button>
    <a-button ref="ref3">
      <template #icon>
        <EllipsisOutlined />
      </template>
    </a-button>
  </a-space>
  <a-tour
    v-model:open="open"
    :steps="steps"
    :actions-render="actionsRender"
  />
</template>
```
