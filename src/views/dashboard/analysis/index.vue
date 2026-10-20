<template>
  <WView :full="false" class="overflow-hidden">
    <div class="page-view flex flex-col gap-12">
      <Overview :items="cards" />

      <DeferredSection
        :section="Statistics"
        :skeleton="StatisticsSkeleton"
        root-margin="0px 0px 128px"
      />
      <DeferredSection
        :section="GoalProgress"
        :skeleton="GoalProgressSkeleton"
      />

      <div
        class="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]"
      >
        <main class="min-w-0 flex flex-col gap-12">
          <DeferredSection
            :section="VisitStatistics"
            :skeleton="VisitStatisticsSkeleton"
          />
          <DeferredSection
            :section="ConversionFunnel"
            :skeleton="ConversionFunnelSkeleton"
            root-margin="0px 0px 128px"
          />
          <DeferredSection
            :section="RiskAlerts"
            :skeleton="RiskAlertsSkeleton"
          />
        </main>
        <aside class="min-w-0 flex flex-col gap-12">
          <DeferredSection :section="HotSearch" :skeleton="HotSearchSkeleton" />
          <DeferredSection
            :section="HotItems"
            :skeleton="HotItemsSkeleton"
            root-margin="0px 0px 128px"
          />
          <DeferredSection
            :section="TrafficSource"
            :skeleton="TrafficSourceSkeleton"
          />
          <DeferredSection
            :section="SalesRanking"
            :skeleton="SalesRankingSkeleton"
            root-margin="0px 0px 128px"
          />
        </aside>
      </div>
    </div>
  </WView>
</template>

<script lang="ts" setup>
import {
  Overview,
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
import DeferredSection from './components/deferred-section.vue'
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
