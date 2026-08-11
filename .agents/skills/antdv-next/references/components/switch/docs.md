---
title: Switch
description: Used to toggle between two states.
---

## When To Use 
- If you need to represent the switching between two states or on-off state.
- The difference between `Switch` and `Checkbox` is that `Switch` will trigger a state change directly when you toggle it, while `Checkbox` is generally used for state marking, which should work in conjunction with submit operation.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Disabled | demo/disabled.md |
| Text & icon | demo/text.md |
| Two sizes | demo/size.md |
| Loading | demo/loading.md |
| Custom component token | demo/component-token.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| autoFocus | Auto focus when component mounted | boolean | false | - | × |
| checked | Determine whether the Switch is checked, support `v-model:checked` | string \| number \| boolean \| object | false | - | × |
| checkedChildren | The content to be shown when the state is checked | VueNode | - | - | × |
| checkedValue | The value when checked | string \| number \| boolean \| object | true | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function | SwitchClassNamesType | - | - | ✓ |
| defaultChecked | Whether to set the initial state | string \| number \| boolean \| object | false | - | × |
| defaultValue | Alias for `defaultChecked` | string \| number \| boolean \| object | - | 5.12.0 | × |
| disabled | Disable switch | boolean | false | - | × |
| loading | Loading state of switch | boolean | false | - | × |
| size | The size of the Switch, options: `default` `small` | `default` \| `small` | `default` | - | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | SwitchStylesType | - | - | ✓ |
| unCheckedChildren | The content to be shown when the state is unchecked | VueNode | - | - | × |
| unCheckedValue | The value when unchecked | string \| number \| boolean \| object | false | - | × |
| value | Alias for `checked`, support `v-model:value` | string \| number \| boolean \| object | - | 5.12.0 | × |

### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Trigger when the checked state is changing | (checked: boolean, event: Event) =&gt; void | - |
| click | Trigger when clicked | (checked: boolean, event: Event) =&gt; void | - |

### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| checkedChildren | The content to be shown when the state is checked | () =&gt; VueNode | - |
| unCheckedChildren | The content to be shown when the state is unchecked | () =&gt; VueNode | - |

### Methods 
| Name | Description | Version |
| --- | --- | --- |
| blur() | Remove focus | - |
| focus() | Get focus | - |

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

### Why not work in Form.Item? 
Form.Item default bind value to `value` property, but Switch value property is `checked`. You can use `v-model:checked` to change bind property.

```vue
<a-form-item name="fieldA">
  <a-switch v-model:checked="form.fieldA" />
</a-form-item>
```
