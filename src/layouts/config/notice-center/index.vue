<template>
  <div class="w-320">
    <div class="flex items-center justify-between">
      <span class="text-base font-bold">通知</span>
      <button
        class="span-button px-8 py-5 text-sm text-secondary rounded-2 transition hover:(bg-[#F5F5F5] text-primary)"
        >标记为已读</button
      >
    </div>
    <n-tabs v-model:value="value" type="segment" animated size="small" class="mt-10">
      <n-tab-pane v-for="item in items" :key="item.name" :name="item.name" :tab="item.tab">
        <component :is="component" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script lang="ts" setup>
const items = [
  {
    name: 'notify',
    tab: '通知',
    component: defineAsyncComponent(() => import('./notify.vue')),
  },
  {
    name: 'message',
    tab: '消息',
    component: defineAsyncComponent(() => import('./message.vue')),
  },
  {
    name: 'todo',
    tab: '代办',
    component: defineAsyncComponent(() => import('./todo.vue')),
  },
];
const value = ref('notify');
const component = computed(() => {
  const item = items.find((item) => item.name === value.value);
  return item?.component;
});
</script>
