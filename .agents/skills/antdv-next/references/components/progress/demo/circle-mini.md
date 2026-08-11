# Mini size circular progress bar

## Description (en-US)

A smaller circular progress bar.

## Source

```vue
<template>
  <a-flex wrap gap="small">
    <a-progress type="circle" :percent="30" :size="80" />
    <a-progress type="circle" :percent="70" status="exception" :size="80" />
    <a-progress type="circle" :percent="100" :size="80" />
  </a-flex>
</template>
```
