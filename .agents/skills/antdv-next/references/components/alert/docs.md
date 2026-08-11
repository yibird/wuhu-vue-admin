---
title: Alert
description: Display warning messages that require attention.
---

## When To Use 
- When you need to show alert messages to users.
- When you need a persistent static container which is closable by user actions.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| More types | demo/style.md |
| Closable | demo/closable.md |
| Description | demo/description.md |
| Icon | demo/icon.md |
| Banner | demo/banner.md |
| Loop Banner | demo/loop-banner.md |
| Smoothly Unmount | demo/smooth-closed.md |
| Custom Icon | demo/custom-icon.md |
| Custom action | demo/action.md |
| Component Token | demo/component-token.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Props 
Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| type | Type of Alert styles, options: `success`, `info`, `warning`, `error` | 'success' \| 'info' \| 'warning' \| 'error' | `info`, in `banner` mode default is `warning` | - | × |
| closable | The config of closable, &gt;=5.15.0: support `aria-*` | ClosableType | `false` | - | ✓ |
| title | Content of Alert | VueNode | - | - | × |
| message | Content of Alert, please use `title` instead | VueNode | - | - | × |
| description | Additional content of Alert | VueNode | - | - | × |
| afterClose | Called when close animation is finished, please use `closable.afterClose` instead | () =&gt; void | - | - | × |
| showIcon | Whether to show icon | boolean | false, in `banner` mode default is true | - | × |
| role | https://www.w3.org/TR/2014/REC-html5-20141028/dom.html#aria-role-attribute | string | - | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function | AlertClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | AlertStylesType | - | - | ✓ |
| banner | Whether to show as banner | boolean | false | - | × |
| icon | Custom icon, effective when `showIcon` is true | VueNode | - | - | × |
| successIcon | (Only supports global configuration) Custom success icon in Alert icon | VueNode | - | - | ✓ |
| infoIcon | (Only supports global configuration) Custom info icon in Alert icon | VueNode | - | - | ✓ |
| warningIcon | (Only supports global configuration) Custom warning icon in Alert icon | VueNode | - | - | ✓ |
| errorIcon | (Only supports global configuration) Custom error icon in Alert icon | VueNode | - | - | ✓ |
| closeIcon | - | VueNode | - | - | ✓ |
| action | The action of Alert | VueNode | - | 4.9.0 | × |
| id | - | string | - | - | × |

### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| close | Callback when close Alert | (e: any) =&gt; any | - |
| mouseenter | - | (e: any) =&gt; any | - |
| mouseleave | - | (e: any) =&gt; any | - |
| click | - | (e: any) =&gt; any | - |

### Slots 
| Slot        | Description | Type | Version |
|-------------| --- | --- | --- |
| message     | Content of Alert, please use `title` instead | () =&gt; any | - |
| title       | Content of Alert| () =&gt; any | - |
| description | Additional content of Alert | () =&gt; any | - |
| icon        | Custom icon, effective when `showIcon` is true | () =&gt; any | - |
| closeIcon   | - | () =&gt; any | - |
| action      | The action of Alert | () =&gt; any | 4.9.0 |

## Semantic DOM

| _semantic | demo/_semantic.md |
