---
title: Space
description: Set components spacing.
---

## When To Use

- Avoid components clinging together and set a unified space.
- Use Space.Compact when child form components are compactly connected and the border is collapsed.

### Difference with Flex component

- Space is used to set the spacing between inline elements. It will add a wrapper element for each child element for inline alignment. Suitable for equidistant arrangement of multiple child elements in rows and columns.
- Flex is used to set the layout of block-level elements. It does not add a wrapper element. Suitable for layout of child elements in vertical or horizontal direction, and provides more flexibility and control.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| Vertical Space | demo/vertical.md |
| Space Size | demo/size.md |
| Align | demo/align.md |
| Wrap | demo/wrap.md |
| Separator | demo/separator.md |
| Compact Mode for form component | demo/compact.md |
| Button Compact Mode | demo/compact-buttons.md |
| Vertical Compact Mode | demo/compact-button-vertical.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Space

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| align | Align items | `start` \| `end` \| `center` \| `baseline` | - | 4.2.0 | × |
| orientation | The space direction | `vertical` \| `horizontal` | `horizontal` | - | × |
| separator | Set separator | VueNode | - | - | × |
| size | The space size | [Size](#size) \| [[Size](#size), [Size](#size)] | `small` | 4.1.0 \| Array: 4.9.0 | ✓ |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false | - | × |
| wrap | Auto wrap line, when `horizontal` effective | boolean | false | 4.9.0 | × |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| separator | Set separator | () =&gt; VueNode | - |

### Size

`'small' | 'middle' | 'large' | number`

### SpaceCompact

Use Space.Compact when child form components are compactly connected and the border is collapsed. The supported components are:

- Button
- AutoComplete
- Cascader
- DatePicker
- Input/Input.Search
- InputNumber
- Select
- TimePicker
- TreeSelect

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent's width | boolean | false | 4.24.0 |
| orientation | Set direction of layout | `vertical` \| `horizontal` | `horizontal` | - |
| size | Set child component size | `large` \| `middle` \| `small` | `middle` | 4.24.0 |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false | - |

## Semantic DOM

| _semantic | demo/_semantic.md |
