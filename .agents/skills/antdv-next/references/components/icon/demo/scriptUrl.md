# Multiple resources from iconfont.cn

## Description (en-US)

You can use `scriptUrl`  to manage icons in one icon from multiple [iconfont.cn](http://iconfont.cn/) resources. If an icon with a duplicate name is in resources, it will be overridden in array order.

## Source

```vue
<script setup lang="ts">
import { createFromIconfontCN } from '@antdv-next/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js', // icon-javascript, icon-java, icon-shoppingcart (overridden)
    '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
  ],
})
</script>

<template>
  <a-space>
    <IconFont type="icon-javascript" />
    <IconFont type="icon-java" />
    <IconFont type="icon-shoppingcart" />
    <IconFont type="icon-python" />
  </a-space>
</template>
```
