<template>
  <a-form
    ref="formRef"
    class="form-plus"
    :model="formModel"
    :rules="props.rules"
    :layout="formLayout"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :colon="props.colon"
    :disabled="props.disabled"
    :size="props.size"
    :validate-trigger="props.validateTrigger"
    :scroll-to-first-error="props.scrollToFirstError"
  >
    <template v-if="slots.default">
      <slot />

      <FormActions v-if="showActions" v-bind="actionsBinding" />
    </template>

    <template v-else>
      <a-row
        class="w-full"
        :gutter="[props.grid?.xGap ?? 0, props.grid?.yGap ?? 0]"
      >
        <FormFields
          :schemas="primarySchemas"
          :context="context"
          :size="props.size"
          :rules="props.rules"
          :local-components="props.components"
          :slot-of="resolveFieldSlot"
          :col-of="resolveCol"
        />

        <a-col v-if="showActions && !extraVisible" :flex="1">
          <FormActions v-bind="actionsBinding" />
        </a-col>
      </a-row>

      <Transition v-if="extraSchemas.length" name="fade-slide">
        <a-row
          v-if="!collapsed"
          class="w-full"
          :gutter="[props.grid?.xGap ?? 0, props.grid?.yGap ?? 0]"
        >
          <FormFields
            :schemas="extraSchemas"
            :context="context"
            :size="props.size"
            :rules="props.rules"
            :local-components="props.components"
            :slot-of="resolveFieldSlot"
            :col-of="resolveCol"
          />

          <a-col v-if="showActions" :flex="1">
            <FormActions v-bind="actionsBinding" />
          </a-col>
        </a-row>
      </Transition>
    </template>
  </a-form>
</template>

<script setup lang="ts">
import { computed, onMounted, useSlots, useTemplateRef } from 'vue'
import { FormActions, FormFields } from './components'
import { resolveGridSpan } from './grid'
import { provideFormPlusContext, useFormContext } from './hooks'
import { isValidationError } from './options'
import type { FormInstance } from 'antdv-next'
import type {
  FormPlusActionButton,
  FormPlusEmits,
  FormPlusFieldSlotProps,
  FormPlusInstance,
  FormPlusProps,
  FormPlusSchema,
} from './types'

const props = withDefaults(defineProps<FormPlusProps>(), {
  model: undefined,
  mode: 'query',
  disabled: false,
  labelPlacement: 'left',
  labelWidth: 80,
  collapse: undefined,
  grid: undefined,
  actions: undefined,
})

const emits = defineEmits<FormPlusEmits>()

const slots = useSlots() as Record<
  string,
  ((slotProps: FormPlusFieldSlotProps) => unknown) | undefined
>

const formRef = useTemplateRef<FormInstance>('formRef')

const {
  context,
  getSchema,
  model,
  collapse: collapseStore,
  initialize,
} = useFormContext({
  controlledModel: () => props.model,
  schemas: () => props.schemas,
  formRef,
  collapse: () => props.collapse,
  onFieldChange: (field, value, values) =>
    emits('change', field, value, values),
  onControlledUpdate: (values) => emits('update:model', values),
  onCollapseChange: (collapsed) => emits('collapse-change', collapsed),
  onOptionsError: (field, error) => emits('options-error', field, error),
})

const {
  collapsed,
  canCollapse,
  primarySchemas,
  extraSchemas,
  toggleCollapse,
  resetCollapse,
} = collapseStore

provideFormPlusContext(context)

/**
 * 是否存在需要校验的规则
 *
 * 规则可能在联动或 setSchema 时动态注入,因此以合并后的 schema 为准,
 * 否则「提交前先校验」会被跳过,把不合法的值直接 emits 出去。
 */
const hasRules = computed(
  () =>
    Boolean(props.rules && Object.keys(props.rules).length > 0) ||
    props.schemas.some((schema) => {
      const resolved = getSchema(schema.field)
      return Boolean(resolved?.required || resolved?.rules?.length)
    })
)

/** 操作区跟随最后一个可见字段分组,即折叠收起后回到主分组 */
const extraVisible = computed(
  () => extraSchemas.value.length > 0 && !collapsed.value
)

const formModel = computed(() => context.model)

/**
 * 查询模式默认使用 inline 布局
 *
 * inline 下 antd 会把 form-item 的 margin-bottom 归零,只保留横向间距,
 * 否则每个 form-item 都会多出 24px 底部边距。
 */
const formLayout = computed(() => {
  if (props.layout) return props.layout
  if (props.labelPlacement === 'top') return 'vertical'
  return props.mode === 'query' ? 'inline' : 'horizontal'
})

const labelCol = computed(() => {
  if (props.labelPlacement === 'top') return undefined
  if (props.labelCol) return props.labelCol
  if (props.labelWidth === 'auto') return { flex: 'auto' }
  return { style: { width: `${props.labelWidth}px` } }
})

const wrapperCol = computed(() => props.wrapperCol ?? { flex: '1' })

const showActions = computed(
  () => props.actions?.show ?? props.mode === 'query'
)

/**
 * 操作区按钮配置
 *
 * 未配置时按默认文案渲染,只有显式传 false 才隐藏;
 * 因此不能把「未配置」和 false 归一到同一个值,否则默认按钮会一起消失。
 */
const submitButton = computed<FormPlusActionButton | undefined>(() => {
  const config = props.actions?.submit
  if (config === false) return undefined
  return {
    text: config?.text ?? '查询',
    icon: config?.icon ?? 'i-lucide:search',
  }
})

const resetButton = computed<FormPlusActionButton | undefined>(() => {
  const config = props.actions?.reset
  if (config === false) return undefined
  return {
    text: config?.text ?? '重置',
    icon: config?.icon ?? 'i-lucide:rotate-ccw',
  }
})

const showCollapseButton = computed(
  () => canCollapse.value && props.actions?.collapse !== false
)

/** 折叠时按钮语义是「展开」,展开时是「收起」 */
const collapseButton = computed<FormPlusActionButton | undefined>(() =>
  collapsed.value
    ? { text: '展开', icon: 'i-lucide:chevron-down' }
    : { text: '收起', icon: 'i-lucide:chevron-up' }
)

/** 操作区绑定,包含默认按钮配置与事件,便于多处插入点复用 */
const actionsBinding = computed(() => ({
  submit: submitButton.value,
  reset: resetButton.value,
  collapse: showCollapseButton.value ? collapseButton.value : undefined,
  disabled: props.disabled,
  onSubmit: handleSubmit,
  onReset: handleReset,
  onToggleCollapse: () => toggleCollapse(),
}))

/**
 * 计算字段的栅格占位
 *
 * 列数支持按断点配置,详见 resolveGridSpan。
 *
 * @param schema 字段配置
 */
function resolveCol(schema: FormPlusSchema) {
  return resolveGridSpan(props.grid?.cols, schema.span)
}

/**
 * 取得字段自定义插槽渲染函数
 *
 * 插槽函数本身就是 `(slotProps) => unknown`,直接透传即可,
 * 再包一层箭头函数只会让每次渲染都产生新的函数身份。
 *
 * @param schema 字段配置
 */
function resolveFieldSlot(schema: FormPlusSchema) {
  return schema.slot ? slots[`field-${schema.slot}`] : undefined
}

async function handleSubmit() {
  try {
    if (hasRules.value) await context.validate()
  } catch (error) {
    emits('validate-fail', error)
    // 校验失败由 antd 就地提示,非校验异常也不阻断交互
    if (!isValidationError(error)) {
      console.error('[form-plus] 表单校验异常', error)
    }
    return
  }

  emits('submit', model.getFieldsValue())
}

function handleReset() {
  model.resetModel(props.schemas)
  context.clearValidate()
  if (props.collapse && props.collapse.resetOnReset !== false) {
    resetCollapse()
  }
  emits('reset')
}

onMounted(() => {
  initialize()
})

defineExpose<FormPlusInstance>({
  submit: handleSubmit,
  validate: (fields) => context.validate(fields),
  reset: handleReset,
  clearValidate: (fields) => context.clearValidate(fields),
  scrollToField: (field) => context.scrollToField(field),
  getFieldsValue: () => model.getFieldsValue(),
  getFieldValue: <T = unknown>(field: string) => model.getFieldValue<T>(field),
  setFieldsValue: (values) => model.setFieldsValue(values),
  setFieldValue: (field, value) => model.setFieldValue(field, value),
  getSchema: (field) => getSchema(field),
  setSchema: (field, patch) => context.setSchema(field, patch),
  show: (field) => context.show(field),
  hide: (field) => context.hide(field),
  setOptions: (field, options) => context.setOptions(field, options),
  reloadOptions: (field) => context.reloadOptions(field),
  toggleCollapse,
  // 用 getter 而不是 computed:暴露到实例上的 ref 会被 Vue 解包,声明成布尔值更贴近运行时
  get isCollapsed() {
    return collapsed.value
  },
  getOptionsState: (field) => context.getOptionsState(field),
  getFormRef: () => formRef.value ?? undefined,
})
</script>
