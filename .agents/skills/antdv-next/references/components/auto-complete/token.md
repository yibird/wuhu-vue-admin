# auto-complete Token

Use these variables through `theme.components.Select`. This document lists definitions only and does not include values.

This directory reuses the `Select` component theme configuration.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Select: {
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
| `zIndexPopup` | `number` | z-index of dropdown |
| `optionSelectedColor` | `string` | Text color when option is selected |
| `optionSelectedFontWeight` | `CSSProperties` | Font weight when option is selected |
| `optionSelectedBg` | `string` | Background color when option is selected |
| `optionActiveBg` | `string` | Background color when option is active |
| `optionPadding` | `CSSProperties` | Padding of option |
| `optionFontSize` | `number` | Font size of option |
| `optionLineHeight` | `CSSProperties` | Line height of option |
| `optionHeight` | `number` | Height of option |
| `selectorBg` | `string` | Background color of selector |
| `clearBg` | `string` | Background color of clear button |
| `singleItemHeightLG` | `number` | Height of single selected item with large size |
| `showArrowPaddingInlineEnd` | `number` | Inline end padding of arrow |
| `hoverBorderColor` | `string` | Hover border color |
| `activeBorderColor` | `string` | Active border color |
| `activeOutlineColor` | `string` | Active outline color |
| `multipleItemBg` | `string` | Background color of multiple tag |
| `multipleItemBorderColor` | `string` | Border color of multiple tag |
| `multipleItemHeight` | `number` | Height of multiple tag |
| `multipleItemHeightSM` | `number` | Height of multiple tag with small size |
| `multipleItemHeightLG` | `number` | Height of multiple tag with large size |
| `multipleSelectorBgDisabled` | `string` | Background color of multiple selector when disabled |
| `multipleItemColorDisabled` | `string` | Text color of multiple tag when disabled |
| `multipleItemBorderColorDisabled` | `string` | Border color of multiple tag when disabled |
