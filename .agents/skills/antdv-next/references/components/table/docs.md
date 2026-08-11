---
title: Table
description: A table displays rows of data.
---

## When To Use

- To display a collection of structured data.
- To sort, search, paginate, filter data.

## How To Use

Specify `dataSource` of Table as an array of data.

```vue
<script setup lang="ts">
const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
]

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
]
</script>

<template>
  <a-table :data-source="dataSource" :columns="columns" />
</template>
```

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Bordered | demo/bordered.md |
| Ajax | demo/ajax.md |
| Pagination | demo/pagination.md |
| Size | demo/size.md |
| Sticky Header | demo/sticky.md |
| Fixed Header | demo/fixed-header.md |
| Fixed Columns | demo/fixed-columns.md |
| Fixed Columns & Header | demo/fixed-columns-header.md |
| Wide Fixed Columns | demo/fixed-gapped-columns.md |
| Narrow Table | demo/narrow.md |
| Responsive | demo/responsive.md |
| Grouped Columns | demo/grouping-columns.md |
| Rowspan & Colspan | demo/colspan-rowspan.md |
| Summary | demo/summary.md |
| Custom Empty | demo/custom-empty.md |
| Custom Filter Panel | demo/custom-filter-panel.md |
| Filter Search | demo/filter-search.md |
| Tree Filter | demo/filter-in-tree.md |
| Sorting & Filtering | demo/head.md |
| Multiple Sorter | demo/multiple-sorter.md |
| Order Columns | demo/order-column.md |
| Hidden Columns | demo/hidden-columns.md |
| Drag Row Sorting | demo/drag-sorting.md |
| Drag Handle Sorting | demo/drag-sorting-handler.md |
| Resizable Column | demo/resizable-column.md |
| Edit Row | demo/edit-row.md |
| Edit Cell | demo/edit-cell.md |
| Ellipsis | demo/ellipsis.md |
| Custom Ellipsis Tooltip | demo/ellipsis-custom-tooltip.md |
| Expand | demo/expand.md |
| Expand Sticky | demo/expand-sticky.md |
| Nested Table | demo/nested-table.md |
| Tree Data | demo/tree-data.md |
| Row Selection | demo/row-selection.md |
| Custom Selection | demo/row-selection-custom.md |
| Selection Operations | demo/row-selection-and-operation.md |
| Reset Filter | demo/reset-filter.md |
| Virtual List | demo/virtual-list.md |
| Style & Class | demo/style-class.md |
| Dynamic Settings | demo/dynamic-settings.md |
| Header & Body Cell Slots | demo/cell-slot.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| bordered | Whether to show all table borders | boolean | false | - | × |
| column | Default props for every column. See [Column](#column). It only applies when the column does not define the same property. | Partial\<[ColumnType](#column)\> | - | - | ✓ |
| columns |  Columns of table | [ColumnsType](#column)\[\] | - | - | × |
| components | Override default table elements | [components](#components) | - | - | × |
| dataSource | Data record array to be displayed | object[] | - | - | × |
| expandable | Config expandable content | [expandable](#expandable) | - |  | ✓ |
| getPopupContainer | The render container of dropdowns in table| (triggerNode) => HTMLElement | () => TableHtmlElement | - | × |
| loading | Loading status of table | boolean \| [Spin Props](../spin/docs.md#props) | false | - | × |
| locale | The i18n text including filter, sort, empty text, etc | object | [默认值](https://github.com/ant-design/ant-design/blob/6dae4a7e18ad1ba193aedd5ab6867e1d823e2aa4../locale/docs.md/zh_CN.tsx#L20-L37) | - | × |
| pagination |Config of pagination. You can ref table pagination [config](#pagination) or full [`pagination`](../pagination/docs.md/) document, hide it by setting it to `false` | false \| TablePaginationConfig | - | - | × |
| rowClassName | Row's className | function(record, index): string | - |  | × |
| rowKey | Row's unique key, could be a string or function that returns a string | string \| function(record): string | `key` | - | ✓ |
| rowSelection | Row selection [config](#rowselection) | object | - | - | × |
| rowHoverable | Row hover | boolean | true | - | × |
| scroll | Whether the table can be scrollable, [config](#scroll) | object | - | - | ✓ |
| showHeader | Whether to show table header | boolean | true | - | × |
| showSorterTooltip | The header show next sorter direction tooltip. It will be set as the property of Tooltip if its type is object | boolean \| [Tooltip props](../tooltip/docs.md) & `{target?: 'full-header' \| 'sorter-icon' }` | \{ target: 'full-header' \} | - | × |
| size | Size of table | `large` \| `middle` \| `small` | `large` |  | × |
| sortDirections | Supported sort way, could be `ascend`, `descend` | Array | \[`ascend`, `descend`] | - | × |
| sticky | Set sticky header and scroll bar | boolean \| `{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement}` | - | - | × |
| summary | Summary content renderer. You can also use the `#summary` slot. | VueNode \| function(currentPageData) | - | - | × |
| tableLayout | The [table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout) attribute of table element | - \| `auto` \| `fixed` | -<hr />`fixed` when header/columns are fixed, or using `column.ellipsis`  |  | × |
| title | Table title renderer. You can also use the `#title` slot. | VueNode \| function(currentPageData) | - | - | × |
| dropdownPrefixCls | - | string | - | - | × |
| virtual | Support virtual list | boolean | - | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback executed when pagination, filters or sorter is changed | (     pagination: TablePaginationConfig,     filters: Record&lt;string, FilterValue \| null&gt;,     sorter: SorterResult&lt;RecordType&gt; \| SorterResult&lt;RecordType&gt;[],     extra: TableCurrentDataSource&lt;RecordType&gt;,   ) =&gt; void | - |
| update:expandedRowKeys | - | (keys: readonly Key[]) =&gt; void | - |
| scroll | Whether the table can be scrollable, [config](#scroll) | NonNullable&lt;VcTableProps['onScroll']&gt; | - |
| headerRow | Set props on per header row | function(columns, index) | - | - |
| row | Set props on per row | function(record, index) | - | - |

<h4>onRow Usage</h4>

This applies to `onRow`, `onHeaderRow`, `column.onCell`, and `column.onHeaderCell`.

```vue
<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    @row="onRow"
    @header-row="onHeaderRow"
  />
</template>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'

const onRow: TableProps['onRow'] = (record, index) => {
  return {
    onClick: (event) => {}, // click row
    onDblclick: (event) => {}, // double click row
    onContextmenu: (event) => {}, // right button click row
    onMouseenter: (event) => {}, // mouse enter row
    onMouseleave: (event) => {}, // mouse leave row
  }
}

const onHeaderRow: TableProps['onHeaderRow'] = (columns, index) => {
  return {
    onClick: (event) => {}, // click header row
  }
}
</script>
```

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | Table title renderer | (data: readonly RecordType[]) =&gt; any | - |
| footer | Table footer renderer | (data: readonly RecordType[]) =&gt; any | - |
| summary | Summary content | (data: readonly RecordType[]) =&gt; any | - |
| emptyText | - | () =&gt; any | - |
| expandIcon | - | (info: any) =&gt; any | - |
| expandedRowRender | - | (ctx: &#123; record: RecordType, index: number, indent: number, expanded: boolean &#125;) =&gt; any | - |
| headerCell | - | (ctx: &#123; column: ColumnType&lt;RecordType&gt;, index: number, text: any &#125;) =&gt; any | - |
| bodyCell | - | (ctx: &#123; column: ColumnType&lt;RecordType&gt;, index: number, text: any, record: RecordType &#125;) =&gt; any | - |
| filterDropdown | - | (ctx: FilterDropdownProps & &#123; column: ColumnType&lt;RecordType&gt; &#125;) =&gt; any | - |
| filterIcon | - | (ctx: &#123; column: ColumnType&lt;RecordType&gt;, filtered: boolean &#125;) =&gt; any | - |

### Column

One of the Table `columns` prop for describing the table's columns, Column has the same API.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | The specify which way that column is aligned | `left` \| `right` \| `center` | `left` | - |
| className | The className of this column | string | - | - |
| colSpan | Span of this column's title | number | - | - |
| dataIndex | Display field of the data record, support nest path by string array | string \| string\[] | - | - |
| defaultFilteredValue | Default filtered values | string\[] | - | - |
| filterResetToDefaultFilteredValue | click the reset button, whether to restore the default filter | boolean | false | - |
| defaultSortOrder | Default order of sorted values | `ascend` \| `descend` | - | - |
| ellipsis | The ellipsis cell content, not working with sorter and filters for now.<br />tableLayout would be `fixed` when `ellipsis` is `true` or `{ showTitle?: boolean }` | boolean \| \{ showTitle?: boolean \} | false | - |
| filterDropdown | Customized filter overlay | VueNode \| (props: [FilterDropdownProps](https://github.com/antdv-next/antdv-next/blob/main/packages/antdv-next/src/table/interface.ts#L94)) => VueNode | - | - |
| filtered | Whether the `dataSource` is filtered | boolean | false | - |
| filteredValue | Controlled filtered value, filter icon will highlight | string\[] | - | - |
| filterIcon | Customized filter icon | VueNode \| (filtered: boolean) => VueNode | - | - |
| filterOnClose | Whether to trigger filter when the filter menu closes | boolean | true | - |
| filterMultiple | Whether multiple filters can be selected | boolean | true | - |
| filterMode | To specify the filter interface | 'menu' \| 'tree' | 'menu' | - |
| filterSearch | Whether to be searchable for filter menu | boolean \| function(input, record):boolean | false | - |
| filters | Filter menu config | object\[] | - | - |
| filterDropdownProps | Customized dropdown props | [DropdownProps](../dropdown/docs.md#api) | - | - |
| fixed | (IE not support) Set column to be fixed: `true`(same as `'start'`) `'start'` `'end'` | boolean \| string | false | - |
| key | Unique key of this column, you can ignore this prop if you've set a unique `dataIndex` | string | - |  |
| render | Renderer of the table cell. `value` is the value of current cell; `record` is the value object of current row; `index` is the row number. The return value should be a VueNode | (value: V, record: T, index: number): VueNode | - | - |
| responsive | The list of breakpoints at which to display this column. Always visible if not set | [Breakpoint](https://github.com/antdv-next/antdv-next/blob/main/packages/antdv-next/src/_util/responsiveObserver.ts#L9)\[] | - | - |
| rowScope | Set scope attribute for all cells in this column | `row` \| `rowgroup` | - | - |
| shouldCellUpdate | Control cell render logic | (record, prevRecord) => boolean | - | - |
| showSorterTooltip | If header show next sorter direction tooltip, override `showSorterTooltip` in table | boolean \| [Tooltip props](../tooltip/docs.md/) & `{target?: 'full-header' \| 'sorter-icon' }` | \{ target: 'full-header' \} | - |
| sortDirections | Supported sort way, override `sortDirections` in `Table`, could be `ascend`, `descend` | Array | \[`ascend`, `descend`] | - |
| sorter | Sort function for local sort, see [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)'s compareFunction. If it is server-side sorting, set to `true`, but if you want to support multi-column sorting, you can set it to `{ multiple: number }` | function \| boolean \| \{ compare: function, multiple: number \} | - | - |
| sortOrder | Order of sorted values: `ascend` `descend` `null` | `ascend` \| `descend` \| null | - | - |
| sortIcon | Customized sort icon | (props: \{ sortOrder \}) => VueNode | - | - |
| title | Title of this column | VueNode \| (\{ sortColumns, filters \}) => VueNode | - | - |
| width | Width of this column ([width not working?](https://github.com/ant-design/ant-design/issues/13825#issuecomment-449889241)) | string \| number | - | - |
| minWidth | Min width of this column, only works when `tableLayout="auto"` | number | - | - |
| hidden | Hidden this column | boolean | false | - |
| onCell | Set props on per cell | function(record, rowIndex) | - | - |
| onFilter | Function that determines if the row is displayed when filtered | function(value, record) => boolean | - | - |
| onHeaderCell | Set props on per header cell | function(column) | - | - |

### ColumnGroup

| Property | Description               | Type      | Default |
| -------- | ------------------------- | --------- | ------- |
| title    | Title of the column group | VueNode | -       |

### components

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| table | Customize table element | Component | - |
| header.table | Customize header table element | Component | - |
| header.wrapper | Customize header wrapper element | Component | - |
| header.row | Customize header row element | Component | - |
| header.cell | Customize header cell element | Component | - |
| body | Customize body render function or body element collection | Function \| object | - |
| body.wrapper | Customize body wrapper element | Component | - |
| body.row | Customize body row element | Component | - |
| body.cell | Customize body cell element | Component | - |

### pagination

Properties for pagination.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| placement | Specify the placement of `Pagination`, could be`topStart` \| `topCenter` \| `topEnd` \|`bottomStart` \| `bottomCenter` \| `bottomEnd` \| `none` | Array | \[`bottomEnd`] |

More about pagination, please check [`Pagination`](../pagination/docs.md/).

### expandable

Properties for expandable.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| childrenColumnName | The column contains children to display | string | children | - |
| columnTitle | Set the title of the expand column | VueNode | - | - |
| columnWidth | Set the width of the expand column | string \| number | - | - |
| defaultExpandAllRows | Expand all rows initially | boolean | false | - |
| defaultExpandedRowKeys | Initial expanded row keys | string\[] | - | - |
| expandedRowClassName | Expanded row's className | string \| (record, index, indent) => string | - | - |
| expandedRowKeys | Current expanded row keys | string\[] | - | - |
| expandedRowRender | Expanded container render for each row | function(record, index, indent, expanded): VueNode | - | - |
| expandIcon | Customize row expand Icon. Ref [example](https://stackblitz.com/edit/vitejs-vite-jezqinto?file=src%2FApp.vue) | function(props): VueNode | - | - |
| expandRowByClick | Whether to expand row by clicking anywhere in the whole row | boolean | false | - |
| fixed | Whether the expansion icon is fixed. Optional true `left` `right` | boolean \| string | false | - |
| indentSize | Indent size in pixels of tree data | number | 15 | - |
| rowExpandable | Enable row can be expandable | (record) => boolean | - | - |
| showExpandColumn | Show expand column | boolean | true | - |
| onExpand | Callback executed when the row expand icon is clicked | function(expanded, record) | - | - |
| onExpandedRowsChange | Callback executed when the expanded rows change | function(expandedRows) | - | - |

### rowSelection

Properties for row selection.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Set the alignment of selection column | `left` \| `right` \| `center` | `left` | - |
| checkStrictly | Check table row precisely; parent row and children rows are not associated | boolean | true | - |
| columnTitle | Set the title of the selection column | VueNode \| (originalNode: VueNode) => VueNode | - | - |
| columnWidth | Set the width of the selection column | string \| number | `32px` | - |
| fixed | Fixed selection column on the left | boolean | - | - |
| getCheckboxProps | Get Checkbox or Radio props | function(record) | - | - |
| getTitleCheckboxProps | Get title Checkbox props | function() | - | - |
| hideSelectAll | Hide the selectAll checkbox and custom selection | boolean | false | - |
| preserveSelectedRowKeys | Keep selection `key` even when it removed from `dataSource` | boolean | - | - |
| renderCell | Renderer of the table cell. Same as `render` in column | (checked: boolean, record: T, index: number, originNode: VueNode): VueNode | - | - |
| selectedRowKeys | Controlled selected row keys | string\[] \| number\[] | \[] | - |
| selections | Custom selection [config](#selection), only displays default selections when set to `true` | object\[] \| boolean | - | - |
| type | `checkbox` or `radio` | `checkbox` \| `radio` | `checkbox` | - |
| onCell | Set props on per cell. Same as `onCell` in column | function(record, rowIndex) | - | - |
| onChange | Callback executed when selected rows change | function(selectedRowKeys, selectedRows, info: \{ type \}) | - | - |
| onSelect | Callback executed when select/deselect one row | function(record, selected, selectedRows, nativeEvent) | - | - |

### scroll

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| scrollToFirstRowOnChange | Whether to scroll to the top of the table when paging, sorting, filtering changes | boolean | - |
| x | Set horizontal scrolling, can also be used to specify the width of the scroll area, could be number, percent value, true and ['max-content'](https://developer.mozilla.org/en-US/docs/Web/CSS/width#max-content) | string \| number \| true | - |
| y | Set vertical scrolling, can also be used to specify the height of the scroll area, could be string or number | string \| number | - |

### selection

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| key | Unique key of this selection | string | - |
| text | Display text of this selection | VueNode | - |
| onSelect | Callback executed when this selection is clicked | function(changeableRowKeys) | - |

## Semantic DOM 
| _semantic | demo/_semantic.md |
