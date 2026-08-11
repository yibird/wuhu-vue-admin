# mentions Token

Use these variables through `theme.components.Mentions`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Mentions: {
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
| `zIndexPopup` | `number` | z-index of popup |
| `dropdownHeight` | `string \| number` | Height of popup |
| `controlItemWidth` | `string \| number` | Height of menu item |
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
