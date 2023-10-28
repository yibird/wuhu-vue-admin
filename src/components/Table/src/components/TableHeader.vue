<template>
  <div class="flex justify-between items-center pb-10 px-10">
    <div class="flex items-center flex-1">
      <slot v-if="slots.title" name="title" />
      <TableTitle v-else />
      <slot v-if="slots.action" name="action" />
      <TableAction v-else />
    </div>
    <slot v-if="slots.setting" name="setting" />
    <TableSetting v-else />
  </div>
</template>
<script setup lang="ts">
  import TableTitle from './TableTitle.vue';
  import TableAction from './TableAction.vue';
  import TableSetting from './setting/index.vue';
  import { TablePlusSlots } from '../types';

  const slots = defineSlots<Omit<TablePlusSlots, 'header'>>();
</script>
