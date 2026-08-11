# table Token

Use these variables through `theme.components.Table`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Table: {
        // Token name: value
      },
    },
  }"
>
  ...
</a-config-provider>
```

## Token List

| Token | Type | Description |
| --- | --- | --- |
| `headerBg` | `string` | Background of table header |
| `headerColor` | `string` | Color of table header text |
| `headerSortActiveBg` | `string` | Background color of table header when sorted |
| `headerSortHoverBg` | `string` | Background color of table header when sorted and hovered |
| `bodySortBg` | `string` | Background color of table sorted column |
| `rowHoverBg` | `string` | Background color of table hovered row |
| `rowSelectedBg` | `string` | Background color of table selected row |
| `rowSelectedHoverBg` | `string` | Background color of table selected row when hovered |
| `rowExpandedBg` | `string` | Background color of table expanded row |
| `cellPaddingBlock` | `number` | Vertical padding of table cell |
| `cellPaddingInline` | `number` | Horizontal padding of table cell (large size by default) |
| `cellPaddingBlockMD` | `number` | Vertical padding of table cell (middle size) |
| `cellPaddingInlineMD` | `number` | Horizontal padding of table cell (middle size) |
| `cellPaddingBlockSM` | `number` | Vertical padding of table cell (small size) |
| `cellPaddingInlineSM` | `number` | Horizontal padding of table cell (small size) |
| `borderColor` | `string` | Border color of table |
| `headerBorderRadius` | `number` | Border radius of table header |
| `footerBg` | `string` | Background of footer |
| `footerColor` | `string` | Color of footer text |
| `cellFontSize` | `number` | Font size of table cell (large size by default) |
| `cellFontSizeMD` | `number` | Font size of table cell (middle size) |
| `cellFontSizeSM` | `number` | Font size of table cell (small size) |
| `headerSplitColor` | `string` | Split border color of table header |
| `fixedHeaderSortActiveBg` | `string` | Background color of fixed table header when sorted |
| `headerFilterHoverBg` | `string` | Background color of table header filter button when hovered |
| `filterDropdownMenuBg` | `string` | Background of filter dropdown menu item |
| `filterDropdownBg` | `string` | Color of filter dropdown |
| `expandIconBg` | `string` | Background of expand button |
| `selectionColumnWidth` | `string \| number` | Width of selection column |
| `stickyScrollBarBg` | `string` | Background of sticky scrollbar |
| `stickyScrollBarBorderRadius` | `number` | Border radius of sticky scrollbar |
