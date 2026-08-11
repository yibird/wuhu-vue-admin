<template>
  <div class="w-320">
    <div class="flex items-center justify-between">
      <span class="text-base font-bold">通知</span>
      <button
        class="span-button rounded-2 px-8 py-5 text-sm text-secondary transition-colors hover:(bg-hover text-primary)"
      >
        标记为已读
      </button>
    </div>
    <a-tabs
      v-model:value="value"
      type="segment"
      animated
      size="small"
      class="mt-10"
    >
      <a-tab-pane
        v-for="item in items"
        :key="item.name"
        :name="item.name"
        :tab="item.tab"
      >
        <component :is="component" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
const items = [
  {
    name: 'notify',
    tab: '通知',
    component: defineAsyncComponent(() => import('./Notify.vue')),
  },
  {
    name: 'message',
    tab: '消息',
    component: defineAsyncComponent(() => import('./Message.vue')),
  },
  {
    name: 'todo',
    tab: '代办',
    component: defineAsyncComponent(() => import('./Todo.vue')),
  },
]
const value = ref('notify')
const component = computed(() => {
  const item = items.find((item) => item.name === value.value)
  return item?.component
})
</script>
