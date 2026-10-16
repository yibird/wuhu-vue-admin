<template>
  <WView :full="false" class="overflow-hidden">
    <div class="page-view flex flex-col gap-12">
      <Overview :items="cards" />
      <LazyContainer root-margin="0px 0px 128px">
        <template #placeholder>
          <StatisticsSkeleton />
        </template>
        <Suspense>
          <Statistics />
          <template #fallback>
            <StatisticsSkeleton />
          </template>
        </Suspense>
      </LazyContainer>

      <LazyContainer root-margin="0px 0px 96px">
        <template #placeholder>
          <GoalProgressSkeleton />
        </template>
        <Suspense>
          <GoalProgress />
          <template #fallback>
            <GoalProgressSkeleton />
          </template>
        </Suspense>
      </LazyContainer>

      <div
        class="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]"
      >
        <main class="min-w-0 flex flex-col gap-12">
          <LazyContainer root-margin="0px 0px 96px">
            <template #placeholder>
              <VisitStatisticsSkeleton />
            </template>
            <Suspense>
              <VisitStatistics />
              <template #fallback>
                <VisitStatisticsSkeleton />
              </template>
            </Suspense>
          </LazyContainer>
          <LazyContainer root-margin="0px 0px 128px">
            <template #placeholder>
              <ConversionFunnelSkeleton />
            </template>
            <Suspense>
              <ConversionFunnel />
              <template #fallback>
                <ConversionFunnelSkeleton />
              </template>
            </Suspense>
          </LazyContainer>
          <LazyContainer root-margin="0px 0px 96px">
            <template #placeholder>
              <RiskAlertsSkeleton />
            </template>
            <Suspense>
              <RiskAlerts />
              <template #fallback>
                <RiskAlertsSkeleton />
              </template>
            </Suspense>
          </LazyContainer>
        </main>
        <aside class="min-w-0 flex flex-col gap-12">
          <LazyContainer root-margin="0px 0px 96px">
            <template #placeholder>
              <HotSearchSkeleton />
            </template>
            <Suspense>
              <HotSearch />
              <template #fallback>
                <HotSearchSkeleton />
              </template>
            </Suspense>
          </LazyContainer>
          <LazyContainer root-margin="0px 0px 128px">
            <template #placeholder>
              <HotItemsSkeleton />
            </template>
            <Suspense>
              <HotItems />
              <template #fallback>
                <HotItemsSkeleton />
              </template>
            </Suspense>
          </LazyContainer>
          <LazyContainer root-margin="0px 0px 96px">
            <template #placeholder>
              <TrafficSourceSkeleton />
            </template>
            <Suspense>
              <TrafficSource />
              <template #fallback>
                <TrafficSourceSkeleton />
              </template>
            </Suspense>
          </LazyContainer>
          <LazyContainer root-margin="0px 0px 128px">
            <template #placeholder>
              <SalesRankingSkeleton />
            </template>
            <Suspense>
              <SalesRanking />
              <template #fallback>
                <SalesRankingSkeleton />
              </template>
            </Suspense>
          </LazyContainer>
        </aside>
      </div>
    </div>
  </WView>
</template>

<script lang="ts" setup>
import { LazyContainer } from '@/components'
import Overview from './components/overview/index.vue'
import {
  Statistics,
  StatisticsSkeleton,
  GoalProgress,
  GoalProgressSkeleton,
  VisitStatistics,
  VisitStatisticsSkeleton,
  ConversionFunnel,
  ConversionFunnelSkeleton,
  RiskAlerts,
  RiskAlertsSkeleton,
  HotSearch,
  HotSearchSkeleton,
  HotItems,
  HotItemsSkeleton,
  TrafficSource,
  TrafficSourceSkeleton,
  SalesRanking,
  SalesRankingSkeleton,
} from './components'
import { cards } from './config'
</script>

<style lang="less" scoped>
.page-view {
  background-image:
    radial-gradient(
      1100px 520px at -10% -8%,
      rgb(var(--w-color-primary) / 12%),
      transparent 70%
    ),
    radial-gradient(
      900px 460px at 108% -6%,
      rgb(var(--w-color-primary) / 9%),
      transparent 72%
    );
  background-repeat: no-repeat;
}
</style>
