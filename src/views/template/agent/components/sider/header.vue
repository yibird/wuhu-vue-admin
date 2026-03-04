<template>
  <div
    :class="[
      'p-15 flex items-center gap-10 border-b-1 border-solid border-[#E8E8E8]',
      collapsed ? 'px-0 justify-center' : 'justify-between',
    ]"
  >
    <div v-if="!collapsed" class="flex-1">
      <n-button type="primary" block>新建对话</n-button>
    </div>
    <button
      class="shrink-0 size-34 flex items-center justify-center rounded-6 select-none hover:bg-[#f5f5f5]"
      @click="collapsed = !collapsed"
    >
      <Icon v-if="collapsed" name="i-lucide:panel-right-close" :size="22" />
      <Icon v-else name="i-lucide:panel-right-open" :size="22" />
    </button>
  </div>
</template>
<script setup lang="ts">
const collapsed = defineModel<boolean>('collapsed')
</script>
