# steps Token

Use these variables through `theme.components.Steps`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Steps: {
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
| `customIconSize` | `number` | Size of custom icon container |
| `customIconTop` | `number` | Top of custom icon |
| `customIconFontSize` | `number` | Font size of custom icon |
| `iconSize` | `number` | Size of icon container |
| `iconTop` | `number` | Top of icon |
| `iconFontSize` | `number` | Size of icon |
| `dotSize` | `number` | Size of dot |
| `dotCurrentSize` | `number` | Current size of dot |
| `navArrowColor` | `string` | Color of arrow in nav |
| `navContentMaxWidth` | `CSSProperties` | Max width of nav content |
| `iconSizeSM` | `string \| number` | Size of small steps icon |
