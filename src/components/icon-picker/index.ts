export type { IconPickerProps, IconSelectorProps } from './src/types'

export const IconPicker = defineAsyncComponent(
  () => import('./src/icon-picker.vue')
)
export const IconSelector = defineAsyncComponent(
  () => import('./src/icon-selector.vue')
)
/**
 * 动态图标渲染器
 *
 * 图标名是运行时选择的(例如取用户选中的图标做预览)时用它,不要用 Icon:
 * Icon 走 UnoCSS 的 i-lucide:* 类,只有构建期在源码里出现过字面量的图标才有样式;
 * 这里改用 @iconify-json/lucide 的内联 SVG 精灵,任意图标都能渲染,非 lucide 名回退到 Icon。
 */
export const IconPreview = defineAsyncComponent(
  () => import('./src/components/preview.vue')
)
