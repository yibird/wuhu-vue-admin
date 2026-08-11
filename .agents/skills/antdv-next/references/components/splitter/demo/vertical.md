# Vertical

## Description (en-US)

Vertical split panel.

## Source

```vue
<template>
  <a-splitter orientation="vertical" style="height: 300px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
    <a-splitter-panel>
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
          First
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
    <a-splitter-panel>
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
          Second
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
  </a-splitter>
</template>
```
