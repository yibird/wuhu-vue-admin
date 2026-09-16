export { usePermission } from './usePermission'
export {
  clearDictCache,
  getDictCache,
  getDictError,
  getDictItem,
  getDictLabel,
  getDictOptions,
  hasDictCache,
  refreshDict,
  refreshDicts,
  setDictCache,
  setDictCacheScope,
  setDictFetcher,
  useDict,
  useDicts,
} from './useDict'
export type {
  DictFetcher,
  DictItem,
  DictNormalizeOptions,
  DictRawItem,
  DictValue,
  UseDictOptions,
} from './useDict'
export { useTabs } from './useTabs'
export { useAuth } from './useAuth'
export { usePageEnter } from './usePageEnter'
export { useTheme } from './useTheme'
export * from './useDeferred'
export { useLoading } from './useLoading'
export * from './useRangeSelection'
export {
  getCssRgbVar,
  getCssRgbVarAlpha,
  useEChartsTheme,
} from './useEChartsTheme'
export type {
  BaseEChartsOption,
  BaseEChartsTooltipOption,
  EChartsPaletteKey,
} from './useEChartsTheme'
