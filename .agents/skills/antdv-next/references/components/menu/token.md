# menu Token

Use these variables through `theme.components.Menu`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Menu: {
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
| `dropdownWidth` | `string \| number` | Width of popup menu |
| `zIndexPopup` | `number` | z-index of popup menu |
| `groupTitleColor` | `string` | Color of group title text |
| `groupTitleLineHeight` | `string \| number` | line-height of group title |
| `groupTitleFontSize` | `number` | font-size of group title |
| `itemBorderRadius` | `number` | Radius of menu item |
| `subMenuItemBorderRadius` | `number` | Radius of sub-menu item |
| `itemColor` | `string` | Color of menu item text |
| `itemHoverColor` | `string` | Hover color of menu item text |
| `horizontalItemHoverColor` | `string` | Hover color of horizontal menu item text |
| `itemSelectedColor` | `string` | Color of selected menu item text |
| `subMenuItemSelectedColor` | `string` | Color of submenu title when submenu has selected item |
| `horizontalItemSelectedColor` | `string` | Color of selected horizontal menu item text |
| `itemDisabledColor` | `string` | Color of disabled menu item text |
| `dangerItemColor` | `string` | Color of danger menu item text |
| `dangerItemHoverColor` | `string` | Hover color of danger menu item text |
| `dangerItemSelectedColor` | `string` | Color of selected danger menu item text |
| `dangerItemActiveBg` | `string` | Background color of danger menu item when active |
| `dangerItemSelectedBg` | `string` | Background color of selected danger menu item |
| `itemBg` | `string` | - |
| `itemHoverBg` | `string` | Background color of menu item when hover |
| `subMenuItemBg` | `string` | Background color of sub-menu item |
| `itemActiveBg` | `string` | Background color of menu item when active |
| `itemSelectedBg` | `string` | Background color of menu item when selected |
| `horizontalItemSelectedBg` | `string` | Background color of horizontal menu item when selected |
| `activeBarWidth` | `string \| number` | Width of menu item active bar |
| `activeBarHeight` | `number` | Height of menu item active bar |
| `activeBarBorderWidth` | `string \| number` | Border width of menu item active bar |
| `itemMarginInline` | `number` | Horizontal margin of menu item |
| `horizontalItemHoverBg` | `string` | Background color of horizontal menu item when hover |
| `horizontalItemBorderRadius` | `number` | Border radius of horizontal menu item |
| `itemHeight` | `string \| number` | Height of menu item |
| `collapsedWidth` | `string \| number` | Width when collapsed |
| `popupBg` | `string` | Background color of popup |
| `itemMarginBlock` | `CSSProperties` | margin-block of menu item |
| `itemPaddingInline` | `CSSProperties` | padding-inline of menu item |
| `horizontalLineHeight` | `CSSProperties` | LineHeight of horizontal menu item |
| `iconMarginInlineEnd` | `CSSProperties` | Spacing between icon and text |
| `iconSize` | `number` | Size of icon |
| `collapsedIconSize` | `number` | Size of icon when collapsed |
| `darkPopupBg` | `string` | The background color of the overlay menu in dark mode. |
| `darkItemColor` | `string` | Color of menu item text in dark mode |
| `darkDangerItemColor` | `string` | Color of danger menu item text in dark mode |
| `darkItemBg` | `string` | Background of menu item in dark mode |
| `darkSubMenuItemBg` | `string` | Background of submenu item in dark mode |
| `darkItemSelectedColor` | `string` | Color of selected menu item in dark mode |
| `darkItemSelectedBg` | `string` | Background of active menu item in dark mode |
| `darkItemHoverBg` | `string` | Background of hovered menu item in dark mode |
| `darkGroupTitleColor` | `string` | Color of group title text in dark mode |
| `darkItemHoverColor` | `string` | Color of hovered menu item in dark mode |
| `darkItemDisabledColor` | `string` | Color of disabled menu item in dark mode |
| `darkDangerItemSelectedBg` | `string` | Background of active danger menu item in dark mode |
| `darkDangerItemHoverColor` | `string` | Background of hovered danger menu item in dark mode |
| `darkDangerItemSelectedColor` | `string` | Color of selected danger menu item in dark mode |
| `darkDangerItemActiveBg` | `string` | Background of active danger menu item in dark mode |
