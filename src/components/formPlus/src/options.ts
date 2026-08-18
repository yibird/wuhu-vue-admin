import AutoComplete from 'antdv-next/dist/auto-complete/index'
import Cascader from 'antdv-next/dist/cascader/index'
import Checkbox, { CheckboxGroup } from 'antdv-next/dist/checkbox/index'
import DatePicker from 'antdv-next/dist/date-picker/index'
import Input from 'antdv-next/dist/input/index'
import InputNumber from 'antdv-next/dist/input-number/index'
import Radio, { RadioGroup } from 'antdv-next/dist/radio/index'
import Select from 'antdv-next/dist/select/index'
import Switch from 'antdv-next/dist/switch/index'
import TimePicker from 'antdv-next/dist/time-picker/index'

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
