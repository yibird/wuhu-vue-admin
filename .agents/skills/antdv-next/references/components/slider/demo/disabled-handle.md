# Disable specific handles

## Description (en-US)

In Range mode, `disabled` accepts a boolean array to disable specific handles individually.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref([20, 50, 80])
const disabled = ref([false, false, false])

const handleOptions = [
  { key: 'start', label: 'Disabled Handle 1' },
  { key: 'middle', label: 'Disabled Handle 2' },
  { key: 'end', label: 'Disabled Handle 3' },
]
</script>

<template>
  <a-slider
    v-model:value="value"
    :range="{ draggableTrack: true, minCount: 2, maxCount: 5 }"
    :disabled="disabled"
  />
  <a-flex gap="small" align="center" justify="flex-start" :style="{ marginTop: '16px' }">
    <a-checkbox
      v-for="(handle, index) in handleOptions"
      :key="`item-${handle.key}`"
      v-model:checked="disabled[index]"
    >
      {{ handle.label }}
    </a-checkbox>
  </a-flex>
</template>
```
