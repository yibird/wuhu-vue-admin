<template>
  <ViewSection skeleton-name="monitor-status" :loading="loading">
    <Card
      title="系统状态"
      icon="i-lucide:server-cog"
      description="CPU、内存、负载与磁盘水位"
    >
      <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4">
        <Item v-for="item in items" :key="item.id" :item="item" />
      </div>
    </Card>
  </ViewSection>
</template>

<script lang="ts" setup>
import { ViewSection } from '@/components/view-section'
import Item from './item.vue'
import Card from '../card.vue'
import type { StatusProps } from '../types'

const { items = [], loading = false } = defineProps<StatusProps>()
</script>
