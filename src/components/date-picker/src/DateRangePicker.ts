import { DateRangePicker as AntDateRangePicker } from 'antdv-next/dist/date-picker/index'
import { computed, defineComponent, h, useAttrs, useSlots } from 'vue'
import { defaultDateRangePresets } from './presets'
import type { Component } from 'vue'

const InternalDateRangePicker = AntDateRangePicker as Component

const DateRangePicker = defineComponent({
  name: 'DateRangePicker',
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    const slots = useSlots()
    const pickerProps = computed(() => ({
      ...attrs,
      presets: attrs.presets ?? defaultDateRangePresets,
    }))

    return () => h(InternalDateRangePicker, pickerProps.value, slots)
  },
}) as typeof AntDateRangePicker

export default DateRangePicker
