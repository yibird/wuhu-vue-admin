/**
 * 图表组件按需加载
 *
 * echarts/zrender 体积较大,仅在图表页首次渲染时加载,
 * 避免经 `@/components` barrel 被所有页面连带引入。
 */
export const Chart = defineAsyncComponent(() => import('./src/index.vue'))

// 只指向主题 hook 文件,避免经 hooks barrel 连带静态引入 useECharts 及其 echarts 依赖
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
