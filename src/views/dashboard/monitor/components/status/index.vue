<script lang="ts" setup>
import Item from './item.vue'
import Card from '../Card.vue'
import type { StatusProps } from '../types'

const { items = [], loading = false } = defineProps<StatusProps>()
</script>

<template>
  <Card
    v-if="loading"
    title="系统状态"
    icon="i-lucide:server-cog"
    description="CPU、内存、负载与磁盘水位"
  >
    <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="item in 4" :key="item" class="rounded-8 bg-fill-1 p-12">
        <a-skeleton active :title="{ width: '52%' }" :paragraph="{ rows: 2 }" />
        <a-skeleton-input active class="!mt-12 !h-6 !w-full" />
      </div>
    </div>
  </Card>
  <Card
    v-else
    title="系统状态"
    icon="i-lucide:server-cog"
    description="CPU、内存、负载与磁盘水位"
  >
    <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4">
      <Item v-for="item in items" :key="item.id" :item="item" />
    </div>
  </Card>
</template>
