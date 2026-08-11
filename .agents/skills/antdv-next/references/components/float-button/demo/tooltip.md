# FloatButton with tooltip

## Description (en-US)

Setting the `tooltip` property shows the FloatButton with a tooltip.

## Source

```vue
<template>
  <a-float-button
    style="inset-block-end: 108px;"
    :tooltip="{
      title: 'Since 5.25.0+',
      color: 'blue',
      placement: 'top',
    }"
  />
  <a-float-button>
    <template #tooltip>
      <div>Documents</div>
    </template>
  </a-float-button>
</template>
```
