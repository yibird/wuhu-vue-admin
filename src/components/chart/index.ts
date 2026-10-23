export const Chart = defineAsyncComponent(() => import('./src/index.vue'))
export { getCssRgbVar, getCssRgbVarAlpha, useEChartsTheme } from './src/hooks'
export type {
  BaseEChartsOption,
  BaseEChartsTooltipOption,
  EChartsPaletteKey,
} from './src/hooks'
