# Custom text format

## Description (en-US)

You can set a custom text by setting the `format` prop.

## Source

```vue
<template>
  <a-flex gap="small" wrap>
    <a-progress type="circle" :percent="75" :format="percent => `${percent} Days`" />
    <a-progress type="circle" :percent="100" :format="() => 'Done'" />
  </a-flex>
</template>
```
