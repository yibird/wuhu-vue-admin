# Container to scroll.

## Description (en-US)

Set a `target` for 'Affix', which is listen to scroll event of target element (default is `window`).

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const container = shallowRef()
</script>

<template>
  <div ref="container" style="width: 100%;height: 100px;overflow: auto;box-shadow: 0 0 0 1px #1677ff;scrollbar-width: thin;scrollbar-gutter: stable">
    <div style="width: 100%;height: 1000px">
      <a-affix :target="() => container">
        <a-button type="primary">
          Fixed at the top of container
        </a-button>
      </a-affix>
    </div>
  </div>
</template>
```
