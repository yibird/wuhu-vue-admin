<template>
  <div class="full p-10 flex flex-col gap-10 overflow-auto">
    <div
      class="p-12 flex justify-between items-center flex-wrap gap-10 bg-white rounded-2"
    >
      <n-button type="primary">添加任务</n-button>
      <div class="flex gap-10">
        <n-input allowClear placeholder="请输入任务名称" />
        <n-radio-group v-model:value="type">
          <n-radio-button
            v-for="item in typeOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</n-radio-button
          >
        </n-radio-group>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <Suspense>
        <Component :is="component" v-model:items="tasks" />
      </Suspense>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { Task } from './components'

const tasks = ref<Task[]>([
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
  {
    id: 4,
    title: '学习TypeScript',
    description: '学习高级类型和泛型',
    status: 3, // 已暂停
    createTime: '2025-07-07 18:45:10',
  },
  {
    id: 5,
    title: '支付房租',
    description: '通过网银支付本月房租',
    status: 4, // 已过期
    createTime: '2025-07-05 10:00:00',
  },
  {
    id: 6,
    title: '购物清单',
    description: '牛奶、鸡蛋、水果、蔬菜',
    status: 1, // 进行中
    createTime: '2025-07-11 16:20:33',
  },
  {
    id: 7,
    title: '代码审查',
    description: '审查团队成员的PR',
    status: 2, // 已完成
    createTime: '2025-07-10 11:05:47',
  },
  {
    id: 8,
    title: '旅行计划',
    description: '制定周末短途旅行计划',
    status: 3, // 已暂停
    createTime: '2025-07-06 13:30:15',
  },
  {
    id: 9,
    title: '更新简历',
    description: '添加最近项目经验',
    status: 1, // 进行中
    createTime: '2025-07-11 09:12:28',
  },
  {
    id: 10,
    title: '预约牙医',
    description: '预约下周牙齿检查',
    status: 4, // 已过期
    createTime: '2025-07-04 15:40:00',
  },
])
const typeOptions = [
  {
    label: '卡片',
    value: 'card',
    component: defineAsyncComponent(
      () => import('./components/card/index.vue')
    ),
  },
  {
    label: '表格',
    value: 'table',
    component: defineAsyncComponent(
      () => import('./components/table/index.vue')
    ),
  },
  {
    label: '甘特图',
    value: 'gantt',
    component: defineAsyncComponent(
      () => import('./components/gantt/index.vue')
    ),
  },
]
const type = ref('card')

const component = computed(() => {
  return typeOptions.find((item) => item.value === type.value)?.component
})
</script>
