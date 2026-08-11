# Layout Group

## Description (en-US)

Nested Splitter for complex layout.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <a-splitter style="height: 300px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
    <a-splitter-panel collapsible>
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
          Left
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
    <a-splitter-panel>
      <a-splitter orientation="vertical">
        <a-splitter-panel>
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
              Top
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
        <a-splitter-panel>
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
              Bottom
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
      </a-splitter>
    </a-splitter-panel>
  </a-splitter>
</template>
```
