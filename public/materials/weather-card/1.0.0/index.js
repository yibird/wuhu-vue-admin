/**
 * 示例远程物料 Bundle（global 格式）
 *
 * 约定：
 * 1. 运行时通过 window.__WUHU_LOW_CODE__.vue 提供最小 Vue API
 * 2. Bundle 调用 window.__WUHU_LOW_CODE__.register(type, component) 注册实现
 * 3. 组件的属性/事件定义由物料注册信息（ComponentDefinition）提供，
 *    Bundle 只负责实现，不参与 Schema 描述
 */
;(function () {
  const bridge = window.__WUHU_LOW_CODE__
  if (!bridge) {
    console.warn('[material] runtime bridge not found')
    return
  }
  const { defineComponent, h, ref, computed } = bridge.vue

  const WeatherCard = defineComponent({
    name: 'WeatherCard',
    inheritAttrs: false,
    props: {
      city: { type: String, default: '上海' },
      temperature: { type: Number, default: 26 },
      condition: { type: String, default: '晴' },
      humidity: { type: Number, default: 58 },
      loading: { type: Boolean, default: false },
    },
    emits: ['refresh'],
    setup(props, { emit, attrs }) {
      const updatedAt = ref(new Date().toLocaleTimeString())
      const degree = computed(() => `${props.temperature}°`)

      return () =>
        h(
          'div',
          {
            ...attrs,
            style: {
              padding: '16px',
              borderRadius: '12px',
              color: '#fff',
              background:
                'linear-gradient(135deg, rgb(22 119 255), rgb(64 150 255))',
              boxShadow: '0 12px 30px rgb(22 119 255 / 25%)',
              fontFamily: 'Inter, "PingFang SC", sans-serif',
            },
          },
          [
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              },
              [
                h('div', { style: { fontSize: '13px', opacity: 0.85 } }, [
                  props.city,
                ]),
                h(
                  'button',
                  {
                    type: 'button',
                    onClick: () => {
                      updatedAt.value = new Date().toLocaleTimeString()
                      emit('refresh')
                    },
                    style: {
                      padding: '2px 8px',
                      fontSize: '11px',
                      color: '#fff',
                      cursor: 'pointer',
                      background: 'rgb(255 255 255 / 18%)',
                      border: '1px solid rgb(255 255 255 / 35%)',
                      borderRadius: '999px',
                    },
                  },
                  '刷新'
                ),
              ]
            ),
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                  margin: '10px 0 4px',
                },
              },
              [
                h(
                  'span',
                  { style: { fontSize: '34px', fontWeight: 700 } },
                  degree.value
                ),
                h(
                  'span',
                  { style: { fontSize: '14px', opacity: 0.9 } },
                  props.condition
                ),
              ]
            ),
            h('div', { style: { fontSize: '12px', opacity: 0.85 } }, [
              `湿度 ${props.humidity}% · 更新于 ${updatedAt.value}`,
            ]),
          ]
        )
    },
  })

  bridge.register('WeatherCard', WeatherCard)
})()
