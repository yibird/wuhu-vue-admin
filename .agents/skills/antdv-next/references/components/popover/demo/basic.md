# Basic

## Description (en-US)

The most basic example. The size of the floating layer depends on the contents region.

## Source

```vue
<template>
  <a-popover title="Title">
    <template #content>
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    </template>
    <a-button type="primary">
      Hover me
    </a-button>
  </a-popover>
</template>

<style scoped>
:global(.ant-popover-content p) {
  margin: 0;
}
</style>
```
