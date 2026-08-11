# form Token

Use these variables through `theme.components.Form`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Form: {
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
| `labelRequiredMarkColor` | `string` | Required mark color |
| `labelColor` | `string` | Label color |
| `labelFontSize` | `number` | Label font size |
| `labelHeight` | `string \| number` | Label height |
| `labelColonMarginInlineStart` | `number` | Label colon margin-inline-start |
| `labelColonMarginInlineEnd` | `number` | Label colon margin-inline-end |
| `itemMarginBottom` | `number` | Form item margin bottom |
| `inlineItemMarginBottom` | `number` | Inline layout form item margin bottom |
| `verticalLabelPadding` | `CSSProperties` | Vertical layout label padding |
| `verticalLabelMargin` | `CSSProperties` | Vertical layout label margin |
