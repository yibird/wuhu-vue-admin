import { h } from 'vue'
import { defineRegistry } from '@json-render/vue'
import ChartBlock from '../components/main/chart-block.vue'
import { catalog } from './catalog'

const BORDER = 'b-1-regular'
const SURFACE = 'rounded-12 bg-container'

/**
 * 组件渲染注册表。
 * defineRegistry 需要 catalog 声明的全部动作占位,真实逻辑由 GeneratedView 注入的 handlers 承担。
 */
export const { registry } = defineRegistry(catalog, {
  components: {
    Card: ({ props, children }) =>
      h('section', { class: `${SURFACE} ${BORDER} p-14` }, [
        props.title || props.subtitle
          ? h('header', { class: 'mb-10' }, [
              props.title
                ? h('div', { class: 'text-sm text-main font-600' }, props.title)
                : undefined,
              props.subtitle
                ? h(
                    'div',
                    { class: 'mt-2 text-xs text-secondary' },
                    props.subtitle
                  )
                : undefined,
            ])
          : undefined,
        children,
      ]),

    Grid: ({ props, children }) =>
      h(
        'div',
        {
          class: 'grid',
          style: {
            // zod 的 default 不会在 catalog 校验时落到 props 上,这里必须兜底
            gridTemplateColumns: `repeat(${props.columns ?? 2}, minmax(0, 1fr))`,
            gap: `${props.gap ?? 12}px`,
          },
        },
        children
      ),

    Heading: ({ props }) => {
      const level = props.level ?? 2
      const sizes: Record<number, string> = {
        1: 'text-xl font-700',
        2: 'text-lg font-600',
        3: 'text-16px font-600',
        4: 'text-sm font-600',
      }

      return h(
        `h${level}`,
        { class: `m-0 text-main ${sizes[level] ?? sizes[4]}` },
        props.text
      )
    },

    Text: ({ props }) =>
      h('p', { class: 'm-0 text-sm text-regular leading-22px' }, props.content),

    Stat: ({ props }) =>
      h('div', { class: `${SURFACE} ${BORDER} p-12` }, [
        h('div', { class: 'text-xs text-secondary' }, props.label),
        h('div', { class: 'mt-6 text-20px text-main font-[650]' }, props.value),
        props.trend
          ? h('div', { class: 'mt-4 text-xs text-secondary' }, props.trend)
          : undefined,
      ]),

    Table: ({ props }) =>
      h('div', { class: `${SURFACE} ${BORDER} overflow-auto` }, [
        h('table', { class: 'w-full border-collapse text-sm' }, [
          h(
            'thead',
            null,
            h(
              'tr',
              { class: 'border-0 b-b-1-regular' },
              props.columns.map((column) =>
                h(
                  'th',
                  {
                    key: column,
                    class:
                      'px-12 py-8 text-left text-xs text-secondary font-600',
                  },
                  column
                )
              )
            )
          ),
          h(
            'tbody',
            null,
            props.rows.map((row, rowIndex) =>
              h(
                'tr',
                {
                  key: rowIndex,
                  class: 'border-0 b-b-1-muted',
                },
                row.map((cell, cellIndex) =>
                  h(
                    'td',
                    { key: cellIndex, class: 'px-12 py-8 text-main' },
                    String(cell)
                  )
                )
              )
            )
          ),
        ]),
      ]),

    Chart: ({ props }) =>
      h(ChartBlock, {
        type: props.type,
        rows: props.rows,
        title: props.title,
        height: props.height,
      }),

    Button: ({ props, emit }) =>
      h(
        'button',
        {
          type: 'button',
          class:
            'h-32 inline-flex items-center justify-center rounded-8 b-1-regular bg-container px-12 text-13px text-main cursor-pointer transition-colors hover:(bg-hover border-primary)',
          onClick: () => emit('press'),
        },
        props.label
      ),
  },
  actions: {
    // 占位实现,真实处理逻辑在 GeneratedView 通过 ActionProvider 注入
    ask: async () => undefined,
  },
})
