---
title: Checkbox
description: Collect user's choices.
---

## When To Use 
## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Disabled | demo/disabled.md |
| Controlled Checkbox | demo/controller.md |
| Checkbox Group | demo/group.md |
| Check all | demo/check-all.md |
| Use with Grid | demo/layout.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Checkbox

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| checked | Specifies whether the checkbox is selected, support `v-model:checked` | string \| number \| boolean \| object | false | - | × |
| checkedValue | The value when checked | string \| number \| boolean \| object | true | - | × |
| defaultChecked | Whether to set the initial state | string \| number \| boolean \| object | false | - | × |
| disabled | If disable checkbox | boolean | false | - | × |
| indeterminate | The indeterminate checked state of checkbox | boolean | false | - | × |
| unCheckedValue | The value when unchecked | string \| number \| boolean \| object | false | - | × |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes | (e: CheckboxChangeEvent) =&gt; void | - |
| focus | Called when entering the component | function() | - |
| blur | Called when leaving the component | function() | - |

### CheckboxGroup

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| options | Specifies options | string\[] \| number\[] \| Option\[] | \[] | - |
| disabled | If disable all checkboxes | boolean | false | - |
| name | The `name` property of all `input[type="checkbox"]` children | string | - | - |
| value | Used for setting the currently selected value, support `v-model:value` | (string \| number \| boolean)\[] | \[] | - |
| labelRender | - | (params: &#123; item: CheckboxOptionType, index: number &#125;) =&gt; any | - | - |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes | (checkedValue: T[]) =&gt; void | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| labelRender | - | (params: &#123; item: CheckboxOptionType, index: number &#125;) =&gt; any | - |

## Semantic DOM 
| _semantic | demo/_semantic.md |
