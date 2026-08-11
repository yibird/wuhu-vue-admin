# Ghost Button

## Description (en-US)

The `ghost` property will make a button's background transparent, this is commonly used in colored background.

## Source

```vue
<template>
  <a-flex wrap gap="small" class="site-button-ghost-wrapper">
    <a-button type="primary" ghost>
      Primary
    </a-button>
    <a-button ghost>
      Default
    </a-button>
    <a-button type="dashed" ghost>
      Dashed
    </a-button>
    <a-button type="primary" danger ghost>
      Danger
    </a-button>
  </a-flex>
</template>
```
