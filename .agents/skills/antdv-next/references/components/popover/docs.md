---
title: Popover
description: The floating card pops up when clicking/mouse hovering over an element.
---

## When To Use

A simple popup card to provide extra information or operations.

Comparing with `Tooltip`, besides information `Popover` card can also provide action elements like links and buttons.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Three ways to trigger | demo/trigger-type.md |
| Placement | demo/placement.md |
| Arrow | demo/arrow.md |
| Auto Shift | demo/shift.md |
| Controlling the close of the dialog | demo/control.md |
| Hover with click popover | demo/hover-with-click.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| title | Title of the card | VueNode | - | - | × |
| content | Content of the card | VueNode | - | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function | PopoverClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | PopoverStylesType | - | - | ✓ |

Popover also supports all Tooltip props. See [Tooltip](../tooltip/docs.md#api).

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Callback when popover visibility changes | (open: boolean, e?: MouseEvent \| KeyboardEvent) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | Title of the card | () =&gt; any | - |
| content | Content of the card | () =&gt; any | - |

## Note

Please ensure that the child node of `Popover` can accept `mouseenter`, `mouseleave`, `focus`, `click` events.

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

For more questions, please refer to [Tooltip FAQ](../tooltip/docs.md#faq).
