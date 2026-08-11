# Collapsible Icon

## Description (en-US)

Control the display of collapsible icon with `showCollapsibleIcon`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const showIconMode = ref<'auto' | boolean>(true)

const options = [
  { label: 'Auto', value: 'auto' },
  { label: 'True', value: true },
  { label: 'False', value: false },
]
</script>

<template>
  <a-flex vertical :gap="20">
    <a-flex :gap="5">
      <p>ShowCollapsibleIcon:</p>
      <a-radio-group v-model:value="showIconMode" :options="options" />
    </a-flex>
    <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <a-splitter-panel
        :collapsible="{ start: true, end: true, showCollapsibleIcon: showIconMode }"
        min="20%"
      >
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel
        :collapsible="{ start: true, end: true, showCollapsibleIcon: showIconMode }"
      >
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel
        :collapsible="{ start: true, end: true, showCollapsibleIcon: showIconMode }"
      >
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            Third
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
  </a-flex>
</template>
```
