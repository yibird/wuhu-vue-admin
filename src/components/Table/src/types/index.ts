import type {
  TableProps,
  TableColumnType,
  PaginationProps,
} from 'ant-design-vue';
import { WrapWithRef } from '/#/global';
export { BasicTableProps } from './table';
export { BasicColumn } from './column';

export type Position = 'left' | 'center' | 'right';

export interface TableTitle {
  title?: string;
  descrption?: string;
}
export interface TableAction {
  /**
   * @desc 显示位置
   * @default right
   */
  position?: Position;
}
export interface TableSetting {
  showSizeSetting: boolean;
  showColumnSetting: boolean;
  showExportSetting: boolean;
  showFullSetting: boolean;
}
export interface TableHeader {
  title?: boolean | TableTitle;
  action?: TableAction;
  setting?: TableSetting;
}

export interface ColumnType<T = any> extends TableColumnType<T> {
  /**
   * @desc 是否显示列
   * @default true
   */
  show?: boolean | ((column: ColumnType<T>) => boolean);

  /**
   * @desc 列插槽名称
   * @default
   */
  slot?: string;
}

export interface TablePlusProps<T = any>
  extends Omit<TableProps, 'columns' | 'pagination' | 'rowSelection'> {
  /**
   * @desc table header
   * @default true
   */
  header?: boolean | TableHeader;
  /**
   * @desc 列集合
   * @default []
   */
  columns?: ColumnType[];
  /**
   * @desc table分页
   * @default true
   */
  pagination?: boolean | PaginationProps;
  /**
   * @desc table选择列
   * @default true
   */
  rowSelection?: boolean | TableProps['rowSelection'];
  /**
   * @desc 是否显示序号列
   * @default true
   */
  indexColumn?: boolean;
  /**
   * @desc 是否开启斑马线
   * @default false
   */
  striped?: boolean;
}

export interface TablePlusSlots {
  header?: () => any;
  title?: () => any;
  action?: () => any;
  setting?: () => any;
}

export interface ContextState {
  columns: ColumnType[];
  indexColumn: boolean;
  // selectionColumn: Ref<boolean>;
  // operateColumn: Ref<boolean>;
  size: TablePlusProps['size'];
  /**
   * @desc 是否开启斑马线
   * @default false
   */
  striped?: boolean;
}
export interface ContextFunc {
  toggleStriped:()=>void
  toggleColumn: (key: ColumnType['dataIndex']) => void;
  toggleIndexColumn: () => void;
  toggleOperateColumn: () => void;
  changeSize: (size: TablePlusProps['size']) => void;
  resetColumns: () => void;
}
export type ContextType = WrapWithRef<ContextState> & ContextFunc;
