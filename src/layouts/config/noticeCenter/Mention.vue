<script setup lang="ts">
const items = [
  {
    id: 1,
    sender: '产品设计组',
    content: '在「控制台体验优化」中提到了你',
    createTime: '10 分钟前',
  },
  {
    id: 2,
    sender: '项目管理员',
    content: '在任务「通知中心改版」中提到了你',
    createTime: '昨天 16:42',
  },
  {
    id: 3,
    sender: '研发协作群',
    content: '在评论中提到了你，请及时确认处理结果',
    createTime: '8 月 24 日',
  },
]
</script>

<template>
  <Scrollbar class="max-h-300">
    <div class="pb-10">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="content-auto-60 w-full flex gap-10 rounded-6 border-0 bg-transparent px-10 py-8 text-left cursor-pointer transition-colors hover:bg-hover"
      >
        <span
          class="size-36 flex shrink-0 items-center justify-center rounded-6 bg-primary-tint text-primary"
        >
          <Icon name="i-lucide:at-sign" :size="18" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm text-main font-500">
            {{ item.sender }}
          </span>
          <span class="mt-2 block line-clamp-2 text-xs text-secondary">
            {{ item.content }}
          </span>
          <span class="mt-4 block text-xs text-tertiary">
            {{ item.createTime }}
          </span>
        </span>
      </button>
    </div>
    <a-button block>查看全部</a-button>
  </Scrollbar>
</template>
