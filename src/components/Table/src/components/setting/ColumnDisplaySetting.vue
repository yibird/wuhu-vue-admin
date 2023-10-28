<!-- 列显示设置 -->
<template>
  <a-tooltip>
    <template #title>列设置</template>
    <a-popover
      placement="bottomRight"
      trigger="click"
      :overlayInnerStyle="{ padding: 0 }"
    >
      <template #content>
        <a-space class="flex items-center justify-between px-15 py-10">
          <a-checkbox>选择列</a-checkbox>
          <a-checkbox :checked="indexColumn" @change="toggleIndexColumn"
            >序号列</a-checkbox
          >
          <a-checkbox>操作列</a-checkbox>
        </a-space>
        <ul class="panel-list">
          <li
            v-for="(item, index) in columns"
            :key="item.dataIndex + '-' + index"
          >
            <div class="flex-y-center">
              <Icon :size="20" name="ri-drag-move-2-line" class="mr-[8px]" />
              <a-checkbox
                :checked="item.show"
                @change="toggleColumn(item.dataIndex)"
                >{{ item.title }}</a-checkbox
              >
            </div>
            <div class="flex-y-center">
              <Icon color="#1677ff" :size="20" name="ri-arrow-left-line" />
              <a-divider type="vertical" />
              <Icon :size="20" name="ri-arrow-right-line" />
            </div>
          </li>
        </ul>
        <div class="flex justify-end p-10">
          <a-button @click="resetColumns" size="small" type="primary"
            >重置</a-button
          >
        </div>
      </template>
      <Icon name="ri-settings-line" :size="20" />
    </a-popover>
  </a-tooltip>
</template>
<script setup lang="ts">
  import { inject } from 'vue';
  import { ContextType } from '../../types';

  const {
    columns,
    indexColumn,
    toggleColumn,
    resetColumns,
    toggleIndexColumn,
  } = inject<ContextType>('context')!;

  // const value = () => {
  //   const { showIndexColumn, showSelectionColumn } = config;
  //   return [
  //     showIndexColumn ? 'indexCol' : '',
  //     showSelectionColumn ? 'selectionCol' : '',
  //   ];
  // };

  // const state = reactive({
  //   value: [
  //     showIndexColumn ? 'indexCol' : '',
  //     showSelectionColumn ? 'selectionCol' : '',
  //   ],
  //   colSettingOptions: [
  //     {
  //       label: '列显示',
  //       value: 'showCol',
  //     },
  //     {
  //       label: '序号列',
  //       value: 'indexCol',
  //     },
  //     {
  //       label: '选中列',
  //       value: 'selectionCol',
  //     },
  //   ],
  // });
  // const columns = computed(() => {
  //   return config.columns;
  // });

  // const changeOptions = (checkedValue: string) => {
  //   console.log('value:', checkedValue);
  //   changeConfig({
  //     ...config,
  //     showIndexColumn: false,
  //     showSelectionColumn: false,
  //   });
  // };
  // const columns = [
  //   {
  //     prop: "name",
  //     label: "name",
  //   },
  //   {
  //     prop: "age",
  //     label: "age",
  //   },
  // ];
</script>
<style scoped>
  .panel-list {
    max-height: 300px;
    min-width: 240px;
    overflow-y: auto;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  .panel-list li {
    @apply flex items-center justify-between px-15 py-5;
  }
  .panel-list li:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
</style>
