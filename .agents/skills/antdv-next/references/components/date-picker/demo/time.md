# Choose Time

## Description (en-US)

This property provides an additional time selection. When `showTime` is an Object, its properties will be passed on to the built-in `TimePicker`.

## Source

```vue
<script setup lang="ts">
function handleOk(value: any) {
  console.log('onOk: ', value)
}

function handleChange(value: any, dateString: string | string[]) {
  console.log('Selected Time: ', value)
  console.log('Formatted Selected Time: ', dateString)
}
</script>

<template>
  <a-space vertical :size="12">
    <a-date-picker show-time @change="handleChange" @ok="handleOk" />
    <a-range-picker
      :show-time="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      @change="handleChange"
      @ok="handleOk"
    />
  </a-space>
</template>
```
