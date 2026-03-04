<template>
  <div>
    <div class="pb-10">
      <div
        v-for="item in items"
        :key="item.id"
        class="px-10 py-8 flex gap-10 rounded-6 cursor-pointer transition hover:(bg-[#f9f9f9])"
      >
        <n-avatar :size="36" />
        <div class="flex-1 overflow-hidden">
          <div class="text-sm text-primary">{{ item.title }}</div>
          <div class="mt-4 text-xs text-secondary">{{ item.createTime }}</div>
        </div>
      </div>
    </div>
    <n-button block>查看全部</n-button>
  </div>
</template>
<script lang="ts" setup>
  const items = [
    {
      id: 1,
      type: 1,
      title: '新增国际化',
      createTime: '2024-6-13 0:10'
    },
    {
      id: 2,
      type: 2,
      title: '冷月呆呆给你发了一条消息',
      createTime: '2024-6-13 0:10'
    },
    {
      id: 3,
      type: 3,
      title: '小肥猪关注了你',
      createTime: '2024-6-13 0:10'
    },
    {
      id: 4,
      type: 4,
      title: '小肥猪给你发了一封邮件',
      createTime: '2024-6-13 0:10'
    }
  ]

  const mapping: Record<number, { background: string; color: string; icon: string }> = {
    1: {
      background: 'rgb(236, 242, 255)',
      color: 'rgb(93, 135, 255)',
      icon: 'i-lucide:bell'
    },
    2: {
      background: 'rgb(230, 255, 250)',
      color: 'rgb(19, 222, 185)',
      icon: 'i-lucide:volume-2'
    },
    3: {
      background: 'rgb(253, 237, 232)',
      color: 'rgb(255, 77, 79)',
      icon: 'i-lucide:heart'
    },
    4: {
      background: 'rgb(254, 245, 229)',
      color: 'rgb(255, 174, 31)',
      icon: 'i-lucide:mail'
    }
  }

  const getItemStyle = (type: number) => {
    const item = mapping[type]
    return item ? { background: item.background, color: item.color } : {}
  }
  const getItemIcon = (type: number) => {
    return mapping[type].icon
  }
</script>
