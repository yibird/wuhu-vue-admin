import { reactive } from 'vue'
import type { FormPlusModel, FormPlusSchema, FormPlusValue } from '../types'

interface UseFormModelOptions {
  /**
   * @desc 受控模型,由父级通过 v-model:model 传入;不传则使用内部模型
   */
  controlledModel: () => FormPlusModel | undefined
  /**
   * @desc 字段写入后的回调,用于派发联动与 change 事件
   */
  onFieldChange?: (
    field: string,
    value: FormPlusValue,
    values: FormPlusModel
  ) => void
  /**
   * @desc 受控模式下把最新值同步给父级
   */
  onControlledUpdate?: (values: FormPlusModel) => void
}

/**
 * 表单模型管理
 *
 * - 受控优先:父级传入 model 时直接读写该对象,并同步 emit;未传入时使用内部 reactive 模型
 * - defaultValue 只在字段不存在时播种,避免列表变化时覆盖用户已填的值
 */
export function useFormModel(options: UseFormModelOptions) {
  const innerModel = reactive<FormPlusModel>({})

  /**
   * 批量写入深度:大于 0 时由最外层统一同步一次受控模型
   */
  let batchDepth = 0

  const isControlled = () => options.controlledModel() !== undefined

  function getModel(): FormPlusModel {
    return options.controlledModel() ?? innerModel
  }

  function getFieldValue<T = FormPlusValue>(field: string): T {
    return getModel()[field] as T
  }

  function getFieldsValue(): FormPlusModel {
    return { ...getModel() }
  }

  /**
   * 批量写入字段值
   *
   * 受控模式下的 update:model 只在批次结束时同步一次,避免 N 个字段触发 N 次父级更新。
   *
   * @param values 字段值集合
   */
  function batchWrite(values: Iterable<[string, FormPlusValue]>) {
    batchDepth += 1
    try {
      for (const [field, value] of values) {
        setFieldValue(field, value)
      }
    } finally {
      batchDepth -= 1
    }

    if (batchDepth === 0 && isControlled()) {
      options.onControlledUpdate?.({ ...getModel() })
    }
  }

  function setFieldValue(field: string, value: FormPlusValue) {
    const model = getModel()
    if (model[field] === value) return

    model[field] = value
    options.onFieldChange?.(field, value, model)
    if (batchDepth === 0 && isControlled()) {
      options.onControlledUpdate?.({ ...model })
    }
  }

  function setFieldsValue(values: FormPlusModel) {
    batchWrite(Object.entries(values))
  }

  /**
   * 为缺失字段播种默认值
   *
   * @param schemas 表单项配置
   */
  function seedDefaults(schemas: readonly FormPlusSchema[]) {
    const model = getModel()
    for (const schema of schemas) {
      if (schema.field in model) continue
      model[schema.field] = schema.defaultValue
    }
  }

  /**
   * 重置模型:仅把 schema 覆盖到的字段恢复为默认值
   *
   * @param schemas 表单项配置
   */
  function resetModel(schemas: readonly FormPlusSchema[]) {
    batchWrite(
      schemas.map((schema): [string, FormPlusValue] => [
        schema.field,
        schema.defaultValue,
      ])
    )
  }

  return {
    getModel,
    isControlled,
    getFieldValue,
    getFieldsValue,
    setFieldValue,
    setFieldsValue,
    seedDefaults,
    resetModel,
  }
}
