import type { PaginationProps } from 'ant-design-vue';
import type { TablePlusProps } from './types';

export const DEFAULT_PROPS: TablePlusProps = {};

export const DEFAULT_PAGINATION: PaginationProps = {
  total: 0,
  current: 1,
  defaultPageSize: 20,
  showSizeChanger: true,
  showQuickJumper: true,
  responsive: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  size: 'default',
  showTotal(total, range) {
    return `共 ${total} 条数据`;
  },
};
