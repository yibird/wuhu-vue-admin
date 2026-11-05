<template>
  <View :full="false" class="p-10 overflow-hidden">
    <div class="page-view flex flex-col gap-12">
      <Skeleton name="analysis-overview" :loading="loading">
        <Overview :items="cards" />
      </Skeleton>
      <Statistics :loading="loading" />
      <GoalProgress :loading="loading" />
      <div
        class="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]"
      >
        <main class="min-w-0 flex flex-col gap-12">
          <VisitStatistics :loading="loading" />
          <ConversionFunnel :loading="loading" />
          <RiskAlerts :loading="loading" />
        </main>
        <aside class="min-w-0 flex flex-col gap-12">
          <HotSearch :loading="loading" />
          <HotItems :loading="loading" />
          <TrafficSource :loading="loading" />
          <SalesRanking :loading="loading" />
        </aside>
      </div>
    </div>
  </View>
</template>

<script lang="ts" setup>
import Skeleton from 'boneyard-js/vue'
import { useLoading } from '@/hooks'
import {
  Overview,
  Statistics,
  GoalProgress,
  VisitStatistics,
  ConversionFunnel,
  RiskAlerts,
  HotSearch,
  HotItems,
  TrafficSource,
  SalesRanking,
} from './components'
import { cards } from './config'

const { loading } = useLoading()
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
