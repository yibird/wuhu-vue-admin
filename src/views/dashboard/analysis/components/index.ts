export { default as Overview } from './overview/index.vue'

export const Statistics = defineAsyncComponent(
  () => import('./statistics/index.vue')
)
export const VisitStatistics = defineAsyncComponent(
  () => import('./visit-statistics/index.vue')
)
export const ConversionFunnel = defineAsyncComponent(
  () => import('./conversion-funnel/index.vue')
)
export const HotSearch = defineAsyncComponent(
  () => import('./hot-search/index.vue')
)
export const HotItems = defineAsyncComponent(
  () => import('./hot-items/index.vue')
)
export const GoalProgress = defineAsyncComponent(
  () => import('./goal-progress/index.vue')
)
export const TrafficSource = defineAsyncComponent(
  () => import('./traffic-source/index.vue')
)
export const SalesRanking = defineAsyncComponent(
  () => import('./sales-ranking/index.vue')
)
export const RiskAlerts = defineAsyncComponent(
  () => import('./risk-alerts/index.vue')
)

/**
 * 骨架屏与各自模块同目录维护，作为占位/兜底同步引入，
 * 避免占位内容再走一次异步加载
 */
export { default as StatisticsSkeleton } from './statistics/skeleton.vue'
export { default as VisitStatisticsSkeleton } from './visit-statistics/skeleton.vue'
export { default as ConversionFunnelSkeleton } from './conversion-funnel/skeleton.vue'
export { default as HotSearchSkeleton } from './hot-search/skeleton.vue'
export { default as HotItemsSkeleton } from './hot-items/skeleton.vue'
export { default as GoalProgressSkeleton } from './goal-progress/skeleton.vue'
export { default as TrafficSourceSkeleton } from './traffic-source/skeleton.vue'
export { default as SalesRankingSkeleton } from './sales-ranking/skeleton.vue'
export { default as RiskAlertsSkeleton } from './risk-alerts/skeleton.vue'
