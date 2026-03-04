<template>
  <div class="p-10 flex flex-col gap-10 overflow-hidden">
    <Overview :items="cards" />
    <Statistics />
    <n-grid item-responsive responsive="screen" x-gap="10" y-gap="10">
      <n-gi span="xs:24 s:24 m:24 l:18 xl:18 xxl:18">
        <div class="w-full flex flex-col gap-10">
          <VisitStatistics />
          <HotTerms />
        </div>
      </n-gi>
      <n-gi span="xs:24 s:24 m:24 l:6 xl:6 xxl:6">
        <div class="w-full flex flex-col gap-10">
          <HotSearch />
          <HotItems />
        </div>
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
import {
  Overview,
  Statistics,
  VisitStatistics,
  HotTerms,
  HotSearch,
  HotItems,
} from './components'
import { cards } from './config'
</script>
