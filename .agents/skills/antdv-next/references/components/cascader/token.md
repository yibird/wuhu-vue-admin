# cascader Token

Use these variables through `theme.components.Cascader`. This document lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Cascader: {
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
| `controlWidth` | `string \| number` | Width of Cascader |
| `controlItemWidth` | `string \| number` | Width of item |
| `dropdownHeight` | `string \| number` | Height of dropdown |
| `optionSelectedBg` | `string` | Background color of selected item |
| `optionSelectedColor` | `string` | Text color when option is selected |
| `optionSelectedFontWeight` | `CSSProperties` | Font weight of selected item |
| `optionPadding` | `CSSProperties` | Padding of menu item |
| `menuPadding` | `CSSProperties` | Padding of menu item (single column) |
