<template>
  <a-form-item
    :name="schema.field"
    :label="resolvedSchema.label"
    :rules="mergedRules"
    :tooltip="resolvedSchema.tooltip"
    v-bind="resolvedSchema.formItemProps"
  >
    <FieldSlotRenderer
      v-if="fieldSlot"
      :render="fieldSlot"
      :slot-props="fieldSlotProps"
    />
    <component
      :is="control"
      v-else-if="control"
      v-bind="controlProps"
      v-on="controlEvents"
    />
  </a-form-item>
</template>

<script setup lang="ts">
import { computed, toValue, watch } from 'vue'
import { FieldSlotRenderer } from './field-slot-renderer'
import {
  getLazyTriggerEvents,
  isCheckedBinding,
  normalizeControlProps,
  resolveFormComponent,
  supportsOptions,
} from '../options'
import type { FormProps, Rule } from 'antdv-next'
import type { Component } from 'vue'
import type {
  FormPlusContext,
  FormPlusFieldSlotProps,
  FormPlusSchema,
} from '../types'

const props = defineProps<{
  /**
   * @desc 字段配置
   */
  schema: FormPlusSchema
  /**
   * @desc 表单上下文
   */
  context: FormPlusContext
  /**
   * @desc 控件尺寸
   */
  size?: FormProps['size']
  /**
   * @desc 表单级校验规则
   */
  rules?: Rule[]
  /**
   * @desc 局部控件注册表
   */
  localComponents?: Record<string, Component>
  /**
   * @desc 字段插槽渲染函数,由 schema.slot 命中
   */
  fieldSlot?: (slotProps: FormPlusFieldSlotProps) => unknown
}>()

/**
 * 当前字段值
 *
 * 直接读 context 而不由父级透传:依赖范围收敛到本字段,
 * 输入时只有这个 FormItem 重渲染。
 */
const value = computed(() => props.context.getValue(props.schema.field))

/**
 * 字段声明的禁用态(含联动与 setSchema 覆盖)
 *
 * 与 isDisabled 的区别是「未声明」时保留 undefined,用于区分「没配置」与
 * 「显式配置成 false」,避免写入控件属性时覆盖 componentProps.disabled。
 */
const declaredDisabled = computed(
  () => props.context.getSchema(props.schema.field)?.disabled
)

/**
 * 字段级禁用态
 */
const disabled = computed(() => Boolean(toValue(declaredDisabled.value)))

const componentName = computed(() => props.schema.component)

const control = computed(() =>
  resolveFormComponent(componentName.value, props.localComponents)
)

const checkedBinding = computed(() => isCheckedBinding(componentName.value))

const bindingProp = computed(() => (checkedBinding.value ? 'checked' : 'value'))

const optionsState = computed(() =>
  supportsOptions(componentName.value)
    ? props.context.getOptionsState(props.schema.field)
    : undefined
)

const controlProps = computed(() => {
  const merged = normalizeControlProps(props.schema.componentProps)
  const state = optionsState.value

  // 只有声明了 getOptions 的字段才接管 options,避免覆盖静态 options
  if (state && props.schema.getOptions) {
    if (merged.options === undefined) merged.options = state.options
    if (merged.loading === undefined) merged.loading = state.loading
  }

  merged[bindingProp.value] = value.value
  // 只有 schema 明确声明了禁用态才覆盖,否则沿用 componentProps.disabled
  if (declaredDisabled.value !== undefined) merged.disabled = disabled.value
  if (merged.size === undefined && props.size) merged.size = props.size

  return merged
})

function handleUpdate(value: unknown) {
  props.context.setValue(props.schema.field, value)
}

function handleLazyLoad() {
  const state = optionsState.value
  if (!props.schema.getOptions || !state) return
  if (state.loaded || state.loading) return

  props.context.reloadOptions(props.schema.field)
}

const controlEvents = computed(() => {
  const events: Record<string, unknown> = {
    [`update:${bindingProp.value}`]: handleUpdate,
  }
  if (props.fieldSlot) return events

  events.focus = handleLazyLoad
  if (props.schema.lazy) {
    for (const event of getLazyTriggerEvents(componentName.value)) {
      events[event] = handleLazyLoad
    }
  }

  return events
})

/**
 * 合并联动与 setSchema 之后的字段配置
 *
 * 父级按原始 schemas 透传,补丁只存在上下文里;rules / required 这类要交给
 * antd 的配置必须在这里合并,否则联动动态声明的必填不会生效(也不显示星号)。
 */
const resolvedSchema = computed(
  () => props.context.getSchema(props.schema.field) ?? props.schema
)

const mergedRules = computed<Rule[] | undefined>(() => {
  const { rules: schemaRules, required } = resolvedSchema.value
  const rules = [...(props.rules ?? []), ...(schemaRules ?? [])]
  if (required) rules.unshift({ required: true })
  return rules.length > 0 ? rules : undefined
})

const fieldSlotProps = computed<FormPlusFieldSlotProps>(() => ({
  schema: props.schema,
  value: value.value,
  setValue: (value) => props.context.setValue(props.schema.field, value),
  options: optionsState.value?.options ?? [],
  loading: Boolean(optionsState.value?.loading),
  context: props.context,
}))

watch(
  control,
  (component) => {
    if (component || !import.meta.env.DEV) return
    console.warn(
      `[form-plus] 未找到控件「${componentName.value}」,请通过 registerFormComponent 注册或使用 components 局部注册`
    )
  },
  { immediate: true }
)
</script>
