---
title: Anchor
description: Hyperlinks to scroll on one page.
---

## When To Use 
For displaying anchor hyperlinks on page and jumping between them.

> Notes for developers
>
> After version `4.24.0`, we rewrite Anchor use FC, Some methods of obtaining `ref` and calling internal instance methods will invalid.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Horizontal Anchor | demo/horizontal.md |
| Static Anchor | demo/static.md |
| Customize the onClick event | demo/onClick.md |
| Customize the anchor highlight | demo/customizeHighlight.md |
| Set Anchor scroll offset | demo/targetOffset.md |
| Listening for anchor link change | demo/onChange.md |
| Replace href in history | demo/replace.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Anchor

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- |---| --- | --- | --- |
| affix | Fixed mode of Anchor | boolean \| Omit&lt;AffixProps, 'offsetTop' \| 'target' \| 'children'&gt; | true | | × |
| bounds | Bounding distance of anchor area | number | 5 | - | × |
| getContainer | Scrolling container | () =&gt; HTMLElement | () =&gt; window | - | × |
| getCurrentAnchor | Customize the anchor highlight | (activeLink: string) =&gt; string | - | - | × |
| offsetTop | Pixels to offset from top when calculating position of scroll | number | - | - | × |
| showInkInFixed | Whether show ink-square when `affix={false}` | boolean| false | - | × |
| targetOffset | Anchor scroll offset, default as `offsetTop`, [example](#anchor-demo-targetoffset) | number | - | - | × |
| items | Data configuration option content, support nesting through children | &#123; key, href, title, target, children &#125;\[] [see](#anchoritem) | - |  | × |
| direction | Set Anchor direction | `vertical` \| `horizontal`| `vertical` |  | × |
| replace | Replace items' href in browser history instead of pushing it | boolean | false |  | × |

#### Events 
| Event | Description | Type                                                                 | Version |
| --- | --- |----------------------------------------------------------------------| --- |
| click | Set the handler to handle `click` event | (e: MouseEvent, link: &#123; title: VueNode, href: string &#125;) =&gt; void | - |
| change | Listening for anchor link change | (currentActiveLink: string) =&gt; void                               | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| item | Customize anchor item rendering | (item: AnchorItem) =&gt; any | - |

## Types

### AnchorItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | The unique identifier of the Anchor Link | string \| number | - | - |
| href | The target of hyperlink | string | - | - |
| target | Specifies where to display the linked URL | string | - | - |
| title | The content of hyperlink | VueNode | - | - |
| children | Nested Anchor Link, `Attention: This attribute does not support horizontal orientation` | [AnchorItem](#anchoritem)\[] | - | - |
| replace | Replace item href in browser history instead of pushing it | boolean | false | |

#### AnchorItemLink

We recommend using the items form instead.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| href | The target of hyperlink | string | - | - |
| target | Specifies where to display the linked URL | string | - | - |
| title | The content of hyperlink | VueNode | - | - |

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

### In version `5.25.0+`, the `:target` pseudo-class of the destination element does not take effect as expected after anchor navigation. 
For the purpose of page performance optimization, the implementation of anchor navigation has been changed from `window.location.href` to `window.history.pushState/replaceState`. Since `pushState/replaceState` does not trigger a page reload, the browser will not automatically update the matching state of the `:target` pseudo-class. To resolve this issue, you can manually construct the full URL: `href = window.location.origin + window.location.pathname + '#xxx'`.

Related issues: [#53143](https://github.com/ant-design/ant-design/issues/53143) [#54255](https://github.com/ant-design/ant-design/issues/54255)
