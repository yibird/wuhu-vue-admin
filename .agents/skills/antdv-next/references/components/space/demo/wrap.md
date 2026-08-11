# Wrap

## Description (en-US)

Auto wrap.

## Source

```vue
<template>
  <a-space :size="[8, 16]" wrap>
    <a-button v-for="item in 20" :key="item">
      Button
    </a-button>
  </a-space>
</template>
```
