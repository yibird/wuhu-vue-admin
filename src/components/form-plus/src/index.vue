<template>
  <div class="form-plus">
    <a-form
      ref="formRef"
      :model="model"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :layout="options.labelPlacement === 'top' ? 'vertical' : 'horizontal'"
    >
      <template v-if="options.grid">
        <a-row :gutter="[options.grid.xGap ?? 0, options.grid.yGap ?? 0]">
          <a-col
            v-for="item in options.items"
            :key="item.field"
            :span="item.props?.span ?? 24"
          >
            <a-form-item :label="item.label" :name="item.field">
              <component
                :is="COMPONENT_MAPPING[item.type]"
                v-model:value="model[item.field]"
                v-bind="normalizeControlProps(item.props)"
              />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item>
              <QueryButton @search="onSubmit" @reset="onReset" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>
      <template v-else>
        <div class="flex flex-wrap gap-16">
          <a-form-item
            v-for="item in options.items"
            :key="item.field"
            :label="item.label"
            :name="item.field"
          >
            <component
              :is="COMPONENT_MAPPING[item.type]"
              v-model:value="model[item.field]"
              v-bind="normalizeControlProps(item.props)"
            />
          </a-form-item>
          <a-form-item>
            <QueryButton @search="onSubmit" @reset="onReset" />
          </a-form-item>
        </div>
      </template>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import type {
  FormPlusControlProps,
  FormPlusInstance,
  FormPlusModel,
  FormPlusProps,
  FormPlusValue,
} from './types'
import { COMPONENT_MAPPING } from './options'
import QueryButton from './components/QueryButton.vue'

interface ResettableForm {
  resetFields: () => void
}

const props = defineProps<FormPlusProps>()
const emits = defineEmits<{
  (e: 'submit', values: FormPlusModel): void
  (e: 'reset'): void
}>()

const formRef = useTemplateRef<ResettableForm>('formRef')
const model = ref<FormPlusModel>({})

const labelCol = computed(() => {
  if (props.options.labelWidth === 'auto') return { flex: 'auto' }
  return { style: { width: `${props.options.labelWidth}px` } }
})
const wrapperCol = computed(() => {
  return { flex: '1' }
})

const normalizeControlProps = (controlProps?: FormPlusControlProps) => {
  if (!controlProps) return undefined

  const { clearable } = controlProps
  const controlAttrs: Record<string, unknown> = { ...controlProps }
  delete controlAttrs.clearable
  delete controlAttrs.span
  if (clearable === undefined) return controlAttrs

  return { ...controlAttrs, allowClear: clearable }
}

const itemFields = computed(() => props.options.items.map((item) => item.field))

// Initialize model based on fields while preserving existing values.
watch(
  itemFields,
  (fields) => {
    const previousModel = model.value
    model.value = Object.fromEntries(
      fields.map((field) => [field, previousModel[field]])
    )
  },
  { immediate: true }
)

const onSubmit = () => {
  emits('submit', getFieldsValue())
}

const onReset = () => {
  formRef.value?.resetFields()
  emits('reset')
}

const setFieldValue = (field: string, value: FormPlusValue) => {
  model.value = {
    ...model.value,
    [field]: value,
  }
}

const getFieldValue = (field: string) => model.value[field]

const setFieldsValue = (values: FormPlusModel) => {
  model.value = {
    ...model.value,
    ...values,
  }
}

const getFieldsValue = () => ({ ...model.value })

defineExpose<FormPlusInstance>({
  submit: onSubmit,
  reset: onReset,
  setFieldValue,
  getFieldValue,
  setFieldsValue,
  getFieldsValue,
})
</script>
