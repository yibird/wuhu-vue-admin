# Basic

## Description (en-US)

Basic usage.

## Source

```vue
<script setup lang="ts">
import type { MentionsOptionProps } from 'antdv-next'
import { ref } from 'vue'

const value = ref<string>('@afc163')
function onChange(value: string) {
  console.log('Change:', value)
}

function onSelect(option: MentionsOptionProps) {
  console.log('select', option)
}
</script>

<template>
  <a-mentions
    v-model:value="value"
    style="width: 100%"
    :options="[
      {
        value: 'afc163',
        label: 'afc163',
      },
      {
        value: 'zombieJ',
        label: 'zombieJ',
      },
      {
        value: 'yesmeck',
        label: 'yesmeck',
      },
    ]"
    @change="onChange"
    @select="onSelect"
  />
</template>
```
