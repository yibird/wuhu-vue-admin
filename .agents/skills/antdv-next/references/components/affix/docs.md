---
title: Affix
description: Stick an element to the viewport.
---

## When To Use 
On longer web pages, it's helpful to stick component into the viewport. This is common for menus and actions.

Please note that Affix should not cover other content on the page, especially when the size of the viewport is small.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Callback | demo/on-change.md |
| Container to scroll. | demo/target.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| offsetTop | Offset from the top of the viewport (in pixels) | number | 0 | - | × |
| offsetBottom | Offset from the bottom of the viewport (in pixels) | number | - | - | × |
| target | Specifies the scrollable area DOM node | () =&gt; Window \| HTMLElement \| null | () =&gt; window | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback for when Affix state is changed | (affixed?: boolean) =&gt; void | - |

### Methods

| Method | Description | Type | Version |
| --- | --- | --- | --- |
| updatePosition | - | ReturnType&lt;typeof throttleByAnimationFrame&gt; | - |

**Note:** Children of `Affix` must not have the property `position: absolute`, but you can set `position: absolute` on `Affix` itself:

```html
<a-affix style="position: absolute;top: y; left: x">...</a-affix>
```

## FAQ

### When binding container with `target` in Affix, elements sometimes move out of the container. 
We only listen to container scroll events for performance consideration. You can add custom listeners if you still want to: <https://codesandbox.io/s/stupefied-maxwell-ophqnm?file=/index.js>

Related issues：[#3938](https://github.com/ant-design/ant-design/issues/3938) [#5642](https://github.com/ant-design/ant-design/issues/5642) [#16120](https://github.com/ant-design/ant-design/issues/16120)

### When Affix is ​​used in a horizontal scroll container, the position of the element `left` is incorrect. 
Affix is ​​generally only applicable to areas with one-way scrolling, and only supports usage in vertical scrolling containers. If you want to use it in a horizontal container, you can consider implementing with the native `position: sticky` property.

Related issues：[#29108](https://github.com/ant-design/ant-design/issues/29108)
