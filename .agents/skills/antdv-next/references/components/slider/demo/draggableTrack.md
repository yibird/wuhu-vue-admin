# Draggable Track

## Description (en-US)

Make range track draggable by setting `range.draggableTrack`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref([20, 50])
</script>

<template>
  <a-slider v-model:value="value" :range="{ draggableTrack: true }" />
</template>
```
