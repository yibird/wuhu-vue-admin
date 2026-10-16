import { computed, inject, provide, shallowReactive, watch } from 'vue'
import { useFormCollapse } from './useFormCollapse'
import { useFormLinkage } from './useFormLinkage'
import { useFormModel } from './useFormModel'
import { useFormOptions } from './useFormOptions'
import type {
  FormPlusCollapse,
  FormPlusContext,
  FormPlusModel,
  FormPlusOption,
  FormPlusSchema,
  FormPlusSchemaBase,
  FormPlusValue,
} from '../types'
import type { FormInstance } from 'antdv-next'
import type { InjectionKey, ShallowRef } from 'vue'

export const FORM_PLUS_CONTEXT_KEY: InjectionKey<FormPlusContext> =
  Symbol('form-plus-context')

interface UseFormContextOptions {
  /**
   * @desc 受控模型
   */
  controlledModel: () => FormPlusModel | undefined
  /**
   * @desc 表单项配置(原始 schema)
   */
  schemas: () => readonly FormPlusSchema[]
  /**
   * @desc antdv 表单实例(未挂载时为 null)
   */
  formRef: ShallowRef<FormInstance | null | undefined>
  /**
   * @desc 折叠配置
   */
  collapse: () => FormPlusCollapse | false | undefined
  /**
   * @desc 字段值变化回调(用于对外 emit)
   */
  onFieldChange?: (
    field: string,
    value: FormPlusValue,
    values: FormPlusModel
  ) => void
  /**
   * @desc 受控模型同步回调
   */
  onControlledUpdate?: (values: FormPlusModel) => void
  /**
   * @desc 折叠状态变化回调
   */
  onCollapseChange?: (collapsed: boolean) => void
  /**
   * @desc 选项加载失败回调
   */
  onOptionsError?: (field: string, error: unknown) => void
}

/**
 * 组装表单运行时上下文
 *
 * 模型、选项、联动、折叠各自独立成 hook,这里负责把它们串成 FormPlusContext,
 * 并通过依赖倒置(getContext 传 thunk)打破「上下文依赖 hook、hook 又依赖上下文」的循环。
 */
export function useFormContext(options: UseFormContextOptions) {
  /**
   * 字段级动态配置覆盖(显隐、禁用、属性、规则等)
   *
   * 用 shallowReactive 的 Map:每次 setSchema 都整体替换覆盖对象,
   * 因此只需 Map 层的响应式,避免深层代理带来的开销。
   */
  const patchMap = shallowReactive(
    new Map<string, Partial<FormPlusSchemaBase>>()
  )

  const baseMap = computed(
    () => new Map(options.schemas().map((schema) => [schema.field, schema]))
  )

  const model = useFormModel({
    controlledModel: options.controlledModel,
    onFieldChange: (field, value, values) => {
      options.onFieldChange?.(field, value, values)
      linkage.dispatch(field)
    },
    onControlledUpdate: options.onControlledUpdate,
  })

  const optionsStore = useFormOptions({
    schemas: options.schemas,
    getContext: () => context,
    isVisible,
    onError: options.onOptionsError,
  })

  const linkage = useFormLinkage({
    schemas: options.schemas,
    getContext: () => context,
  })

  const collapseStore = useFormCollapse({
    schemas: options.schemas,
    collapse: options.collapse,
    isVisible,
    onCollapseChange: options.onCollapseChange,
  })

  function getSchema(field: string): FormPlusSchema | undefined {
    const base = baseMap.value.get(field)
    if (!base) return undefined

    const patch = patchMap.get(field)
    if (!patch) return base

    return { ...base, ...patch } as FormPlusSchema
  }

  function setSchema(field: string, patch: Partial<FormPlusSchemaBase>) {
    patchMap.set(field, { ...patchMap.get(field), ...patch })
  }

  function isVisible(field: string) {
    const patch = patchMap.get(field)
    if (patch?.visible !== undefined) return patch.visible
    return baseMap.value.get(field)?.visible ?? true
  }

  function isDisabled(field: string) {
    const patch = patchMap.get(field)
    if (patch?.disabled !== undefined) return Boolean(toValue(patch.disabled))
    return Boolean(toValue(baseMap.value.get(field)?.disabled))
  }

  function setVisible(field: string, visible: boolean) {
    setSchema(field, { visible })
  }

  function setDisabled(field: string, disabled: boolean) {
    setSchema(field, { disabled })
  }

  function setOptionList(field: string, list: FormPlusOption[]) {
    optionsStore.setOptions(field, list)
  }

  async function validate(fields?: string[]) {
    await options.formRef.value?.validate(fields)
  }

  function clearValidate(fields?: string | string[]) {
    if (fields === undefined) {
      options.formRef.value?.clearValidate()
      return
    }

    options.formRef.value?.clearValidate(
      Array.isArray(fields) ? [...fields] : [fields]
    )
  }

  function scrollToField(field: string) {
    options.formRef.value?.scrollToField(field)
  }

  const context: FormPlusContext = {
    get model() {
      return model.getModel()
    },
    getValues: () => model.getFieldsValue(),
    getValue: <T = FormPlusValue>(field: string) =>
      model.getFieldValue<T>(field),
    setValue: (field, value) => model.setFieldValue(field, value),
    setValues: (values) => model.setFieldsValue(values),
    getSchema,
    setSchema,
    isVisible,
    show: (field) => setVisible(field, true),
    hide: (field) => setVisible(field, false),
    setVisible,
    isDisabled,
    setDisabled,
    getOptionsState: (field) => optionsStore.getState(field),
    setOptions: setOptionList,
    reloadOptions: (field) => optionsStore.reload(field),
    validate,
    clearValidate,
    scrollToField,
    get collapsed() {
      return collapseStore.collapsed
    },
    toggleCollapse: (value) => collapseStore.toggleCollapse(value),
    get formRef() {
      return options.formRef
    },
  }

  /**
   * 首屏初始化:播种默认值 -> 批量加载选项 -> 执行全部联动
   */
  async function initialize() {
    model.seedDefaults(options.schemas())
    await optionsStore.loadEager()
    linkage.runAll()
  }

  watch(
    () => options.schemas(),
    (schemas) => {
      model.seedDefaults(schemas)
      void optionsStore.loadEager()
    }
  )

  return {
    context,
    getSchema,
    setSchema,
    isVisible,
    isDisabled,
    setVisible,
    setDisabled,
    validate,
    clearValidate,
    scrollToField,
    model,
    collapse: collapseStore,
    initialize,
  }
}

/**
 * 注册上下文(组件内部使用)
 *
 * @param context 表单上下文
 */
export function provideFormPlusContext(context: FormPlusContext) {
  provide(FORM_PLUS_CONTEXT_KEY, context)
}

/**
 * 读取当前表单上下文,供自定义控件或字段插槽使用
 */
export function useFormPlusContext() {
  const context = inject(FORM_PLUS_CONTEXT_KEY, undefined)
  if (!context) {
    throw new Error('[form-plus] 未找到表单上下文,请在 FormPlus 内部使用')
  }
  return context
}
