---
title: Popconfirm
description: Pop up a bubble confirmation box for an action.
---

## When To Use

A simple and compact dialog used for asking for user confirmation.

The difference with the `confirm` modal dialog is that it's more lightweight than the static popped full-screen confirm modal.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Locale text | demo/locale.md |
| Placement | demo/placement.md |
| Auto Shift | demo/shift.md |
| Conditional trigger | demo/dynamic-trigger.md |
| Customize icon | demo/icon.md |
| Asynchronously close | demo/async.md |
| Asynchronously close on Promise | demo/promise.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| cancelButtonProps | The cancel button props | ButtonProps | - | - | × |
| cancelText | The text of the Cancel button | VueNode | `Cancel` | - | × |
| disabled | Whether to show popconfirm when clicking its children node | boolean | false | - | × |
| icon | Customize icon of confirmation | VueNode | &lt;ExclamationCircleFilled /&gt; | - | × |
| okButtonProps | The ok button props | ButtonProps | - | - | × |
| okText | The text of the Confirm button | VueNode | `OK` | - | × |
| okType | Button `type` of the Confirm button | LegacyButtonType | `primary` | - | × |
| showCancel | Show cancel button | boolean | true | - | × |
| title | The title of the confirmation box | VueNode | - | - | × |
| description | The description of the confirmation box | VueNode | - | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function | PopconfirmClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | PopconfirmStylesType | - | - | ✓ |

Popconfirm also supports all Popover props. See [Popover](../popover/docs.md#api).

### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Callback when popconfirm visibility changes | (open: boolean, e?: MouseEvent \| KeyboardEvent) =&gt; void | - |
| confirm | Callback of confirmation | (e?: MouseEvent) =&gt; void | - |
| cancel | Callback of cancel | (e?: MouseEvent) =&gt; void | - |
| popupClick | Callback of popup click | (e: MouseEvent) =&gt; void | - |

### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | The title of the confirmation box | () =&gt; any | - |
| description | The description of the confirmation box title | () =&gt; any | - |
| icon | Customize icon of confirmation | () =&gt; any | - |
| okText | The text of the Confirm button | () =&gt; any | - |
| cancelText | The text of the Cancel button | () =&gt; any | - |

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

For more questions, please refer to [Tooltip FAQ](../tooltip/docs.md#faq).
