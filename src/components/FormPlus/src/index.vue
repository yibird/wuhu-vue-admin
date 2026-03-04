<template>
  <n-form v-bind="opt" ref="formRef">
    <template v-if="opt?.grid">
      <n-grid v-bind="gridProps">
        <n-form-item-gi v-for="(item, index) in items" :key="index" v-bind="item">
          <component
            v-if="item.type"
            :is="COMPONENT_MAPPING[item.type]"
            v-bind="item.componentProps"
            :value="getModelValue(item.path)"
            @update:value="(val: unknown) => setModelValue(item.path, val)"
          />
        </n-form-item-gi>
        <n-form-item-gi v-if="opt?.searchButton?.show" class="ml-10">
          <div class="flex gap-10">
            <n-button v-if="showSearchButton" type="primary" @click="onSearch">搜索</n-button>
            <n-button v-if="showResetButton" @click="onReset">重置</n-button>
          </div>
        </n-form-item-gi>
      </n-grid>
    </template>
    <template v-else>
      <n-form-item v-for="(item, index) in items" :key="index" v-bind="item">
        <n-input />
      </n-form-item>
    </template>
  </n-form>
</template>
<script lang="ts" setup>
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
  NTimePicker
} from 'naive-ui'
import { cloneDeep, toMerged } from 'es-toolkit'
import type { FormInst, GridProps } from 'naive-ui'
import type {
  ComponentType,
  FormPlusProps,
  FormPlusFormEmits,
  FormPlusInstance,
  FormPlusItem
} from './types'

const COMPONENT_MAPPING: Record<ComponentType, any> = {
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
  cascader: NCascader
}

const defaultopt: FormPlusProps['options'] = {
  searchButton: {
    show: true,
    buttons: ['search', 'reset']
  }
}
const defaultGridProps: GridProps = {
  cols: 24,
  xGap: 0,
  yGap: 0,
  responsive: 'screen',
  itemResponsive: true
}

const { options = {}, items = [] } = defineProps<FormPlusProps>()
const emits = defineEmits<FormPlusFormEmits>()
const formRef = ref<FormInst>()

const opt = toMerged(defaultopt, options)
const initialModel = ref(cloneDeep(opt?.model || {}))
const initialItems = ref<FormPlusItem[]>(cloneDeep(items))

const gridProps = computed<GridProps>(() => {
  if (typeof opt?.grid === 'boolean' && opt?.grid) {
    return defaultGridProps
  }
  return { ...defaultGridProps, ...(opt?.grid as GridProps) }
})

const showSearchButton = computed(() => {
  return opt?.searchButton?.buttons?.includes('search')
})

const showResetButton = computed(() => {
  return opt?.searchButton?.buttons?.includes('reset')
})

const getModelValue = (path?: string) => {
  return path?.split('.').reduce((obj, key) => {
    return obj ? obj[key] : undefined
  }, options?.model)
}
const setModelValue = (path?: string, value?: unknown) => {
  if (!path || !options?.model) return
  const keys = path.split('.')
  const lastKey = keys.pop()
  if (!lastKey) return
  const target = keys.reduce((obj, key) => {
    return obj![key]
  }, options?.model)
  console.log('asdasdasd', target)
  const oldValue = target![lastKey]
  target![lastKey] = value
  if (oldValue !== value && opt?.formChange === true) {
    emits('change', options.model)
  }
}

const getFiledValues = <T = unknown,>(): T | undefined => {
  return options?.model ? (cloneDeep(options?.model) as T) : undefined
}

const onSearch = () => {
  emits('search', getFiledValues())
}
const onReset = () => {
  formRef.value?.restoreValidation()
  emits('reset')
}

defineExpose<FormPlusInstance>({
  setFiled(path: string, filed: FormPlusItem) {
    const newItems = items.map((item) => (item.path === path ? filed : item))
    emits('update:items', newItems)
  },
  getFiled(path: string): FormPlusItem | undefined {
    return items.find((item) => item.path === path)
  },
  resetFiled(path: string) {
    const index = initialItems.value.findIndex((item) => (item as FormPlusItem).path === path)
    if (index === -1) return
    const record = initialItems.value[index] as FormPlusItem
    const newItems = items.map((item) => (item.path === path ? record : item))
    emits('update:items', newItems)
  },
  getFiledValues,
  setFiledValues(values: Record<string, any>) {
    if (!options?.model) return
    options.model = values
  },

  resetFiledValues() {
    if (!options?.model) return
    options.model = cloneDeep(initialModel.value)
  },

  setFiledValue: function (path: string, value: unknown): void {
    setModelValue(path, value)
  },
  getFiledValue: function (path: string): unknown {
    return getModelValue(path)
  },
  resetFiledValue: function (path: string): void {
    if (!path || !opt?.model) return
    // 初始值
    const initialValue = path.split('.').reduce((obj, key) => {
      return obj ? obj[key] : undefined
    }, initialModel.value)

    const keys = path.split('.')
    const lastKey = keys.pop()
    if (!lastKey) return

    const target = keys.reduce((obj, key) => {
      return obj[key]
    }, opt.model)

    target[lastKey] = cloneDeep(initialValue)

    // 如果需要触发 change 事件
    if (options?.formChange === true) {
      emits('change', options.model)
    }
  },
  validate(...args) {
    return formRef.value!.validate(...args)
  },
  restoreValidation() {
    formRef.value?.restoreValidation()
  }
})
</script>
