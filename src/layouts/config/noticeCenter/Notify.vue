<template>
  <Scrollbar class="max-h-300">
    <div class="pb-10">
      <div
        v-for="item in items"
        :key="item.id"
        class="content-auto-52 flex gap-10 rounded-6 px-10 py-8 cursor-pointer transition-colors hover:bg-hover"
      >
        <div
          class="size-36 flex-center rounded-4"
          :class="getItemClass(item.type)"
        >
          <Icon :name="getItemIcon(item.type)" :size="18" />
        </div>
        <div class="flex-1 overflow-hidden">
          <div class="text-sm text-primary">{{ item.title }}</div>
          <div class="mt-4 text-xs text-secondary">{{ item.createTime }}</div>
        </div>
      </div>
    </div>
    <a-button block>查看全部</a-button>
  </Scrollbar>
</template>
<script lang="ts" setup>
const items = [
  {
    id: 1,
    type: 1,
    title: '新增国际化',
    createTime: '2024-6-13 0:10',
  },
  {
    id: 2,
    type: 2,
    title: '冷月呆呆给你发了一条消息',
    createTime: '2024-6-13 0:10',
  },
  {
    id: 3,
    type: 3,
    title: '小肥猪关注了你',
    createTime: '2024-6-13 0:10',
  },
  {
    id: 4,
    type: 4,
    title: '小肥猪给你发了一封邮件',
    createTime: '2024-6-13 0:10',
  },
]

const mapping: Record<number, { className: string; icon: string }> = {
  1: {
    className: 'bg-info-tint text-info',
    icon: 'i-lucide:bell',
  },
  2: {
    className: 'bg-success-tint text-success',
    icon: 'i-lucide:volume-2',
  },
  3: {
    className: 'bg-error-tint text-error',
    icon: 'i-lucide:heart',
  },
  4: {
    className: 'bg-warning-tint text-warning',
    icon: 'i-lucide:mail',
  },
}

const getItemClass = (type: number) => mapping[type]?.className ?? ''
const getItemIcon = (type: number) => mapping[type]?.icon ?? 'i-lucide:bell'
</script>
