# Use iconfont.cn

## Description (en-US)

If you are using [iconfont.cn](http://iconfont.cn/), you can use the icons in your project gracefully.

## Source

```vue
<script setup lang="ts">
import { createFromIconfontCN } from '@antdv-next/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
})
</script>

<template>
  <a-space>
    <IconFont type="icon-tuichu" />
    <IconFont type="icon-facebook" style="color: '#1877F2'" />
    <IconFont type="icon-twitter" />
  </a-space>
</template>
```
