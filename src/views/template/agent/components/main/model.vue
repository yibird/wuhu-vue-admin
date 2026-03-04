<template>
  <n-popover
    :show-arrow="false"
    placement="bottom-start"
    :options="[]"
    trigger="click"
  >
    <template #trigger>
      <div
        class="px-10 py-5 flex items-center gap-6 bg-[#f5f5f5] rounded-6 cursor-pointer"
      >
        <span class="text-sm">qwen3-3b</span>
        <div class="flex items-center gap-10">
          <span
            class="px-4 py-2 text-xs bg-white border-1 border-solid border-[#dedede] rounded-4"
            >CHAT</span
          >
        </div>
        <Icon name="i-lucide:chevron-down" :size="16" />
      </div>
    </template>
    <div>
      <n-input clearable placeholder="请输入模型名称" />
      <div class="mt-10 max-h-300 overflow-y-auto">
        <div
          v-for="item in models"
          :key="item.id"
          class="p-6 rounded-4 cursor-pointer hover:bg-[#eee]"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </n-popover>
</template>
<script setup lang="ts">
const models = [
  {
    id: 1,
    name: 'qwen3-3b',
  },
  {
    id: 2,
    name: 'qwen3-3b-max',
  },
  {
    id: 3,
    name: 'char-gpt',
  },
]
</script>
