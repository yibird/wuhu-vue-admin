<template>
  <div>
    <VueDraggable v-model="items" :animation="150" class="p-10 flex flex-col gap-10">
      <div v-if="items.length > 0" v-for="item in items" :key="item.id" class="p-10 bg-red">
        {{ item.description }}
      </div>
      <div v-else>123123</div>
    </VueDraggable>
  </div>
</template>
<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus';
const items = ref([
  {
    id: 1,
    title: '健身',
    description: '晚上19:00去健身房健身',
    status: 1, // 进行中
    createTime: '2025-07-09 12:00:01',
  },
  {
    id: 2,
    title: '项目会议',
    description: '与团队讨论项目进度',
    status: 1, // 进行中
    createTime: '2025-07-10 09:30:00',
  },
  {
    id: 3,
    title: '完成报告',
    description: '撰写季度业务分析报告',
    status: 2, // 已完成
    createTime: '2025-07-08 14:15:22',
  },
]);
</script>
