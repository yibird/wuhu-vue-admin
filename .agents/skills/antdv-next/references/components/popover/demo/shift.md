# Auto Shift

## Description (en-US)

Auto adjust Popup and arrow position when Popover is close to the edge of the screen. Will be out of screen when exceed limitation.

## Source

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const open = ref(false)

onMounted(() => {
  setTimeout(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight
    document.documentElement.scrollLeft = document.documentElement.clientWidth

    requestAnimationFrame(() => {
      open.value = true
    })
  }, 10)
})
</script>

<template>
  <div class="h-300vh w-300vw flex items-center justify-center">
    <a-popover content="Thanks for using antd. Have a nice day !" :open="open">
      <a-button type="primary">
        Scroll The Window
      </a-button>
    </a-popover>
  </div>
</template>
```
