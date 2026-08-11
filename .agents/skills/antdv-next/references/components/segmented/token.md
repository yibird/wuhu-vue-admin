# segmented Token

Use these variables through `theme.components.Segmented`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Segmented: {
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
| `itemColor` | `string` | Text color of item |
| `itemHoverColor` | `string` | Text color of item when hover |
| `itemHoverBg` | `string` | Background color of item when hover |
| `itemActiveBg` | `string` | Background color of item when active |
| `itemSelectedBg` | `string` | Background color of item when selected |
| `itemSelectedColor` | `string` | Text color of item when selected |
| `trackPadding` | `string \| number` | Padding of Segmented container |
| `trackBg` | `string` | Background of Segmented container |
