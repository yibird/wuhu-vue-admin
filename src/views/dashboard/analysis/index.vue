<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'
import { LazyContainer } from '@/components'
import AnalysisBlockSkeleton from './components/AnalysisBlockSkeleton.vue'
import Overview from './components/overview/index.vue'
import { cards } from './config'

const Statistics = defineAsyncComponent(
  () => import('./components/statistics/index.vue')
)
const VisitStatistics = defineAsyncComponent(
  () => import('./components/VisitStatistics.vue')
)
const ConversionFunnel = defineAsyncComponent(
  () => import('./components/ConversionFunnel.vue')
)
const HotSearch = defineAsyncComponent(
  () => import('./components/HotSearch.vue')
)
const HotItems = defineAsyncComponent(() => import('./components/HotItems.vue'))

const isMobileViewport = useMediaQuery('(max-width: 767px)')
const isWideViewport = useMediaQuery('(min-width: 1536px)')

const trendMinHeight = computed(() => (isMobileViewport.value ? 539 : 483))
const chartMinHeight = computed(() => (isMobileViewport.value ? 361 : 481))
const funnelMinHeight = computed(() => (isWideViewport.value ? 593 : 1078))
const rankingMinHeight = 619
</script>

<template>
  <WView :full="false" class="overflow-hidden bg-page">
    <div class="flex flex-col gap-12">
      <Overview class="page-enter page-enter--2" :items="cards" />
      <LazyContainer
        :min-height="trendMinHeight"
        root-margin="0px 0px 128px"
        class="page-enter page-enter--3"
      >
        <template #placeholder>
          <AnalysisBlockSkeleton :min-height="trendMinHeight" variant="trend" />
        </template>
        <Suspense>
          <Statistics />
          <template #fallback>
            <AnalysisBlockSkeleton
              :min-height="trendMinHeight"
              variant="trend"
            />
          </template>
        </Suspense>
      </LazyContainer>

      <div
        class="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]"
      >
        <main class="min-w-0 flex flex-col gap-12">
          <LazyContainer
            :min-height="chartMinHeight"
            root-margin="0px 0px 96px"
            class="page-enter page-enter--4"
          >
            <template #placeholder>
              <AnalysisBlockSkeleton
                :min-height="chartMinHeight"
                variant="chart"
              />
            </template>
            <Suspense>
              <VisitStatistics />
              <template #fallback>
                <AnalysisBlockSkeleton
                  :min-height="chartMinHeight"
                  variant="chart"
                />
              </template>
            </Suspense>
          </LazyContainer>
          <LazyContainer
            :min-height="funnelMinHeight"
            root-margin="0px 0px 128px"
            class="page-enter page-enter--5"
          >
            <template #placeholder>
              <AnalysisBlockSkeleton
                :min-height="funnelMinHeight"
                variant="funnel"
              />
            </template>
            <Suspense>
              <ConversionFunnel />
              <template #fallback>
                <AnalysisBlockSkeleton
                  :min-height="funnelMinHeight"
                  variant="funnel"
                />
              </template>
            </Suspense>
          </LazyContainer>
        </main>
        <aside class="min-w-0 flex flex-col gap-12">
          <LazyContainer
            :min-height="isMobileViewport ? 381 : 481"
            root-margin="0px 0px 96px"
            class="page-enter page-enter--4"
          >
            <template #placeholder>
              <AnalysisBlockSkeleton
                :min-height="isMobileViewport ? 381 : 481"
                variant="pie"
              />
            </template>
            <Suspense>
              <HotSearch />
              <template #fallback>
                <AnalysisBlockSkeleton
                  :min-height="isMobileViewport ? 381 : 481"
                  variant="pie"
                />
              </template>
            </Suspense>
          </LazyContainer>
          <LazyContainer
            :min-height="rankingMinHeight"
            root-margin="0px 0px 128px"
            class="page-enter page-enter--5"
          >
            <template #placeholder>
              <AnalysisBlockSkeleton
                :min-height="rankingMinHeight"
                variant="ranking"
              />
            </template>
            <Suspense>
              <HotItems />
              <template #fallback>
                <AnalysisBlockSkeleton
                  :min-height="rankingMinHeight"
                  variant="ranking"
                />
              </template>
            </Suspense>
          </LazyContainer>
        </aside>
      </div>
    </div>
  </WView>
</template>
