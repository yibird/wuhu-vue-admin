import {
  NAutoComplete,
  NCascader,
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NSelect,
  NSwitch,
  NTimePicker,
} from 'naive-ui'
import { QueryButton } from './components'

import type { ComponentType } from './types'

export const COMPONENT_MAPPING: Record<ComponentType, any> = {
  input: NInput,
  inputNumber: NInputNumber,
  select: NSelect,
  checkbox: NCheckbox,
  checkboxGroup: NCheckboxGroup,
  radio: NRadio,
  radioGroup: NRadioGroup,
  switch: NSwitch,
  datePicker: NDatePicker,
  timePicker: NTimePicker,
  autoComplete: NAutoComplete,
  cascader: NCascader,

  'query-button': QueryButton,
}
