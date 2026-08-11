# tree-select Token

Use these variables through `theme.components.TreeSelect`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      TreeSelect: {
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
| `titleHeight` | `number` | Node title height |
| `switcherSize` | `number \| undefined` | Switcher width of tree |
| `indentSize` | `number \| undefined` | Indent width of tree |
| `nodeHoverBg` | `string` | Background color of hovered node |
| `nodeHoverColor` | `string` | Text color of hovered node |
| `nodeSelectedBg` | `string` | Background color of selected node |
| `nodeSelectedColor` | `string` | Text color of selected node |
