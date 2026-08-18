<template>
  <section data-swapy-slot="dynamic" class="page-enter page-enter--4 min-w-0">
    <a-card :styles="{ body: { padding: 0 } }" data-swapy-item="dynamic">
      <template #title>
        <span class="text-base text-main font-700">团队动态</span>
      </template>
      <template #extra>
        <a-button type="link" size="small">更多</a-button>
      </template>

      <div class="p-20 flex flex-col">
        <div
          v-for="item in items"
          :key="item.id"
          class="group flex gap-20 px-8 py-12 rounded-4 transition-colors duration-motion-base hover:(bg-hover)"
        >
          <span
            class="size-34 grid place-items-center rounded-full bg-fill-tertiary text-secondary transition-[background-color,color] duration-motion-base group-hover:(bg-primary-tint text-primary)"
          >
            <Icon :name="item.icon" :size="16" />
          </span>
          <div class="min-w-0">
            <div class="min-w-0 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span class="text-sm text-main font-600">{{ item.name }}</span>
              <span class="text-sm text-secondary">{{ item.action }}</span>
              <span class="text-sm text-primary">{{ item.target }}</span>
            </div>
            <p class="mb-0 mt-5 text-sm text-secondary leading-22px">
              {{ item.describe }}
            </p>
            <div class="mt-7 flex items-center gap-6 text-xs text-muted">
              <Icon name="i-lucide:clock-3" :size="13" />
              <span>{{ item.createAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </section>
</template>

<script lang="ts" setup>
import type { Dynamic } from './types'

const items: Dynamic[] = [
  {
    id: 1,
    name: '林舟',
    action: '更新了',
    target: '企业运营中台',
    describe: '补充客户分层策略和看板指标口径，等待研发评估。',
    createAt: '10 分钟前',
    icon: 'i-lucide:file-pen-line',
  },
  {
    id: 2,
    name: '沈一',
    action: '提交了',
    target: '移动端体验优化',
    describe: '已完成工作台、文件管理和图表页的移动端自测记录。',
    createAt: '38 分钟前',
    icon: 'i-lucide:smartphone',
  },
  {
    id: 3,
    name: '周辰',
    action: '创建了',
    target: '工作流节点模板',
    describe: '新增审批、条件分支、消息通知三个节点草案。',
    createAt: '1 小时前',
    icon: 'i-lucide:workflow',
  },
  {
    id: 4,
    name: '许安',
    action: '标记了',
    target: '权限审计风险',
    describe: '发现 2 个菜单路径缺少页面组件，需要本周内确认。',
    createAt: '2 小时前',
    icon: 'i-lucide:shield-alert',
  },
]
</script>
