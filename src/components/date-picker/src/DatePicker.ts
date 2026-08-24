import { DatePicker as AntDatePicker } from 'antdv-next'
import { computed, defineComponent, h, useAttrs, useSlots } from 'vue'
import DateRangePicker from './DateRangePicker'
import { defaultDatePresets } from './presets'
import type { Component } from 'vue'

const InternalDatePicker = AntDatePicker as Component

const WrappedDatePicker = defineComponent({
  name: 'DatePicker',
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    const slots = useSlots()
    const pickerProps = computed(() => ({
      ...attrs,
      presets: attrs.presets ?? defaultDatePresets,
    }))

    return () => h(InternalDatePicker, pickerProps.value, slots)
  },
})

const DatePicker = Object.assign(WrappedDatePicker, AntDatePicker, {
  RangePicker: DateRangePicker,
}) as typeof AntDatePicker

export default DatePicker
