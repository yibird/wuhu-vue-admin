# Allow Empty

## Description (en-US)

Allow empty for the RangePicker. It's useful when you need to keep the "to date".

## Source

```vue
<script setup lang="ts">
function handleChange(date: any, dateString: string | string[]) {
  console.log(date, dateString)
}
</script>

<template>
  <a-range-picker
    :placeholder="['Start Date', 'Till Now']"
    :allow-empty="[false, true]"
    @change="handleChange"
  />
</template>
```
