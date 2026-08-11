# Need Confirm

## Description (en-US)

DatePicker will automatically determine whether to show a confirm button according to the `picker` property. You can also set the `needConfirm` property to determine whether to show a confirm button. When `needConfirm` is set, the user must click the confirm button to complete the selection. Otherwise, the selection will be submitted when the picker loses focus or selects a date.

## Source

```vue
<script setup lang="ts">
import type { DatePickerProps } from 'antdv-next'
import type { Dayjs } from 'dayjs'

const handleChange: DatePickerProps<Dayjs, false>['onChange'] = (date, dateString) => {
  console.log(date, dateString)
}
</script>

<template>
  <a-date-picker need-confirm @change="handleChange" />
</template>
```
