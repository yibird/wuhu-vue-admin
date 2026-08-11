# Mask Format

## Description (en-US)

Align the date format. Switch the selection by arrow keys. Will try to align the date to the last valid date when blur.

## Source

```vue
<script setup lang="ts">
function handleChange(date: any, dateString: string | string[]) {
  console.log(date, dateString)
}
</script>

<template>
  <a-space vertical>
    <a-date-picker
      :format="{ format: 'YYYY-MM-DD', type: 'mask' }"
      @change="handleChange"
    />
    <a-date-picker
      :format="{ format: 'YYYY-MM-DD HH:mm:ss', type: 'mask' }"
      @change="handleChange"
    />
  </a-space>
</template>
```
