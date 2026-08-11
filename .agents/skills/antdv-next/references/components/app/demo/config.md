# Hooks config

## Description (en-US)

Config for `message`, `notification`.

## Source

```vue
<script setup lang="ts">
import MyPage2 from './myPage2.vue'
</script>

<template>
  <a-app :message="{ maxCount: 1 }" :notification="{ placement: 'bottomLeft' }">
    <MyPage2 />
  </a-app>
</template>
```
