# Configuring the Separator

## Description (en-US)

The separator can be customized by setting the separator property: `separator=">"`.

## Source

```vue
<script setup lang="ts">
const items = [
  {
    title: 'Home',
  },
  {
    title: 'Application Center',
    href: '',
  },
  {
    title: 'Application List',
    href: '',
  },
  {
    title: 'An Application',
  },
]
</script>

<template>
  <a-breadcrumb separator=">" :items="items" />
</template>
```
