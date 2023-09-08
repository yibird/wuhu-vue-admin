<template>
  <div>
    <!-- header -->
    <!-- <TableHader /> -->

    <!-- body -->
    <div class="table-body">
      <a-table> </a-table>
      <!-- <a-table
        v-bind="getConfig"
        :class="getClass"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
      </a-table> -->
    </div>
  </div>
</template>
<script setup lang="ts">
  import _ from "lodash-es";
  import { computed, reactive, provide, ref, InjectionKey } from "vue";
  import TableHader from "./components/TableHeader.vue";
  import { configKey, changeConfigKey } from "./context";
  import { BasicTableProps, BasicColumn } from "./types";

  const props = withDefaults(defineProps<BasicTableProps>(), {
    bordered: true,
    showHeader: true,
    stripe: false,
    size: "default",
    showSetting: true,
    settingOptions: () => {
      return {
        showIndexColumn: true,
        showTableSizeSetting: true,
        showSelectionColumn: true,
        showRefresh: true,
      };
    },
  });

  const config = _.cloneDeep(props) as BasicTableProps;

  const { settingOptions } = props;

  // 获取class
  const getClass = computed(() => {
    return [config.stripe ? "ant-table-striped" : ""];
  });

  // 根据isShow状态进行过滤列
  const filterColByShow = (col: BasicColumn) => {
    const show = col.show;
    return _.isUndefined(show) || (_.isFunction(show) && show(col)) || (_.isBoolean(show) && show);
  };

  // 获取columns
  const getColumns = computed(() => {
    const columns = (config.columns || []).filter((col) => filterColByShow(col));
    if (settingOptions.showIndexColumn) {
      columns.unshift({
        title: "序号",
        dataIndex: "index",
        key: "index",
        align: "center",
        width: 70,
        fixed: "left",
        customRender: ({ index }: { index: number }) => index + 1,
      });
    }
    return columns;
  });

  const getConfig = computed(() => {
    return config;
  });

  provide(configKey, config);
  provide(changeConfigKey, (newConfig) => {
    Object.assign(config, newConfig);
  });

  const selectedRowKeys = ref([]);
  const onSelectChange = () => {
    console.log("123123");
  };
</script>
<style scoped>
  .t-header {
    display: flex;
    justify-content: space-between;
    border: 1px solid red;
  }
  .t-header-title {
    display: inline-flex;
    align-items: center;
  }
  .t-header-title .text {
    @apply text-[16px] text-[#333] font-bold mr-[10px] cursor-pointer;
  }

  .ant-table-striped :deep(.ant-table-tbody tr:nth-child(even) td) {
    background-color: #f5f5f5;
  }
</style>
