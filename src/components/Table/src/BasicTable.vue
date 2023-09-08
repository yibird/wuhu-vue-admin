<template>
  <div>
    <!-- header -->
    <TableHeader :title="props.title"> </TableHeader>

    <!-- body -->
    <a-table v-bind="getConfig"></a-table>
  </div>
</template>
<script setup lang="ts">
  import _ from "lodash-es";
  import { computed, provide, reactive, toRefs, unref, watchEffect } from "vue";
  import { BasicTableContext, contextKey } from "./context";
  import { BasicTableProps, BasicColumn } from "./types";
  import TableHeader from "./components/TableHeader.vue";

  interface State {
    config: BasicTableProps;
    selectedRowKeys: string[];
    pagination: BasicTableProps["pagination"];
  }

  const props = withDefaults(defineProps<BasicTableProps>(), {
    dataSource: () => [],
    columns: () => [],
    bordered: true,
    childrenColumnName: "children",
    defaultExpandAllRows: false,
    expandFixed: false,
    expandRowByClick: true,
    pagination: () => {
      return {
        current: 1,
        pageSize: 10,
        total: 100,
        showTotal: (total: number) => `共${total}条数据`,
        pageSizeOptions: ["10", "20"],
        showQuickJumper: true,
        change() {
          console.log("123123");
        },
      };
    },
    indentSize: 15,
    loading: false,
    locale: () => {
      return {
        filterConfirm: "确定",
        filterReset: "重置",
        emptyText: "暂无数据",
      };
    },
    rowKey: "key",
    showExpandColumn: true,
    showHeader: true,
    showSorterTooltip: true,
    size: "default",
    clickToRowSelect: true,
    stripe: true,
    showIndexColumn: true,
    showSelectionColumn: true,
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

  const indexColumn: BasicColumn = {
    title: "序号",
    dataIndex: "index",
    key: "index",
    align: "center",
    width: 70,
    fixed: "left",
    customRender: ({ index }: { index: number }) => index + 1,
  };

  const defaultPagination: BasicTableProps["pagination"] = {
    current: 1,
    pageSize: 10,
    total: 100,
    showTotal: (total: number) => `共${total}条数据`,
    pageSizeOptions: ["10", "20"],
    showQuickJumper: true,
    change() {
      console.log("123123");
    },
  };

  const state = reactive<State>({
    config: { ...props },
    selectedRowKeys: [],
    pagination: { ...defaultPagination },
  });

  const showIndexColumn = computed(() => state.config.showIndexColumn);
  const showSelectionColumn = computed(() => state.config.showSelectionColumn);
  const stripe = computed(() => state.config.stripe);

  const { rowClassName, columns, rowKey, customRow, clickToRowSelect } = state.config;

  const getRowClassName = () => {
    const handle = (record: Recordable, index: number) => {
      return index % 2 === 1 ? "table-striped" : null;
    };
    if (!rowClassName) {
      return handle;
    }
    return;
  };

  // 获取class
  const getCls = computed(() => {
    return { "ant-table-striped": stripe.value };
  });

  // 根据isShow状态进行过滤列
  const filterColByShow = (col: BasicColumn) => {
    const show = col.show;
    return _.isUndefined(show) || (_.isFunction(show) && show(col)) || (_.isBoolean(show) && show);
  };

  // 获取columns
  const getColumns = computed(() => {
    const cols = (columns || []).filter((col) => filterColByShow(col));
    if (showIndexColumn.value) {
      return [indexColumn].concat(cols);
    }
    return cols.filter((item) => item.key !== "index");
  });

  const getRowSelection = computed(() => {
    // 不需要显示选择列
    if (!showSelectionColumn.value) return;
    return {
      selectedRowKeys: state.selectedRowKeys,
      onChange(keys: string[], selectedRows: Recordable[]) {
        state.selectedRowKeys = keys;
        // 触发rowSelection事件
      },
    };
  });

  // 获取rowKey
  const getRowKey = (record: Recordable, rowKey: BasicTableProps["rowKey"]) => {
    if (typeof rowKey === "function") {
      return Reflect.get(record, rowKey(record)) as string;
    }
    return rowKey;
  };

  const getCustomRow = (record: Recordable) => {
    if (!showSelectionColumn || !clickToRowSelect) return;
    const onClick = (event: PointerEvent) => {
      const key = getRowKey(record, rowKey);
      if (!key) return;
      const index = state.selectedRowKeys.indexOf(record[key]);
      if (index > -1) {
        state.selectedRowKeys.splice(index, 1);
        return;
      }
      state.selectedRowKeys.push(record[key]);
    };
    if (typeof customRow === "function") {
      return Object.assign({ onClick }, customRow(record));
    }
    return { onClick };
  };

  const getConfig = computed(() => {
    return {
      ...state.config,
      customRow: getCustomRow,
      class: unref(getCls),
      columns: unref(getColumns),
      rowSelection: unref(getRowSelection),
    };
  });

  const context: BasicTableContext = {
    config: state.config,
    changeConfig(newConfig) {
      Object.assign(state.config, newConfig);
    },
  };
  provide(contextKey, context);

  console.log("p:", props);
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
