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
