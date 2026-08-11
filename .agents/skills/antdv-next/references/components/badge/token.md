# badge Token

Use these variables through `theme.components.Badge`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Badge: {
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
| `indicatorZIndex` | `string \| number` | z-index of badge |
| `indicatorHeight` | `string \| number` | Height of badge |
| `indicatorHeightSM` | `string \| number` | Height of small badge |
| `dotSize` | `number` | Size of dot badge |
| `textFontSize` | `number` | Font size of badge text |
| `textFontSizeSM` | `number` | Font size of small badge text |
| `textFontWeight` | `string \| number` | Font weight of badge text |
| `statusSize` | `number` | Size of status badge |
| `paddingInline` | `string \| number` | Inline padding of badge |
