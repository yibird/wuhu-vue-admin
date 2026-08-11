# Basic

## Description (en-US)

A basic calendar component with Year/Month switch.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef()
</script>

<template>
  <a-calendar v-model:value="value" />
</template>
```
