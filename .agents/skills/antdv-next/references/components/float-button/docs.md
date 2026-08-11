---
title: FloatButton
description: A button that floats at the top of the page.
---

## When To Use

- For global functionality on the site.
- Buttons that can be seen wherever you browse.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Type | demo/type.md |
| Shape | demo/shape.md |
| Content | demo/content.md |
| FloatButton with tooltip | demo/tooltip.md |
| FloatButton Group | demo/group.md |
| Menu mode | demo/group-menu.md |
| Controlled mode | demo/controlled.md |
| placement | demo/placement.md |
| BackTop | demo/back-top.md |
| badge | demo/badge.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### FloatButtonGroup

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| shape | Setting button shape of children | `circle` \| `square` | `circle` | - | × |
| trigger | Which action can trigger menu open/close | `click` \| `hover` | - | - | × |
| open | Whether the menu is visible or not, use it with trigger | boolean | - | - | × |
| closeIcon | Customize close button icon | VueNode | `<CloseOutlined />` | - | ✓ |
| placement | Customize menu animation placement | `top` \| `left` \| `right` \| `bottom` | `top` | - | × |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| update:open | Callback executed when active menu is changed, use it with trigger | (open: boolean) =&gt; void | - |
| click | Set the handler to handle `click` event (only work in Menu mode) | (e: MouseEvent) =&gt; void | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Children buttons content | () =&gt; any | - |
| icon | Icon of trigger button | () =&gt; any | - |
| closeIcon | Customize close button icon | () =&gt; any | - |

### FloatButton

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| icon | Set the icon component of button | VueNode | - | - | × |
| content | Text and other | VueNode | - | - | × |
| ~~description~~ | Please use `content` instead | VueNode | - | - | × |
| tooltip | The text shown in the tooltip | VueNode \| TooltipProps | - | - | × |
| type | Setting button type | `default` \| `primary` | `default` | - | × |
| shape | Setting button shape | `circle` \| `square` | `circle` | - | × |
| href | The target of hyperlink | string | - | - | × |
| target | Specifies where to display the linked URL | string | - | - | × |
| htmlType | Set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type) | `submit` \| `reset` \| `button` | `button` | - | × |
| badge | Attach Badge to FloatButton. `status` and other props related are not supported. | [BadgeProps](../badge/docs.md#api) | - | - | × |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | Set the handler to handle `click` event | (e: MouseEvent) =&gt; void | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Button content | () =&gt; any | - |
| icon | Set the icon component of button | () =&gt; any | - |
| tooltip | The text shown in the tooltip | (props?: TooltipProps) =&gt; any | - |

### FloatBackTop 
#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | Time to return to top（ms） | number | 450 | - |
| target | Specifies the scrollable area dom node | () =&gt; HTMLElement | () =&gt; window | - |
| visibilityHeight | The BackTop button will not show until the scroll height reaches this value | number | 400 | - |
| target | Specifies where to display the linked URL | '_self' \| '_blank' \| '_parent' \| '_top' \| string | - | - |
| badge | Attach Badge to FloatButton. `status` and other props related are not supported. | FloatButtonBadgeProps & &#123; class?: string &#125; | - | 5.4.0 |
| htmlType | Set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type) | ButtonHTMLType | `button` | 5.21.0 |
| ariaLabel | - | string | - | - |
| style | - | CSSProperties | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | FloatButtonClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | FloatButtonStylesType | - | - |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | A callback function, which can be executed when you click the button | () =&gt; void | - |

## Semantic DOM

### FloatButton

| _semantic | demo/_semantic.md |

### FloatButtonGroup

| _semantic_group | demo/_semantic_group.md |
