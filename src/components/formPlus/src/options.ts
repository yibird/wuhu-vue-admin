import {
  Input,
  InputNumber,
  Select,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  DatePicker,
  TimePicker,
  AutoComplete,
  Cascader,
} from 'antdv-next'

import type { ComponentType } from './types'
import type { Component } from 'vue'

export const COMPONENT_MAPPING: Record<ComponentType, Component> = {
  input: Input,
  inputNumber: InputNumber,
  select: Select,
  checkbox: Checkbox,
  checkboxGroup: CheckboxGroup,
  radio: Radio,
  radioGroup: RadioGroup,
  switch: Switch,
  datePicker: DatePicker,
  timePicker: TimePicker,
  autoComplete: AutoComplete,
  cascader: Cascader,
}
