# time-picker Token

Use these variables through `theme.components.DatePicker`. This document lists definitions only and does not include values.

This directory reuses the `DatePicker` component theme configuration.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      DatePicker: {
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
| `presetsWidth` | `number` | Width of preset area |
| `presetsMaxWidth` | `number` | Max width of preset area |
| `zIndexPopup` | `number` | z-index of popup |
| `paddingInline` | `number` | Horizontal padding of input |
| `paddingInlineSM` | `number` | Horizontal padding of small input |
| `paddingInlineLG` | `number` | Horizontal padding of large input |
| `paddingBlock` | `number` | Vertical padding of input |
| `paddingBlockSM` | `number` | Vertical padding of small input |
| `paddingBlockLG` | `number` | Vertical padding of large input |
| `addonBg` | `string` | Background color of addon |
| `hoverBorderColor` | `string` | Hover border color |
| `activeBorderColor` | `string` | Active border color |
| `activeShadow` | `string` | Box-shadow when active |
| `errorActiveShadow` | `string` | Box-shadow when active in error status |
| `warningActiveShadow` | `string` | Box-shadow when active in warning status |
| `hoverBg` | `string` | Background color when the input box hovers |
| `activeBg` | `string` | Background color when the input box is activated |
| `inputFontSize` | `number` | Font size |
| `inputFontSizeLG` | `number` | Font size of large |
| `inputFontSizeSM` | `number` | Font size of small |
| `cellHoverBg` | `string` | Background color of cell hover state |
| `cellActiveWithRangeBg` | `string` | Background color of cell in range |
| `cellHoverWithRangeBg` | `string` | Background color of hovered cell in range |
| `cellBgDisabled` | `string` | Background color of disabled cell |
| `cellRangeBorderColor` | `string` | Border color of cell in range when picking |
| `timeColumnWidth` | `number` | Width of time column |
| `timeColumnHeight` | `number` | Height of time column |
| `timeCellHeight` | `number` | Height of time cell |
| `cellHeight` | `number` | Height of cell |
| `cellWidth` | `number` | Width of cell |
| `textHeight` | `number` | Height of cell text |
| `withoutTimeCellHeight` | `number` | Height of decade/year/quarter/month/week cell |
| `multipleItemBg` | `string` | Background color of multiple tag |
| `multipleItemBorderColor` | `string` | Border color of multiple tag |
| `multipleItemHeight` | `number` | Height of multiple tag |
| `multipleItemHeightSM` | `number` | Height of multiple tag with small size |
| `multipleItemHeightLG` | `number` | Height of multiple tag with large size |
| `multipleSelectorBgDisabled` | `string` | Background color of multiple selector when disabled |
| `multipleItemColorDisabled` | `string` | Text color of multiple tag when disabled |
| `multipleItemBorderColorDisabled` | `string` | Border color of multiple tag when disabled |
