# Select range dates

## Description (en-US)

Using `info.from` of `disabledDate` to limit the dynamic date range selection.

## Source

```vue
<script setup lang="ts">
import type { DatePickerProps } from 'antdv-next'
import type { Dayjs } from 'dayjs'

const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month()

const disabled7DaysDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
  if (from) {
    const minDate = from.add(-6, 'days')
    const maxDate = from.add(6, 'days')

    switch (type) {
      case 'year':
        return current.year() < minDate.year() || current.year() > maxDate.year()
      case 'month':
        return (
          getYearMonth(current) < getYearMonth(minDate)
          || getYearMonth(current) > getYearMonth(maxDate)
        )
      default:
        return Math.abs(current.diff(from, 'days')) >= 7
    }
  }

  return false
}

const disabled6MonthsDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
  if (from) {
    const minDate = from.add(-5, 'months')
    const maxDate = from.add(5, 'months')

    switch (type) {
      case 'year':
        return current.year() < minDate.year() || current.year() > maxDate.year()
      default:
        return (
          getYearMonth(current) < getYearMonth(minDate)
          || getYearMonth(current) > getYearMonth(maxDate)
        )
    }
  }

  return false
}
</script>

<template>
  <a-space vertical>
    <a-typography-title :level="5">
      7 days range
    </a-typography-title>
    <a-range-picker :disabled-date="disabled7DaysDate" />

    <a-typography-title :level="5">
      6 months range
    </a-typography-title>
    <a-range-picker picker="month" :disabled-date="disabled6MonthsDate" />
  </a-space>
</template>
```
