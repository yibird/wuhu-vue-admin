<template>
  <n-popover trigger="click">
    <template #trigger>
      <button>
        <n-badge dot class="animated animated-swing animated-infinite">
          <Icon name="i-lucide:bell" :size="20" />
        </n-badge>
      </button>
    </template>
    <NoticeCenter />
  </n-popover>
</template>
<script lang="ts" setup>
import { NoticeCenter } from '@/layouts/config';
</script>
