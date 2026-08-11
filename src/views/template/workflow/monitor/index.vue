<script setup lang="ts">
import { useLoading } from '@/composables'
import { workflowLatencyRanks, workflowThroughput } from '../management/data'
import ExecutionDetailDrawer from './components/ExecutionDetailDrawer.vue'
import ExecutionTable from './components/ExecutionTable.vue'
import Header from './components/Header.vue'
import Insights from './components/Insights.vue'
import Overview from './components/Overview.vue'
import { useWorkflowMonitor } from './composables/useWorkflowMonitor'

const { isLoading } = useLoading({ delay: 260 })
const {
  alerts,
  autoRefresh,
  detailOpen,
  environmentFilter,
  failureCount,
  filteredInstances,
  keyword,
  lastRefreshAt,
  refreshing,
  runningCount,
  selectedInstance,
  statusFilter,
  successRate,
  timeRange,
  unresolvedAlerts,
  workflowFilter,
  workflowOptions,
  acknowledgeAlert,
  openInstance,
  refresh,
  retryInstance,
  terminateInstance,
} = useWorkflowMonitor()
</script>

<template>
  <WView :full="true" :padding="0">
    <Scrollbar class="h-full bg-page">
      <Header
        v-model:auto-refresh="autoRefresh"
        v-model:environment="environmentFilter"
        v-model:keyword="keyword"
        v-model:range="timeRange"
        v-model:status="statusFilter"
        v-model:workflow="workflowFilter"
        :alert-count="unresolvedAlerts.length"
        :last-refresh-at="lastRefreshAt"
        :refreshing="refreshing"
        :workflow-options="workflowOptions"
        @refresh="refresh(true)"
      />

      <main class="flex flex-col gap-10 p-12 sm:p-16">
        <Overview
          :failure-count="failureCount"
          :loading="isLoading"
          :running-count="runningCount"
          :success-rate="successRate"
          :unresolved-alert-count="unresolvedAlerts.length"
        />
        <Insights
          :alerts="alerts"
          :latency-ranks="workflowLatencyRanks"
          :throughput="workflowThroughput"
          @acknowledge="acknowledgeAlert"
          @open-instance="openInstance"
        />
        <ExecutionTable
          :instances="filteredInstances"
          :loading="isLoading"
          @open="openInstance"
          @retry="retryInstance"
          @terminate="terminateInstance"
        />
      </main>
    </Scrollbar>

    <ExecutionDetailDrawer
      v-model:open="detailOpen"
      :instance="selectedInstance"
      @retry="retryInstance"
      @terminate="terminateInstance"
    />
  </WView>
</template>
