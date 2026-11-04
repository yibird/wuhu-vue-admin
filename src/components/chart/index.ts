export const BasicChart = defineAsyncComponent(() => import('./src/basic.vue'))
export const Chart = defineAsyncComponent(() => import('./src/index.vue'))
export {
  getCssRgbVar,
  getCssRgbVarAlpha,
  useEChartsTheme,
} from './src/hooks/useEChartsTheme'
export type {
  BaseEChartsOption,
  BaseEChartsTooltipOption,
  EChartsPaletteKey,
} from './src/hooks/useEChartsTheme'
