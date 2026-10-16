import { computed, ref, shallowRef, toValue } from 'vue'
import type {
  FormPlusInstance,
  FormPlusModel,
  FormPlusProps,
  FormPlusSchema,
  FormPlusValue,
} from './types'

/**
 * 可直接 v-bind 到 FormPlus 的属性集合
 */
type FormPlusBindings = FormPlusProps & {
  'onUpdate:model': (values: FormPlusModel) => void
  onSubmit: (values: FormPlusModel) => void
  onReset: () => void
}

export interface UseFormOptions {
  /**
   * @desc 表单项配置
   */
  schemas: MaybeRefOrGetter<readonly FormPlusSchema[]>
  /**
   * @desc 表单模式,默认 edit
   * @default 'edit'
   */
  mode?: FormPlusProps['mode']
  /**
   * @desc 表单级校验规则
   */
  rules?: FormPlusProps['rules']
  /**
   * @desc 初始值,reset 时也会恢复到这里
   */
  initialValues?: FormPlusModel
  /**
   * @desc 栅格配置
   */
  grid?: FormPlusProps['grid']
  /**
   * @desc 折叠配置
   */
  collapse?: FormPlusProps['collapse']
  /**
   * @desc 操作区配置
   */
  actions?: FormPlusProps['actions']
  /**
   * @desc 标签位置
   */
  labelPlacement?: FormPlusProps['labelPlacement']
  /**
   * @desc 标签宽度
   */
  labelWidth?: FormPlusProps['labelWidth']
  /**
   * @desc 校验通过后的提交回调
   */
  onFinish?: (values: FormPlusModel) => void | Promise<void>
  /**
   * @desc 重置回调
   */
  onReset?: () => void
}

/**
 * 表单组合式 API
 *
 * 注意:与 antdv-next 自带导出的 `useForm` 同名,使用时请从 `@/components/form-plus` 导入。
 *
 * ```ts
 * const { formProps, formRef, validate, reset, submitting } = useForm({
 *   schemas,
 *   initialValues: () => createDefaultForm(),
 *   onFinish: save,
 * })
 * ```
 * ```vue
 * <FormPlus ref="formRef" v-bind="formProps" />
 * ```
 */
export function useForm(options: UseFormOptions) {
  const formRef = shallowRef<FormPlusInstance>()
  const model = ref<FormPlusModel>({ ...options.initialValues })
  const submitting = ref(false)

  // 实例成员经 defineExpose 的 proxyRefs 解包,拿到的是布尔值而不是 ref
  const isCollapsed = computed(() => formRef.value?.isCollapsed ?? false)

  async function handleFinish(values: FormPlusModel) {
    if (!options.onFinish) return

    submitting.value = true
    try {
      await options.onFinish(values)
    } finally {
      submitting.value = false
    }
  }

  function handleReset() {
    model.value = { ...options.initialValues }
    formRef.value?.clearValidate()
    options.onReset?.()
  }

  /**
   * 可直接展开到 FormPlus 上的响应式 props
   */
  const formProps = computed<FormPlusBindings>(() => ({
    schemas: toValue(options.schemas),
    model: model.value,
    'onUpdate:model': (values: FormPlusModel) => {
      model.value = values
    },
    mode: options.mode ?? 'edit',
    rules: options.rules,
    grid: options.grid,
    collapse: options.collapse,
    actions: options.actions,
    labelPlacement: options.labelPlacement,
    labelWidth: options.labelWidth,
    onSubmit: (values: FormPlusModel) => {
      void handleFinish(values)
    },
    onReset: handleReset,
  }))

  return {
    formProps,
    formRef,
    model,
    submitting,
    isCollapsed,
    submit: () => formRef.value?.submit(),
    validate: (fields?: string[]) => formRef.value?.validate(fields),
    reset: handleReset,
    clearValidate: (fields?: string | string[]) =>
      formRef.value?.clearValidate(fields),
    getFieldsValue: () => formRef.value?.getFieldsValue() ?? { ...model.value },
    getFieldValue: <T = FormPlusValue>(field: string) =>
      formRef.value?.getFieldValue<T>(field),
    // 写入统一交给 FormPlus 实例,保证联动派发与 change 事件一致
    setFieldsValue: (values: FormPlusModel) =>
      formRef.value?.setFieldsValue(values),
    setFieldValue: (field: string, value: FormPlusValue) =>
      formRef.value?.setFieldValue(field, value),
    reloadOptions: (field?: string) => formRef.value?.reloadOptions(field),
    getOptionsState: (field: string) => formRef.value?.getOptionsState(field),
    toggleCollapse: (value?: boolean) => formRef.value?.toggleCollapse(value),
  }
}
