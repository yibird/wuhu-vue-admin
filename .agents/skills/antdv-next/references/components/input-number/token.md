# input-number Token

Use these variables through `theme.components.InputNumber`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      InputNumber: {
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
| `controlWidth` | `number` | Width of input |
| `handleWidth` | `number` | Width of control button |
| `handleFontSize` | `number` | Icon size of control button |
| `handleVisible` | `true \| "auto"` | Handle visible |
| `handleBg` | `string` | Background color of handle |
| `handleActiveBg` | `string` | Active background color of handle |
| `handleHoverColor` | `string` | Hover color of handle |
| `handleBorderColor` | `string` | Border color of handle |
| `filledHandleBg` | `string` | Background color of handle in filled variant |
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
