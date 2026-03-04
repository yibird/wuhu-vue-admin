<template>
  <n-card title="推荐应用" :bodyStyle="{ padding: '12px' }">
    <div>
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center p-10 rounded-4 cursor-pointer hover:bg-gray-100"
      >
        <div class="size-40 rounded-4 bg-gray-300"></div>
        <div class="ml-10 flex-1">
          <div>{{ item.title }}</div>
          <div class="text-xs text-secondary">{{ item.description }}</div>
        </div>
      </div>
    </div>
  </n-card>
</template>
<script lang="ts" setup>
  import type { RecommendAppProps } from './types'
  const { items = [] } = defineProps<RecommendAppProps>()
</script>
