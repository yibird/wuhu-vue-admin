# Basic

## Description (en-US)

Click `TimePicker`, and then we could select or input a time in panel.

## Source

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { shallowRef } from 'vue'

dayjs.extend(customParseFormat)

const value = shallowRef()

function onChange(time: any, timeString: string) {
  console.log(time, timeString)
}
</script>

<template>
  <a-time-picker
    v-model:value="value"
    @change="onChange"
  />
</template>
```
