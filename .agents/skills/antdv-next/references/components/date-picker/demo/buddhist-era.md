# Buddhist Era

## Description (en-US)

Use `locale` to support special calendar format.

## Source

```vue
<script setup lang="ts">
import en from 'antdv-next/date-picker/locale/en_US'
import enUS from 'antdv-next/locale/en_US'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import { shallowRef } from 'vue'

dayjs.extend(buddhistEra)

const buddhistLocale: typeof en = {
  ...en,
  lang: {
    ...en.lang,
    fieldDateFormat: 'BBBB-MM-DD',
    fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
    yearFormat: 'BBBB',
    cellYearFormat: 'BBBB',
  },
}

const globalBuddhistLocale: typeof enUS = {
  ...enUS,
  DatePicker: {
    ...enUS.DatePicker!,
    lang: buddhistLocale.lang,
  },
}

const defaultValue = dayjs('2024-01-01')
const localeDateValue = shallowRef(defaultValue)
const localeDateTimeValue = shallowRef(defaultValue)
const providerDateValue = shallowRef(defaultValue)
const providerDateTimeValue = shallowRef(defaultValue)

function handleChange(_: any, dateStr: string | string[]) {
  console.log('onChange:', dateStr)
}
</script>

<template>
  <a-space vertical :size="12">
    <a-typography-title :level="4" style="margin: 0;" title="no, it's not">
      By locale props
    </a-typography-title>
    <a-date-picker v-model:value="localeDateValue" :locale="buddhistLocale" @change="handleChange" />
    <a-date-picker
      v-model:value="localeDateTimeValue"
      show-time
      :locale="buddhistLocale"
      @change="handleChange"
    />

    <a-typography-title :level="4" style="margin: 0;">
      By ConfigProvider
    </a-typography-title>
    <a-config-provider :locale="globalBuddhistLocale">
      <a-space vertical :size="12">
        <a-date-picker v-model:value="providerDateValue" @change="handleChange" />
        <a-date-picker v-model:value="providerDateTimeValue" show-time @change="handleChange" />
      </a-space>
    </a-config-provider>
  </a-space>
</template>
```
