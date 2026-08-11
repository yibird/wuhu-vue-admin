# Card

## Description (en-US)

Nested inside a container element for rendering in limited space.

## Source

```vue
<script setup lang="ts">
import type { CalendarProps } from 'antdv-next'
import type { Dayjs } from 'dayjs'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

function onPanelChange(value: Dayjs, mode: CalendarProps<Dayjs>['mode']) {
  console.log(value.format('YYYY-MM-DD'), mode)
}
</script>

<template>
  <div class="wrapStyle">
    <a-calendar :fullscreen="false" @panel-change="onPanelChange" />
  </div>
</template>

<style scoped>
.wrapStyle {
  width: 300px;
  border: 1px solid v-bind('token.colorBorder');
  border-radius: 8px;
}
</style>
```
