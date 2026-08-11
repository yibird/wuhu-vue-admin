# Big Data

## Description (en-US)

Select use [virtual scroll](https://github.com/react-component/virtual-list) which get better performance, turn off it by setting `:virtual="false"`.

## Source

```vue
<script setup lang="ts">
import type { SelectProps } from 'antdv-next'
import { shallowRef } from 'vue'

const options: SelectProps['options'] = []
for (let i = 0; i < 100000; i++) {
  const value = `${i.toString(36)}${i}`
  options.push({
    label: value,
    value,
    disabled: i === 10,
  })
}
const value = shallowRef(['a10', 'c12'])
</script>

<template>
  <a-typography-title :level="4">
    {{ options?.length }} Items
  </a-typography-title>
  <a-select v-model:value="value" mode="multiple" style="width: 100%" placeholder="Please select" :options="options" />
</template>

<style scoped>

</style>
```
