# slider Token

Use these variables through `theme.components.Slider`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Slider: {
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
| `controlSize` | `number` | Height of slider |
| `railSize` | `number` | Height of rail |
| `handleSize` | `number` | Size of handle |
| `handleSizeHover` | `number` | Size of handle when hover |
| `handleLineWidth` | `string \| number` | Border width of handle |
| `handleLineWidthHover` | `string \| number` | Border width of handle when hover |
| `dotSize` | `number` | Size of dot |
| `railBg` | `string` | Background color of rail |
| `railHoverBg` | `string` | Background color of rail when hover |
| `trackBg` | `string` | Background color of track |
| `trackHoverBg` | `string` | Background color of track when hover |
| `handleColor` | `string` | Color of handle |
| `handleActiveColor` | `string` | Border color of handle when active |
| `handleActiveOutlineColor` | `string` | Outline color of handle when active |
| `handleColorDisabled` | `string` | Color of handle when disabled |
| `dotBorderColor` | `string` | Border color of dot |
| `dotActiveBorderColor` | `string` | Border color of dot when active |
| `trackBgDisabled` | `string` | Background color of track when disabled |
