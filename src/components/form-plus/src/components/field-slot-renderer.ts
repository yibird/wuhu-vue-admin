import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { FormPlusFieldSlotProps } from '../types'

/**
 * 字段插槽渲染器
 *
 * 调用方通过 `#field-<slot>` 传进来的是一个作用域插槽函数,而模板中只能渲染组件,
 * 因此把它包成一个函数式组件做转接。
 *
 * 定义在模块作用域而非组件内,避免每个 FormItem 实例都新建一份组件定义。
 */
export const FieldSlotRenderer = defineComponent({
  props: {
    render: {
      type: Function as PropType<
        (slotProps: FormPlusFieldSlotProps) => unknown
      >,
      required: true,
    },
    slotProps: {
      type: Object as PropType<FormPlusFieldSlotProps>,
      required: true,
    },
  },
  setup: (props) => () => props.render(props.slotProps),
})
