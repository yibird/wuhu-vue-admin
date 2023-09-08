import { VNodeChild, Slot } from "vue";
import { SpinProps, PaginationProps, TooltipProps } from "ant-design-vue";
import { BasicColumn } from "./column";
import { TableSetting } from "./tableSetting";

export type TableSize = "default" | "middle" | "small"
export type TableLayout = "-" | "auto" | "fixed"
export type PaginationPlacement = "left" | "center" | "right"

export interface TableCustomRecord<T> {
    record?: T;
    index?: number;
}

export interface ExpandedRowRenderRecord<T> extends TableCustomRecord<T> {
    indent?: number;
    expanded?: boolean;
}
export interface TableScroll {
    scrollToFirstRowOnChange?: boolean;
    x: string | number | true;
    y: string | number
}

type TableSticky = boolean | { offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement }


export interface BasicTableProps<T = any> {
    /** antd-vue table组件原生props  */
    bodyCell?: Slot;
    bordered?: boolean;
    childrenColumnName?: string;
    columns?: Recordable[];
    components?: Recordable;
    customFilterDropdown?: Slot;
    customFilterIcon?: Slot;
    customHeaderRow?: (columns: any, index?: number) => object
    customRow?: (columns: Recordable, index?: number) => object
    dataSource?: Recordable[],
    defaultExpandAllRows?: boolean;
    defaultExpandedRowKeys?: string[]
    emptyText?: Slot;
    expandedRowKeys?: string[];
    expandedRowRender?: (record?: ExpandedRowRenderRecord<T>) => Slot | JSX.Element;
    expandFixed?: boolean | string
    expandIcon?: Function | Slot | JSX.Element;
    expandRowByClick?: boolean
    footer?: Function | Slot | JSX.Element;
    getPopupContainer?: () => HTMLElement
    headerCell?: Slot;
    indentSize?: number;
    loading?: boolean | object
    // loading?: boolean | SpinProps
    locale?: object;
    pagination?: boolean | object
    // pagination?: PaginationProps | boolean
    rowClassName?: (record: Recordable, index: number) => string
    rowExpandable?: (record: Recordable) => boolean
    rowKey?: string | ((record: Recordable) => string)
    // rowSelection?: TableRowSelection;
    rowSelection?: object;
    scroll?: TableScroll
    showExpandColumn?: boolean;
    showHeader?: boolean;
    showSorterTooltip?: boolean | object
    // showSorterTooltip?: boolean | TooltipProps
    size?: TableSize
    sortDirections?: Array<any>
    sticky?: boolean | TableSticky
    summary?: Slot
    tableLayout?: TableLayout
    title?: Function | Slot;
    transformCellText?: any

    onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
    onExpand?: (expanded: boolean, record: Recordable) => void
    onExpandedRowsChange?: (expandedRows: string[]) => void
    onResizeColumn?: (w: number, col: Recordable) => void

    /** 扩展prop */
    // 是否显示table 标题帮助信息,默认:true
    isShowtitleHelpMsg?: boolean;
    // table 标题帮助信息
    titleHelpMessage?: string;

    // 是否单机选中行,默认false
    clickToRowSelect?: boolean;
    // 是否显示斑马线,默认false
    stripe?: boolean;
    // 是否显示序号列,默认true
    showIndexColumn?: boolean;
    // 是否显示选择列,默认true,
    showSelectionColumn?: boolean;


    // 分页显示位置,默认"right"
    paginationPlacement?: PaginationPlacement;
    // 是否显示table setting(table头部右侧区域),默认true
    showSetting?: boolean;
    // table action配置
    settingOptions?: TableSetting
}