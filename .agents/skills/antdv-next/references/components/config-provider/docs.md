---
title: ConfigProvider
description: Provide a uniform configuration support for components.
---

## When To Use

Provide global configuration for components, such as locale, direction, size, theme, or wave effect.

## Usage

This component provides a configuration to all Vue components underneath itself via provide/inject.

```vue
<template>
  <a-config-provider direction="rtl">
    <App />
  </a-config-provider>
</template>
```

### Content Security Policy 
Some components use dynamic style to support wave effect. You can config `csp` prop if Content Security Policy (CSP) is enabled:

```vue
<template>
  <a-config-provider :csp="{ nonce: 'YourNonceCode' }">
    <a-button>My Button</a-button>
  </a-config-provider>
</template>
```

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Locale | demo/locale.md |
| Direction | demo/direction.md |
| Component size | demo/size.md |
| Theme | demo/theme.md |
| Custom Wave | demo/wave.md |
| Static function | demo/holder-render.md |
| useConfig | demo/use-config.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | Config antd component `disabled` | boolean | - | - |
| componentSize | Config antd component size | `small` \| `middle` \| `large` | - | - |
| csp | Set [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config | CSPConfig | - | - |
| direction | Set direction of layout. See [demo](#config-provider-demo-direction) | `ltr` \| `rtl` | `ltr` | - |
| getPopupContainer | To set the container of the popup element. The default is to create a `div` element in `body` | `(trigger?: HTMLElement) => HTMLElement \| ShadowRoot` | () => document.body | - |
| getTargetContainer | Config Affix, Anchor scroll target container | `() => HTMLElement \| Window \| ShadowRoot` | () => window | - |
| iconPrefixCls | Set icon prefix className | string | `anticon` | - |
| locale | Language package setting, you can find the packages in [antd/locale](http://unpkg.com/antd/locale/) | Locale | - | - |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | - | - |
| popupOverflow | Select like component popup logic. Can set to show in viewport or follow window scroll | `viewport` \| `scroll` | `viewport` | - |
| prefixCls | Set prefix className | string | `ant` | - |
| renderEmpty | Set empty content of components. Ref [Empty](../empty/docs.md/) | (componentName?: string) => VueNode | - | - |
| variant | Set variant of data entry components | `outlined` \| `filled` \| `borderless` \| `underlined` | - | - |
| virtual | Disable virtual scroll when set to `false` | boolean | - | - |
| warning | Config warning level, when `strict` is `false`, it will aggregate deprecated information into a single message | WarningContextProps | - | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| renderEmpty | Set empty content of components. Ref [Empty](../empty/docs.md/) | (componentName?: string) => any | - |

### ConfigProvider.config() 
Setting `Modal`, `Message`, `Notification` static config. Does not work on hooks.

```ts
import { App, ConfigProvider } from 'antdv-next'
import { h } from 'vue'

ConfigProvider.config({
  holderRender: children => h(
    ConfigProvider,
    {
      prefixCls: 'ant',
      iconPrefixCls: 'anticon',
      theme: { token: { colorPrimary: 'red' } },
    },
    () => h(App, null, () => children),
  ),
})
```

### useConfig() 
Get the value of the parent `Provider`, such as `DisabledContextProvider`, `SizeContextProvider`.

```ts
import { useConfig } from 'antdv-next/config-provider/context'

const config = useConfig()
const { componentDisabled, componentSize } = config.value
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| componentDisabled | antd component disabled state | boolean | - | - |
| componentSize | antd component size state | `small` \| `middle` \| `large` | - | - |

### Component Config

The following config keys set common props for corresponding components or global effects. See the related APIs for details:

- `alert`: [Alert](../alert/docs.md#api)
- `anchor`: [Anchor](../anchor/docs.md#api)
- `app`: [App](../app/docs.md#api)
- `avatar`: [Avatar](../avatar/docs.md#api)
- `badge`: [Badge](../badge/docs.md#api)
- `borderBeam`: [BorderBeam](../border-beam/docs.md#api)
- `breadcrumb`: [Breadcrumb](../breadcrumb/docs.md#api)
- `button`: [Button](../button/docs.md#api)
- `calendar`: [Calendar](../calendar/docs.md#api)
- `card`: [Card](../card/docs.md#api)
- `cardMeta`: [Card.Meta](../card/docs.md#cardmeta)
- `carousel`: [Carousel](../carousel/docs.md#api)
- `cascader`: [Cascader](../cascader/docs.md#api)
- `checkbox`: [Checkbox](../checkbox/docs.md#api)
- `collapse`: [Collapse](../collapse/docs.md#api)
- `colorPicker`: [ColorPicker](../color-picker/docs.md#api)
- `datePicker`: [DatePicker](../date-picker/docs.md#api)
- `descriptions`: [Descriptions](../descriptions/docs.md#api)
- `divider`: [Divider](../divider/docs.md#api)
- `drawer`: [Drawer](../drawer/docs.md#api)
- `dropdown`: [Dropdown](../dropdown/docs.md#api)
- `empty`: [Empty](../empty/docs.md#api)
- `flex`: [Flex](../flex/docs.md#api)
- `floatButton`: [FloatButton](../float-button/docs.md#api)
- `floatButtonGroup`: [FloatButton.Group](../float-button/docs.md#floatbuttongroup)
- `form`: [Form](../form/docs.md#api)
- `image`: [Image](../image/docs.md#api)
- `input`: [Input](../input/docs.md#input)
- `inputNumber`: [InputNumber](../input-number/docs.md#api)
- `inputSearch`: [Input.Search](../input/docs.md#input-search)
- `layout`: [Layout](../layout/docs.md#api)
- `masonry`: [Masonry](../masonry/docs.md#api)
- `mentions`: [Mentions](../mentions/docs.md#api)
- `menu`: [Menu](../menu/docs.md#api)
- `message`: [Message](../message/docs.md#api)
- `modal`: [Modal](../modal/docs.md#api)
- `notification`: [Notification](../notification/docs.md#api)
- `otp`: [Input.OTP](../input/docs.md#input-otp)
- `pagination`: [Pagination](../pagination/docs.md#api)
- `popconfirm`: [Popconfirm](../popconfirm/docs.md#api)
- `popover`: [Popover](../popover/docs.md#api)
- `progress`: [Progress](../progress/docs.md#api)
- `qrcode`: [QRCode](../qr-code/docs.md#api)
- `radio`: [Radio](../radio/docs.md#api)
- `rangePicker`: [RangePicker](../date-picker/docs.md#rangepicker)
- `rate`: [Rate](../rate/docs.md#api)
- `result`: [Result](../result/docs.md#api)
- `ribbon`: [Badge.Ribbon](../badge/docs.md#api)
- `segmented`: [Segmented](../segmented/docs.md#api)
- `select`: [Select](../select/docs.md#api)
- `skeleton`: [Skeleton](../skeleton/docs.md#api)
- `slider`: [Slider](../slider/docs.md#api)
- `space`: [Space](../space/docs.md#api)
- `spin`: [Spin](../spin/docs.md#api)
- `splitter`: [Splitter](../splitter/docs.md#api)
- `statistic`: [Statistic](../statistic/docs.md#api)
- `steps`: [Steps](../steps/docs.md#api)
- `switch`: [Switch](../switch/docs.md#api)
- `table`: [Table](../table/docs.md#api)
- `tabs`: [Tabs](../tabs/docs.md#api)
- `tag`: [Tag](../tag/docs.md#api)
- `textArea`: [Input.TextArea](../input/docs.md#input-textarea)
- `timeline`: [Timeline](../timeline/docs.md#api)
- `timePicker`: [TimePicker](../time-picker/docs.md#api)
- `tooltip`: [Tooltip](../tooltip/docs.md#api)
- `tour`: [Tour](../tour/docs.md#api)
- `transfer`: [Transfer](../transfer/docs.md#api)
- `tree`: [Tree](../tree/docs.md#api)
- `treeSelect`: [TreeSelect](../tree-select/docs.md#api)
- `typography`: [Typography](../typography/docs.md#api)
- `upload`: [Upload](../upload/docs.md#api)
- `wave`: [WaveConfig](#api)

## FAQ

### How to contribute a new language? 
See [Adding new language](../../docs/vue/i18n.md).

### Date-related components locale is not working? 
See FAQ [Date-related-components-locale-is-not-working?](../../docs/vue/faq.md#date-related-components-locale-is-not-working)

### Modal throw error when setting `getPopupContainer`? 
Related issue: <https://github.com/ant-design/ant-design/issues/19974>

When you config `getPopupContainer` to parentNode globally, Modal will throw error of `triggerNode is undefined` because it did not have a triggerNode. You can try the fix below.

```diff
 <ConfigProvider
-  getPopupContainer={triggerNode => triggerNode.parentNode}
+  getPopupContainer={node => {
+    if (node) {
+      return node.parentNode
+    }
+    return document.body
+  }}
 >
   <App />
 </ConfigProvider>
```

### Why can't ConfigProvider props (like `prefixCls` and `theme`) affect VueNode inside `message.info`, `notification.open`, `Modal.confirm`? 
Static methods create independent instances which cannot consume ConfigProvider context. Please prefer the hooks or App-provided instances.

### Locale is not working with Vite in production mode? 
Related issue: [#39045](https://github.com/ant-design/ant-design/issues/39045)

In production mode of Vite, default exports from cjs file should be used like this: `enUS.default`. So you can directly import locale from `es/` directory like `import enUS from 'antdv-next/es/locale/en_US'` to make dev and production have the same behavior.

### `prefixCls` priority(The former is covered by the latter) 
1. ConfigProvider.config with prefixCls = prefix-1
2. ConfigProvider.config with holderRender (wraps ConfigProvider prefix-2)
3. message.config with prefixCls = prefix-3
