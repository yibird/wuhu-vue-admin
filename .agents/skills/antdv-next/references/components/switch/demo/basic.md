# Basic

## Description (en-US)

The most basic usage.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const checked = shallowRef(true)

function onChange(checked: boolean) {
  console.log(`switch to ${checked}`)
}
</script>

<template>
  <a-switch v-model:checked="checked" @change="onChange" />
</template>
```
