<template>
  <ViewSection
    :loading="props.loading"
    :skeleton-options="{ name: 'analysis-conversion-funnel' }"
  >
    <a-border-beam :duration="8" :line-width="2" :size="140">
      <Card class="page-enter page-enter--5" title="转化漏斗">
        <div
          class="grid grid-cols-1 gap-16 2xl:grid-cols-[minmax(0,1fr)_260px]"
        >
          <div class="min-w-0">
            <div class="mb-14 flex items-end justify-between gap-12">
              <div class="min-w-0">
                <div class="text-sm text-main font-700">本周转化链路</div>
                <div class="mt-3 truncate text-xs text-secondary">
                  核心流失集中在试用激活阶段
                </div>
              </div>
              <div class="shrink-0 text-right">
                <div class="text-2xl text-primary font-800">4.8%</div>
                <div class="mt-1 text-xs text-secondary">最终转化率</div>
              </div>
            </div>

            <div role="list" class="flex flex-col gap-6">
              <StageItem
                v-for="(stage, index) in stages"
                :key="stage.id"
                :index="index"
                :stage="stage"
                :total="stages.length"
              />
            </div>
          </div>

          <aside class="analysis-funnel-aside min-w-0">
            <DealSummary />
            <div class="mt-14 flex items-center justify-between gap-8 px-2">
              <span class="text-sm text-main font-700">运营信号</span>
              <span class="text-xs text-secondary">实时监测</span>
            </div>
            <div class="mt-6 flex flex-col gap-6">
              <InsightItem
                v-for="item in insights"
                :key="item.id"
                :item="item"
              />
            </div>
          </aside>
        </div>
      </Card>
    </a-border-beam>
  </ViewSection>
</template>

<script lang="ts" setup>
import { Card, ViewSection } from '@/components'
import DealSummary from './deal-summary.vue'
import InsightItem from './insight-item.vue'
import StageItem from './stage-item.vue'
import { insights, stages } from './data'

const props = withDefaults(defineProps<{ loading?: boolean }>(), {
  loading: false,
})
</script>
