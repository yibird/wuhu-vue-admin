# pagination Token

Use these variables through `theme.components.Pagination`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Pagination: {
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
| `itemBg` | `string` | Background color of Pagination item |
| `itemSize` | `number` | Size of Pagination item |
| `itemSizeSM` | `number` | Size of small Pagination item |
| `itemSizeLG` | `number` | Size of large Pagination item |
| `itemActiveBg` | `string` | Background color of active Pagination item |
| `itemActiveColor` | `string` | Text color of active Pagination item |
| `itemActiveColorHover` | `string` | Text color of active Pagination item hover |
| `itemLinkBg` | `string` | Background color of Pagination item link |
| `itemActiveBgDisabled` | `string` | Background color of disabled active Pagination item |
| `itemActiveColorDisabled` | `string` | Text color of disabled active Pagination item |
| `itemInputBg` | `string` | Background color of input |
| `miniOptionsSizeChangerTop` | `number` | Top of Pagination size changer |
