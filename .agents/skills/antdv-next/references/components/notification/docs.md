---
title: Notification
description: Prompt notification message globally.
---

## When To Use 
To display a notification message at any of the four corners of the viewport. Typically it can be used in the following cases:

- A notification with complex content.
- A notification providing a feedback based on the user interaction. Or it may show some details about upcoming steps the user may have to follow.
- A notification that is pushed by the application.

## Demos

| Demo | Path |
| --- | --- |
| Hooks usage (recommended) | demo/hooks.md |
| Duration after which the notification box is closed | demo/duration.md |
| Notification with icon | demo/with-icon.md |
| Custom close button | demo/with-btn.md |
| Customized icon | demo/custom-icon.md |
| Placement | demo/placement.md |
| Customized style | demo/custom-style.md |
| Update message content | demo/update.md |
| Stack | demo/stack.md |
| Show with progress | demo/show-with-progress.md |
| Static method (deprecated) | demo/basic.md |
| Customize progress bar color | demo/progress-color.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Static Methods 
- `notification.success(config)`
- `notification.error(config)`
- `notification.info(config)`
- `notification.warning(config)`
- `notification.open(config)`
- `notification.destroy(key?: Key)`
- `notification.config(options)`
- `notification.useNotification(config)`

### ArgsProps 
The properties of `config` are as follows:

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| title | The title of notification box | VueNode | - | - | × |
| description | The content of notification box | VueNode | - | - | × |
| actions | Customized button group | VueNode | - | - | × |
| key | The unique identifier of the Notification | Key | - | - | × |
| duration | Time in seconds before Notification is closed. When set to `0` or `false`, it will never be closed automatically | number \| false | 4.5 | - | × |
| showProgress | Show progress bar for auto-closing notification | boolean | - | - | × |
| pauseOnHover | Keep the timer running or not on hover | boolean | true | - | × |
| icon | Customized icon | VueNode | - | - | × |
| placement | Position of Notification, can be one of `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | NotificationPlacement | `topRight` | - | × |
| class | Customized CSS class | string | - | - | ✓ |
| style | Customized inline style | CSSProperties | - | - | ✓ |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | NotificationClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | NotificationStylesType | - | - | ✓ |
| type | Notification type | IconType | - | - | × |
| onClick | Specify a function that will be called when the notification is clicked | () =&gt; void | - | - | × |
| onClose | Trigger when notification closed | () =&gt; void | - | - | × |
| closeIcon | Custom close icon. Set to null or false to hide close button | VueNode | true | - | ✓ |
| closable | Whether to show close button | boolean \| ClosableType | true | - | × |
| props | Props passed to the notification `div`, supports `data-testid`, `aria-*`, or `role` | DivProps | - | - | × |
| role | The semantics of notification content recognized by screen readers | 'alert' \| 'status' | `alert` | - | × |

### notification.useNotification 
The properties of `config` are as follows:

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| top | Distance from the top of the viewport, when `placement` is `top` `topRight` or `topLeft` (unit: pixels) | number | 24 | - | × |
| bottom | Distance from the bottom of the viewport, when `placement` is `bottom` `bottomRight` or `bottomLeft` (unit: pixels) | number | 24 | - | × |
| placement | Position of Notification, can be one of `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | NotificationPlacement | `topRight` | - | × |
| getContainer | Return the mount node for Notification | () =&gt; HTMLElement \| ShadowRoot | () =&gt; document.body | - | × |
| duration | Time in seconds before Notification is closed. When set to `0` or `false`, it will never be closed automatically | number \| false | 4.5 | - | × |
| maxCount | Max Notification show, drop oldest if exceed limit | number | - | - | × |
| rtl | Whether to enable RTL mode | boolean | false | - | × |
| stack | Notifications will be stacked when amount is over threshold | boolean \| &#123; threshold?: number &#125; | &#123; threshold: 3 &#125; | - | × |
| showProgress | Show progress bar for auto-closing notification | boolean | - | - | × |
| pauseOnHover | Keep the timer running or not on hover | boolean | true | - | × |
| closeIcon | Custom close icon. Set to null or false to hide close button | VueNode | true | - | ✓ |
| prefixCls | - | string | `ant-notification` | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | NotificationClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | NotificationStylesType | - | - | ✓ |

### ClosableType 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| closeIcon | Custom close icon | VueNode | - | - |
| onClose | Trigger when notification close | () =&gt; void | - | - |
| disabled | Whether the close button is disabled | boolean | - | - |

### Global configuration 
`notification.config(options)`

```js
notification.config({
  placement: 'bottomRight',
  bottom: 50,
  duration: 3,
  rtl: true,
})
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| top | Distance from the top of the viewport, when `placement` is `top` `topRight` or `topLeft` (unit: pixels) | number | 24 | - |
| bottom | Distance from the bottom of the viewport, when `placement` is `bottom` `bottomRight` or `bottomLeft` (unit: pixels) | number | 24 | - |
| duration | Time in seconds before Notification is closed. When set to `0` or `false`, it will never be closed automatically | number \| false | 4.5 | - |
| showProgress | Show progress bar for auto-closing notification | boolean | - | - |
| pauseOnHover | Keep the timer running or not on hover | boolean | true | - |
| prefixCls | - | string | `ant-notification` | - |
| getContainer | Return the mount node for Notification | () =&gt; HTMLElement \| ShadowRoot | () =&gt; document.body | - |
| placement | Position of Notification, can be one of `top` \| `topLeft` \| `topRight` \| `bottom` \| `bottomLeft` \| `bottomRight` | NotificationPlacement | `topRight` | - |
| closeIcon | Custom close icon. Set to null or false to hide close button | VueNode | true | - |
| closable | Whether to show close button | ClosableType | - | - |
| rtl | Whether to enable RTL mode | boolean | false | - |
| maxCount | Max Notification show, drop oldest if exceed limit | number | - | - |
| props | Props passed to the notification `div`, supports `data-testid`, `aria-*`, or `role` | DivProps | - | - |

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

### Why I can not access context, ConfigProvider `locale/prefixCls/theme` in notification? 
Calling `notification` methods will render a new instance which does not inherit the current context. When you need context info, use `notification.useNotification` to get `api` and `ContextHolder`, then render it inside your component tree:

```vue
<script setup>
import { notification } from 'antdv-next'

const [api, ContextHolder] = notification.useNotification()
</script>

<template>
  <ContextHolder />
</template>
```

**Note:** You must insert `ContextHolder` into your children with hooks. You can use static methods if you do not need context connection.

> [App Package Component](../app/docs.md) can be used to simplify `useNotification` and other methods that need to manually implant ContextHolder.

If you still need to use static methods and want them to read `locale`, `theme`, or other ConfigProvider settings, configure a global `holderRender` once:

```ts
import { App, ConfigProvider } from 'antdv-next'
import { h } from 'vue'
import zhCN from 'antdv-next/locale/zh_CN'

ConfigProvider.config({
  holderRender: children =>
    h(ConfigProvider, { locale: zhCN }, {
      default: () => h(App, null, () => children),
    }),
})
```

Then `notification.open`, `notification.success` and other static methods will render with that wrapped context.

### How to set static methods prefixCls? 
You can config with [`ConfigProvider.config`](../config-provider/docs.md#configproviderconfig-4130).
