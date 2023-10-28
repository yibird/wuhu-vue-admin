<template>
  <div>
    <!-- header -->
    <slot v-if="slots.header" name="header" />
    <TableHeader v-if="isShowHeader">
      <template #title v-if="slots.title">
        <slot name="title" />
      </template>
      <template #action v-if="slots.action">
        <slot name="action" />
      </template>
      <template #setting v-if="slots.setting">
        <slot name="setting" />
      </template>
    </TableHeader>
    <!-- body -->
    <a-table v-bind="getBinding" class="ant-table-striped">
      <a-table-column v-for="item in showColumns" v-bind="item" />
    </a-table>
  </div>
</template>
<script setup lang="ts">
  import { reactive, computed, provide, toValue } from 'vue';
  import { compact, pick, omit, isFunction } from 'lodash-es';
  import { useContext } from './hooks/useContext';
  import { DEFAULT_PAGINATION } from './constant';
  import type {
    TablePlusProps,
    TablePlusSlots,
    ContextType,
    ColumnType,
  } from './types';

  const props = withDefaults(defineProps<TablePlusProps>(), {
    header: true,
    columns: () => [],
    bordered: true,
    showHeader: true,
    indexColumn: true,
    size: 'small',
    striped: true,
    pagination: true,
  });

  const slots = defineSlots<TablePlusSlots>();

  const { showColumns, striped, ...restState } = useContext(props);

  provide<ContextType>('context', restState);

  // 是否显示header区域
  const isShowHeader = computed(() => !slots.header && props.header);

  // 分页
  const pagination = computed(() => {
    const { pagination } = props;
    if (typeof pagination === 'boolean') {
      return pagination ? DEFAULT_PAGINATION : {};
    }
    return { ...DEFAULT_PAGINATION, ...pagination };
  });
  // rowClassName
  const rowClassName = (record: ColumnType, index: number, indent: number) => {
    const { rowClassName } = props;
    const classNames = isFunction(rowClassName)
      ? rowClassName(record, index, indent)
      : rowClassName;
    const stripeCls = striped ? (index % 2 === 1 ? 'table-striped' : '') : '';
    return `${stripeCls} ${classNames}`;
  };

  const getBinding = computed(() => {
    return {
      ...omit(props, ['rowSelection', 'columns']),
      size: toValue(restState.size),
      pagination: pagination.value,
      rowClassName,
    };
  });
</script>

<style scoped>
  .ant-table-striped :deep(.ant-table-tbody tr:nth-child(even) td) {
    background-color: #f5f5f5;
  }
</style>
