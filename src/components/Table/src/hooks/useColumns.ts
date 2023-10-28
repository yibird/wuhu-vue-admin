import type { ContextState, ColumnType } from '../types';
import { ref, computed } from 'vue';
import { compact } from 'lodash-es';

const columnOption: ColumnType = {
  show: true,
  align: 'center',
};

const indexColumnOption: ColumnType = {
  title: '序号',
  dataIndex: 'index',
  key: 'index',
  align: 'center',
  width: 70,
  fixed: 'left',
  customRender: ({ index }: { index: number }) => index + 1,
};

export function useColumns(state: ContextState) {
  const getColumns = computed(() => {
    const { columns, indexColumn } = state;
    const showColumns = columns
      .map((item) => ({ ...columnOption, ...item }))
      .filter((item) => {
        if (typeof item.show === 'function') return item.show(item);
        return item.show;
      });
    return compact([indexColumn && indexColumnOption, ...showColumns]);
  });
  const columns = ref(getColumns.value);
  function resetColumns() {
    columns.value = [];
  }
  return {
    columns,
    resetColumns,
  };
}
