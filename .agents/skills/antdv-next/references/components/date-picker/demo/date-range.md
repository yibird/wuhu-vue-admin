# Limit Date Range

## Description (en-US)

Limit the range of available dates by using `minDate` and `maxDate`.

## Source

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { shallowRef } from 'vue'

dayjs.extend(customParseFormat)

const dateFormat = 'YYYY-MM-DD'
const value = shallowRef(dayjs('2019-09-03', dateFormat))
</script>

<template>
  <a-date-picker
    v-model:value="value"
    :min-date="dayjs('2019-08-01', dateFormat)"
    :max-date="dayjs('2020-10-31', dateFormat)"
  />
</template>
```
