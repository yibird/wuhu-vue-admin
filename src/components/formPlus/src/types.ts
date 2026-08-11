import type { ToRefs } from 'vue'

export type FormPlusValue = unknown
export type FormPlusModel = Record<string, FormPlusValue>
export type FormPlusSlots = Record<string, unknown>

export type ComponentType =
  | 'input'
  | 'inputNumber'
  | 'select'
  | 'checkbox'
  | 'checkboxGroup'
  | 'radio'
  | 'radioGroup'
  | 'switch'
  | 'datePicker'
  | 'timePicker'
  | 'autoComplete'
  | 'cascader'

export interface FormPlusControlProps extends Record<string, unknown> {
  span?: number
  clearable?: boolean
}

export interface FormPlusItem {
  type: ComponentType
  field: string
  label: string
  props?: FormPlusControlProps
  slots?: FormPlusSlots
}

export interface FormPlusProps {
  options: {
    items: readonly FormPlusItem[]
    labelPlacement?: 'left' | 'top'
    labelWidth?: number | 'auto'
    grid?: {
      xGap?: number
      yGap?: number
    }
  }
}

export interface FormContextState extends FormPlusProps {}

export type FormPlusProvide = ToRefs<Required<FormContextState>> & {
  emits: {
    (e: 'submit', values: FormPlusModel): void
    (e: 'reset'): void
  }
}

export interface FormPlusContext {}

export interface FormPlusInstance {
  submit: () => void
  reset: () => void
  setFieldValue: (field: string, value: FormPlusValue) => void
  getFieldValue: (field: string) => FormPlusValue
  setFieldsValue: (values: FormPlusModel) => void
  getFieldsValue: () => FormPlusModel
}
