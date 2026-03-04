import {
  VChart,
  registerBarChart,
  registerLiquidChart,
  registerAreaChart,
  registerTooltip,
  registerCartesianCrossHair,
  registerDomTooltipHandler,
  registerAreaSeries,
  registerLineMark, // 新增线条标记注册
  registerSymbolMark, // 可选：如果需要数据点
  registerLabel,
  registerTotalLabel,
  registerCommonChart,
  registerBarSeries,
  registerLineSeries,
} from '@visactor/vchart';

export function vChartPlugin() {
  // VChart.useRegisters([
  //   registerBarChart,
  //   registerLiquidChart,
  //   registerAreaChart,
  //   registerTooltip,
  //   registerDomTooltipHandler,
  //   registerCartesianCrossHair,
  //   registerAreaSeries,
  //   registerLineMark,
  //   registerSymbolMark,
  //   registerLabel,
  //   registerTotalLabel,
  //   registerCommonChart,
  //   registerBarSeries,
  //   registerLineSeries
  // ])
}
