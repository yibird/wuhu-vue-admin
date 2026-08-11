# Circular progress bar

## Description (en-US)

A circular progress bar.

## Source

```vue
<template>
  <a-flex gap="small" wrap>
    <a-progress type="circle" :percent="75" />
    <a-progress type="circle" :percent="70" status="exception" />
    <a-progress type="circle" :percent="100" />
  </a-flex>
</template>
```
