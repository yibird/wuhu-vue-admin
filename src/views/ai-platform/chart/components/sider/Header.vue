<script setup lang="ts">
const collapsed = defineModel<boolean>('collapsed', { default: false })

const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <header
    class="grid items-center gap-10 p-10 transition-[padding] duration-200 ease-out max-lg:p-10"
    :class="
      collapsed
        ? 'grid-cols-1 justify-items-center p-8'
        : 'grid-cols-[minmax(0,1fr)_auto]'
    "
  >
    <button
      v-if="!collapsed"
      type="button"
      class="h-36 w-full inline-flex items-center justify-center gap-6 rounded-8 border-1 border-color-muted border-solid bg-container px-0 text-main cursor-pointer transition-colors hover:bg-hover"
      title="新建会话"
      @click="emit('create')"
    >
      <Icon name="i-lucide:plus" :size="18" />
      <span
        class="max-w-80 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-150 ease-out max-sm:hidden"
      >
        新建聊天
      </span>
    </button>

    <button
      type="button"
      class="size-36 inline-flex items-center justify-center rounded-8 border-0 bg-transparent px-0 text-regular cursor-pointer transition-colors hover:bg-hover hover:text-primary"
      :class="{ 'w-40': collapsed }"
      :title="collapsed ? '展开侧栏' : '收起侧栏'"
      @click="collapsed = !collapsed"
    >
      <Icon
        :name="
          collapsed ? 'i-lucide:panel-right-open' : 'i-lucide:panel-right-close'
        "
        :size="20"
      />
    </button>
  </header>
</template>
