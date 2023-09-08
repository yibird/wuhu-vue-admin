<!-- 列显示设置 -->
<template>
  <a-tooltip>
    <template #title>列设置</template>
    <!-- popover -->
    <a-popover placement="bottomRight" trigger="click" overlayClassName="ant-popover-custom">
      <template #content>
        <div class="panel-header">
          <a-checkbox-group
            v-model:value="state.value"
            :options="state.colSettingOptions"
            @change="changeOptions"
          />
          <a-button type="link" class="!p-0">重置</a-button>
        </div>
        <ul class="panel-list">
          <li v-for="item in columns" :key="item.prop">
            <div class="flex-y-center">
              <Icon :size="18" name="ri-drag-move-2-line" class="mr-[5px]" />
              <a-checkbox>{{ item.title }}</a-checkbox>
            </div>
            <div class="flex-y-center">
              <Icon :size="18" name="ri-arrow-left-line" />
              <a-divider type="vertical" />
              <Icon :size="18" name="ri-arrow-right-line" />
            </div>
          </li>
        </ul>
      </template>
      <a-button shape="circle" type="primary">
        <template #icon>
          <Icon name="ri-settings-line" />
        </template>
      </a-button>
    </a-popover>
  </a-tooltip>
</template>
<script setup lang="ts">
  import { computed, inject, reactive } from "vue";
  import { contextKey } from "../../context";
  import { BasicTableProps } from "../../types";

  const defaultConfig: BasicTableProps = {
    columns: [],
    showIndexColumn: true,
    showSelectionColumn: true,
  };
  const { config = defaultConfig, changeConfig } = inject(contextKey)!;
  const { showIndexColumn, showSelectionColumn } = config;
  const value = () => {
    const { showIndexColumn, showSelectionColumn } = config;
    return [showIndexColumn ? "indexCol" : "", showSelectionColumn ? "selectionCol" : ""];
  };

  const state = reactive({
    value: [showIndexColumn ? "indexCol" : "", showSelectionColumn ? "selectionCol" : ""],
    colSettingOptions: [
      {
        label: "列显示",
        value: "showCol",
      },
      {
        label: "序号列",
        value: "indexCol",
      },
      {
        label: "选中列",
        value: "selectionCol",
      },
    ],
  });
  const columns = computed(() => {
    return config.columns;
  });

  const changeOptions = (checkedValue: string) => {
    console.log("value:", checkedValue);
    changeConfig({ ...config, showIndexColumn: false, showSelectionColumn: false });
  };
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
  .panel-header {
    @apply flex items-center justify-between px-[15px] py-[5px];
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  }
  .panel-list {
    max-height: 300px;
    min-width: 240px;
    overflow-y: auto;
  }
  .panel-list li {
    @apply flex items-center justify-between px-[15px] py-[5px];
  }
  .panel-list li:not(:last-child) {
    border-bottom: 1px solid #e2e2e2;
  }
</style>
