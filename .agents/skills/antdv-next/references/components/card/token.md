# card Token

Use these variables through `theme.components.Card`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Card: {
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
| `headerBg` | `string` | Background color of card header |
| `headerFontSize` | `string \| number` | Font size of card header |
| `headerFontSizeSM` | `string \| number` | Font size of small card header |
| `headerHeight` | `string \| number` | Height of card header |
| `headerHeightSM` | `string \| number` | Height of small card header |
| `bodyPaddingSM` | `number` | Padding of small card body |
| `headerPaddingSM` | `number` | Padding of small card head |
| `bodyPadding` | `number` | Padding of card body |
| `headerPadding` | `number` | Padding of card head |
| `actionsBg` | `string` | Background color of card actions |
| `actionsLiMargin` | `string` | Margin of each item in card actions |
| `tabsMarginBottom` | `number` | Margin bottom of tabs component |
| `extraColor` | `string` | Text color of extra area |
