<script setup lang="ts">
import FormItem from './form-item.vue'
import type { ColProps, FormProps, Rule } from 'antdv-next'
import type { Component } from 'vue'
import type {
  FormPlusContext,
  FormPlusFieldSlotProps,
  FormPlusSchema,
} from '../types'

const props = defineProps<{
  /**
   * @desc 本行渲染的字段配置
   */
  schemas: readonly FormPlusSchema[]
  /**
   * @desc 表单上下文
   */
  context: FormPlusContext
  /**
   * @desc 栅格占位解析,返回 span 或各断点的 span
   */
  colOf?: (schema: FormPlusSchema) => ColProps
  /**
   * @desc 控件尺寸
   */
  size?: FormProps['size']
  /**
   * @desc 表单级校验规则
   */
  rules?: Record<string, Rule[]>
  /**
   * @desc 局部控件注册表
   */
  localComponents?: Record<string, Component>
  /**
   * @desc 字段插槽渲染函数解析,返回 undefined 表示走默认控件
   */
  slotOf: (
    schema: FormPlusSchema
  ) => ((slotProps: FormPlusFieldSlotProps) => unknown) | undefined
}>()

/**
 * 汇总单个字段透传给 FormItem 的属性
 *
 * 字段值/禁用态不在这里读取:FormItem 自己从 context 取,
 * 这样输入时只有变化的那个 FormItem 重渲染,而不是整行。
 *
 * @param schema 字段配置
 */
function fieldProps(schema: FormPlusSchema) {
  return {
    schema,
    context: props.context,
    size: props.size,
    rules: props.rules?.[schema.field],
    localComponents: props.localComponents,
    fieldSlot: props.slotOf(schema),
  }
}
</script>

<template>
  <a-col v-for="schema in schemas" :key="schema.field" v-bind="colOf?.(schema)">
    <FormItem v-bind="fieldProps(schema)" />
  </a-col>
</template>
