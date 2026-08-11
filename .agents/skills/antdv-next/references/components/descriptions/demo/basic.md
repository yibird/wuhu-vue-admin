# Basic

## Description (en-US)

Simplest Usage.

## Source

```vue
<script setup lang="ts">
const items = [
  {
    key: '1',
    label: 'UserName',
    content: 'Zhou Maomao',
  },
  {
    key: '2',
    label: 'Telephone',
    content: '1810000000',
  },
  {
    key: '3',
    label: 'Live',
    content: 'Hangzhou, Zhejiang',
  },
  {
    key: '4',
    label: 'Remark',
    content: 'empty',
  },
  {
    key: '5',
    label: 'Address',
    content: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
  },
]
</script>

<template>
  <a-descriptions title="User Info" :items="items" />
</template>
```
