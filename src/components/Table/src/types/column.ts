import { TooltipProps } from 'ant-design-vue/lib/tooltip';
import { VNode } from "vue";

export type ColumnAlign = "left" | "right" | "center"
export type SortOrder = "ascend" | "descend"
export type Breakpoint = 'xxxl' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';


export interface BasicColumn {
    align?: ColumnAlign;
    colSpan?: number;
    customCell?: (record: Recordable, rowIndex: number, column: BasicColumn) => void;
    customFilterDropdown?: boolean;
    customHeaderCell?: (column: BasicColumn) => void
    customRender?: ({ text, record, index, column }: { text: string, record: Recordable, index: number, column: BasicColumn }) => void;
    dataIndex?: string[] | string;
    defaultFilteredValue?: string[];
    defaultSortOrder?: SortOrder
    ellipsis?: boolean | { showTitle?: boolean };
    filterDropdown?: VNode;
    filterDropdownVisible?: boolean;
    filtered?: boolean;
    filteredValue?: string[];
    filterIcon?: VNode | (({ filtered, column }: { filtered: boolean, column: BasicColumn }) => VNode)
    filterMode?: "menu" | "tree";
    filterMultiple?: boolean;
    filters?: Recordable[];
    filterSearch?: boolean;
    fixed?: boolean | "left" | "right";
    key?: string;
    maxWidth?: number;
    minWidth?: number;
    resizable?: boolean;
    responsive?: Breakpoint[];
    showSorterTooltip?: boolean | TooltipProps;
    sortDirections?: Array<SortOrder>;
    sorter?: Function | boolean;
    sortOrder?: boolean | SortOrder
    title?: string;
    width?: string | number;
    onFilter?: Function;
    onFilterDropdownVisibleChange?: (visible: boolean) => void

    // 控制列是否显示
    show?: boolean | ((column: BasicColumn) => boolean);
}