# Multiple

## Description (en-US)

Multiple panels split.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
    <a-splitter-panel collapsible>
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
          Panel 1
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
    <a-splitter-panel :collapsible="{ start: true }">
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
          Panel 2
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
    <a-splitter-panel>
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
          Panel 3
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
  </a-splitter>
</template>
```
