# Customize

## Description (en-US)

Customize description and extra content.

## Source

```vue
<template>
  <a-empty
    :styles="{ image: { height: '60px' } }"
    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
  >
    <template #description>
      Customize <a href="#API">Description</a>
    </template>
    <a-button type="primary">
      Create Now
    </a-button>
  </a-empty>
</template>
```
