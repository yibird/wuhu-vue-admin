# Basic

## Description (en-US)

Set the default size with `defaultSize`, and restrict the panel size with `min` and `max`.

## Source

```vue
<template>
  <a-splitter style="height: 200px;box-shadow: 0 0 10px rgba(0,0,0,0.1)">
    <a-splitter-panel default-size="40%" min="20%" max="70%">
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
