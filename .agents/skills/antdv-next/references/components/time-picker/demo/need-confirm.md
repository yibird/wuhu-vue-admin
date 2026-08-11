# Need Confirm

## Description (en-US)

TimePicker will automatically determine whether to show a confirm button according to the `picker` property. You can also set the `needConfirm` property to determine whether to show a confirm button. When `needConfirm` is set, the user must click the confirm button to complete the selection. Otherwise, the selection will be submitted when the picker loses focus or select a time.

## Source

```vue
<script setup lang="ts">
function onChange(time: any, timeString: string) {
  console.log(time, timeString)
}
</script>

<template>
  <a-time-picker need-confirm @change="onChange" />
</template>
```
