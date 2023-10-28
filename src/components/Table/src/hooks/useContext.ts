import { reactive, computed, unref, toRefs } from 'vue';
import { compact, cloneDeep, pick } from 'lodash-es';
import {
  TablePlusProps,
  ColumnType,
  ContextState,
  ContextFunc,
} from '../types';

export const columnOption: ColumnType = {
  show: true,
  align: 'center',
};

export const indexColumnOption: ColumnType = {
  title: '序号',
  dataIndex: 'index',
  key: 'index',
  align: 'center',
  width: 70,
  fixed: 'left',
  customRender: ({ index }: { index: number }) => index + 1,
};

export const operateColumnOption: ColumnType = {
  title: '操作',
  dataIndex: 'index',
  key: 'index',
  align: 'center',
  width: 'auto',
  fixed: 'right',
  customRender: ({ index }: { index: number }) => index + 1,
};

export function useContext(props: TablePlusProps) {
  const {} = props;
  const columns = props.columns!.map((item) => {
    return {
      ...columnOption,
      ...item,
    };
  });
  const copyColumns = cloneDeep(columns);

  const state = reactive<ContextState>({
    columns,
    indexColumn: true,
    size: 'small',
    striped: true,
  });

  const showColumns = computed(() => {
    const { columns, indexColumn } = state;
    const filterColumns = columns.filter((item) => {
      if (typeof item.show === 'function') return item.show(item);
      return item.show;
    });
    return compact([
      indexColumn && indexColumnOption,
      ...filterColumns,
      operateColumnOption,
    ]);
  });

  const funcs: ContextFunc = {
    // 根据列标识切换列
    toggleColumn(key) {
      const columns = state.columns.map((item) => {
        return { ...item, show: key === item.key ? !item.show : item.show };
      });
      Object.assign(state, { columns });
    },
    // 切换序号列
    toggleIndexColumn() {
      Object.assign(state, { indexColumn: !state.indexColumn });
    },
    // 切换操作列
    toggleOperateColumn() {
      console.log('1111111');
    },
    changeSize(size) {
      Object.assign(state, { size });
    },
    resetColumns() {
      Object.assign(state, { columns: [...copyColumns] });
    },
  };

  return {
    showColumns,
    ...toRefs(state),
    ...funcs,
  };
}
