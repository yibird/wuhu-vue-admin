---
title: Message
description: Display global messages as feedback in response to user operations.
---

## When To Use 
- To provide feedback such as success, warning, error etc.
- A message is displayed at top and center and will be dismissed automatically, as a non-interrupting light-weighted prompt.

## Demos

| Demo | Path |
| --- | --- |
| Hooks usage (recommended) | demo/hooks.md |
| Other types of message | demo/other.md |
| Customize duration | demo/duration.md |
| Message with loading indicator | demo/loading.md |
| Promise interface | demo/thenable.md |
| Customized style | demo/custom-style.md |
| Custom semantic dom styling | demo/style-class.md |
| Update Message Content | demo/update.md |
| Static method (deprecated) | demo/info.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Static Methods 
- `message.success(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.info(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.loading(content, [duration], onClose)`
- `message.open(config)`
- `message.destroy(key?: Key)`
- `message.config(options)`
- `message.useMessage(config)`

### Arguments 
| Argument | Description | Type | Default |
| --- | --- | --- | --- |
| content | The content of the message | VueNode \| ArgsProps | - |
| duration | Time(seconds) before auto-dismiss, don't dismiss if set to 0 | number | 3 |
| onClose | Specify a function that will be called when the message is closed | () =&gt; void | - |

`afterClose` can be called in thenable interface:

- `message[level](content, [duration]).then(afterClose)`
- `message[level](content, [duration], onClose).then(afterClose)`

where `level` refers one static methods of `message`. The result of `then` method will be a Promise.

### Config 
The properties of `config` are as follows:

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| class | Customized CSS class | string | - | - | ✓ |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | ArgsClassNamesType | - | - | ✓ |
| content | The content of the message | VueNode | - | - | × |
| duration | Time(seconds) before auto-dismiss, don't dismiss if set to 0 | number | 3 | - | × |
| icon | Customized Icon | VueNode | - | - | × |
| pauseOnHover | Keep the timer running or not on hover | boolean | true | - | × |
| key | The unique identifier of the Message | Key | - | - | × |
| style | Customized inline style | CSSProperties | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | ArgsStylesType | - | - | ✓ |
| type | Notice type | NoticeType | - | - | × |
| onClick | Specify a function that will be called when the message is clicked | (e: MouseEvent) =&gt; void | - | - | × |
| onClose | Specify a function that will be called when the message is closed | () =&gt; void | - | - | × |

### Global configuration 
`message.config(options)`

```js
message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
  rtl: true,
  prefixCls: 'my-message',
})
```

| Argument | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| duration | Time before auto-dismiss, in seconds | number | 3 | - | × |
| getContainer | Return the mount node for Message, but still display at fullScreen | () =&gt; HTMLElement \| ShadowRoot | () =&gt; document.body | - | × |
| maxCount | Max message show, drop oldest if exceed limit | number | - | - | × |
| prefixCls | The prefix class name of message node | string | `ant-message` | - | × |
| rtl | Whether to enable RTL mode | boolean | false | - | × |
| top | Distance from top | string \| number | 8 | - | × |
| transitionName | Animation name | string | - | - | × |
| pauseOnHover | Keep the timer running or not on hover | boolean | true | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | ArgsClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | ArgsStylesType | - | - | ✓ |

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

### Why I can not access context, ConfigProvider `locale/prefixCls/theme` in message? 
Calling `message` methods will render a new instance which does not inherit the current context. When you need context info, use `message.useMessage` to get `api` and `ContextHolder`, then render it inside your component tree:

```vue
<script setup>
import { message } from 'antdv-next'

const [api, ContextHolder] = message.useMessage()
</script>

<template>
  <ContextHolder />
</template>
```

**Note:** You must insert `ContextHolder` into your children with hooks. You can use static methods if you do not need context connection.

> [App Package Component](../app/docs.md) can be used to simplify `useMessage` and other methods that need to manually implant ContextHolder.

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

Then `message.info`, `message.success` and other static methods will render with that wrapped context.

### How to set static methods prefixCls? 
You can config with [`ConfigProvider.config`](../config-provider/docs.md#configproviderconfig-4130).
