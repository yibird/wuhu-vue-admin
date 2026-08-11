# Placement

## Description (en-US)

You can manually specify the position of the popup via `placement`.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

type Placement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'

const placement = shallowRef<Placement>('topLeft')
const value = shallowRef('HangZhou')

const options = [
  { value: 'HangZhou', label: 'HangZhou #310000' },
  { value: 'NingBo', label: 'NingBo #315000' },
  { value: 'WenZhou', label: 'WenZhou #325000' },
]
</script>

<template>
  <a-radio-group v-model:value="placement">
    <a-radio-button value="topLeft">
      topLeft
    </a-radio-button>
    <a-radio-button value="topRight">
      topRight
    </a-radio-button>
    <a-radio-button value="bottomLeft">
      bottomLeft
    </a-radio-button>
    <a-radio-button value="bottomRight">
      bottomRight
    </a-radio-button>
  </a-radio-group>
  <br>
  <br>
  <a-select
    v-model:value="value"
    style="width: 120px"
    :popup-match-select-width="false"
    :placement="placement"
    :options="options"
  />
</template>
```
