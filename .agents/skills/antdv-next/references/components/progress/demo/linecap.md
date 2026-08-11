# Stroke Linecap

## Description (en-US)

By setting `strokeLinecap="butt"`, you can change the linecaps from `round` to `butt`, see [stroke-linecap](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) for more information.

## Source

```vue
<template>
  <a-flex vertical gap="small">
    <a-progress stroke-linecap="butt" :percent="75" />
    <a-flex wrap gap="small">
      <a-progress stroke-linecap="butt" type="circle" :percent="75" />
      <a-progress stroke-linecap="butt" type="dashboard" :percent="75" />
    </a-flex>
  </a-flex>
</template>
```
