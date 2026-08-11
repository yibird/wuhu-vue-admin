# Block Button

## Description (en-US)

The `block` property will make a button fit to its parent width.

## Source

```vue
<template>
  <a-flex vertical gap="small" style="width: 100%">
    <a-button type="primary" block>
      Primary
    </a-button>
    <a-button block>
      Default
    </a-button>
    <a-button type="dashed" block>
      Dashed
    </a-button>
    <a-button disabled block>
      disabled
    </a-button>
    <a-button type="text" block>
      text
    </a-button>
    <a-button type="link" block>
      Link
    </a-button>
  </a-flex>
</template>
```
