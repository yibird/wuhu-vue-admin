<template>
  <n-card title="系统信息" :headStyle="{ minHeight: '45px' }" :bodyStyle="{ padding: '20px' }">
    <div v-if="items.length > 0" class="flex flex-col gap-8">
      <div v-for="(item, index) in items" :key="index" class="flex">
        <span>{{ item.title }}</span>
        <span class="flex-1 ml-20 text-regular truncate">{{ item.value }}</span>
      </div>
    </div>
    <n-empty v-else />
  </n-card>
</template>
<script lang="ts" setup>
  import type { SysInfoProps } from './types'
  const { items = [] } = defineProps<SysInfoProps>()
</script>
