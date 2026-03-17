<template>
  <n-form v-bind="opt" ref="formRef">
    <template v-if="opt?.grid">
      <n-grid v-bind="gridProps">
        <n-form-item-gi
          v-for="(item, index) in renderItems"
          :key="index"
          v-bind="item"
        >
          <component
            v-if="item.type"
            :is="COMPONENT_MAPPING[item.type]"
            v-bind="item.componentProps"
            :value="getModelValue(item.path)"
            @update:value="(val: unknown) => setModelValue(item.path, val)"
          />
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
import { cloneDeep, toMerged } from 'es-toolkit'
import type { FormInst, GridProps } from 'naive-ui'
import type {
  FormPlusProps,
  FormPlusFormEmits,
  FormPlusInstance,
  FormPlusItem,
} from './types'
import { COMPONENT_MAPPING } from './options'

const defaultOpt: FormPlusProps['options'] = {}
const defaultGridProps: GridProps = {
  cols: 24,
  xGap: 0,
  yGap: 0,
  responsive: 'screen',
  itemResponsive: true,
}

const {
  options = {},
  items = [],
  showQueryButton = true,
} = defineProps<FormPlusProps>()
const emits = defineEmits<FormPlusFormEmits>()
const formRef = ref<FormInst>()

const opt = toMerged(defaultOpt, options)
const initialModel = ref(cloneDeep(opt?.model || {}))
const initialItems = ref<FormPlusItem[]>(cloneDeep(items))

const gridProps = computed<GridProps>(() => {
  if (typeof opt?.grid === 'boolean' && opt?.grid) {
    return defaultGridProps
  }
  return { ...defaultGridProps, ...(opt?.grid as GridProps) }
})

const queryButtonItem: FormPlusItem = {
  type: 'query-button',
  componentProps: {
    onSearch() {
      emits('search', getFiledValues())
    },
    onReset() {
      formRef.value?.restoreValidation()
      emits('reset')
    },
  },
}
const renderItems = computed(() => {
  return showQueryButton
    ? ([...items, queryButtonItem] as FormPlusItem[])
    : items
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

const getFiledValues = <T = unknown>(): T | undefined => {
  return options?.model ? (cloneDeep(options?.model) as T) : undefined
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
    const index = initialItems.value.findIndex(
      (item) => (item as FormPlusItem).path === path
    )
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

    if (options?.formChange === true) {
      emits('change', options.model)
    }
  },
  validate(...args) {
    return formRef.value!.validate(...args)
  },
  restoreValidation() {
    formRef.value?.restoreValidation()
  },
  invalidateLabelWidth() {
    formRef.value?.invalidateLabelWidth()
  },
})
</script>
