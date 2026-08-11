---
title: Splitter
description: Split panels to isolate content.
---

## When To Use

Provide a draggable split panel for creating complex multi-column or multi-row layouts.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/size.md |
| Vertical | demo/vertical.md |
| Controlled | demo/control.md |
| Collapsible | demo/collapsible.md |
| Collapsible Icon | demo/collapsibleIcon.md |
| Multiple | demo/multiple.md |
| Layout Group | demo/group.md |
| Size Mix | demo/size-mix.md |
| Lazy | demo/lazy.md |
| Double-clicked reset | demo/reset.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Splitter

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| collapsibleIcon | Custom collapsible icon | &#123; start?: VueNode; end?: VueNode &#125; | - | 6.0.0 | × |
| draggerIcon | Custom dragger icon | VueNode | - | 6.0.0 | × |
| lazy | Lazy rendering mode | boolean | false | 5.23.0 | × |
| orientation | Layout direction | `vertical` \| `horizontal` | `horizontal` | - | × |
| vertical | Orientation, Simultaneously existing with `orientation`, `orientation` takes priority | boolean | false | - | × |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| collapse | Callback when expanding or collapsing | (collapsed: boolean[], sizes: number[]) =&gt; void | 5.28.0 |
| resize | Panel size change callback | (sizes: number[]) =&gt; void | - |
| resizeEnd | Drag end callback | (sizes: number[]) =&gt; void | - |
| resizeStart | Callback before dragging starts | (sizes: number[]) =&gt; void | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| collapsibleIconEnd | Custom collapsible end icon | () =&gt; VueNode | - |
| collapsibleIconStart | Custom collapsible start icon | () =&gt; VueNode | - |
| draggerIcon | Custom dragger icon | () =&gt; VueNode | 6.0.0 |

### SplitterPanel

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| collapsible | Enable collapsible | boolean \| &#123; start?: boolean; end?: boolean; showCollapsibleIcon?: boolean \| 'auto' &#125; | false | 5.28.0 |
| defaultSize | Initial panel size, supports px and percentage | number \| string | - | - |
| max | Maximum threshold, supports px and percentage | number \| string | - | - |
| min | Minimum threshold, supports px and percentage | number \| string | - | - |
| resizable | Whether to enable resize | boolean | true | - |
| size | Controlled panel size, supports px and percentage | number \| string | - | - |

## Semantic DOM

| _semantic | demo/_semantic.md |
