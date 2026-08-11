# Change on scroll

## Description (en-US)

Use `changeOnScroll` and `needConfirm` to change the value when scrolling.

## Source

```vue
<script setup lang="ts">
function onChange(time: any, timeString: string) {
  console.log(time, timeString)
}
</script>

<template>
  <a-time-picker change-on-scroll :need-confirm="false" @change="onChange" />
</template>
```
