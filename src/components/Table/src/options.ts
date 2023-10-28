import type { ColumnType } from './type';

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
