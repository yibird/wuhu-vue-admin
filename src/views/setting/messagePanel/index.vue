<!-- MessagePanel -->
<template>
  <a-drawer title="消息面板" :visible="visible" @close="closeHandle" :bodyStyle="{ padding: 0 }">
    <a-tabs centered class="h-full">
      <a-tab-pane v-for="item in list" :key="item.key" :tab="item.title">
        <component :is="item.component" />
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>
<script setup lang="ts">
  import Notify from './components/Notify.vue';
  import Message from './components/Message.vue';
  import TodoList from './components/TodoList.vue';

  interface Emits {
    (e: 'update:visible', visible: boolean): void;
  }
  const list = [
    {
      key: 'notify',
      title: '通知',
      component: Notify,
    },
    {
      key: 'message',
      title: '消息',
      component: Message,
    },
    {
      key: 'todoList',
      title: '待办',
      component: TodoList,
    },
  ];

  const { visible = false } = defineProps<{ visible: boolean }>();
  const emit = defineEmits<Emits>();
  const closeHandle = () => {
    emit('update:visible', false);
  };
</script>
