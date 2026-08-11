---
title: Collapse
description: A content area which can be collapsed and expanded.
---

## When To Use 
- Can be used to group or hide complex regions to keep the page clean.
- `Accordion` is a special kind of `Collapse`, which allows only one panel to be expanded at a time.

## Demos

| Demo | Path |
| --- | --- |
| Collapse | demo/basic.md |
| Size | demo/size.md |
| Accordion | demo/accordion.md |
| Nested panel | demo/mix.md |
| Borderless | demo/borderless.md |
| Custom Panel | demo/custom.md |
| SFC Mode | demo/sfc.md |
| No arrow | demo/noarrow.md |
| Extra node | demo/extra.md |
| Ghost Collapse | demo/ghost.md |
| Collapsible | demo/collapsible.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Collapse

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| activeKey | Key of the active panel | Array&lt;string \| number&gt; \| string \| number | No default value. In accordion mode, it's the key of the first panel | - | × |
| defaultActiveKey | Key of the initial active panel | Array&lt;string \| number&gt; \| string \| number | - | - | × |
| accordion | If true, Collapse renders as Accordion | boolean | false | - | × |
| destroyOnHidden | Destroy Inactive Panel | boolean | false | - | × |
| rootClass | Root container class | string | - | - | × |
| bordered | Toggles rendering of the border around the collapse block | boolean | true | - | × |
| expandIcon | Allow to customize collapse icon | (panelProps: PanelProps) =&gt; any | - | - | ✓ |
| expandIconPlacement | Set expand icon placement | `start` \| `end` | `start` | - | × |
| ghost | Make the collapse borderless and its background transparent | boolean | false | - | × |
| size | Set the size of collapse | SizeType | `middle` | - | × |
| collapsible | Specify how to trigger Collapse. Either by clicking icon or by clicking any area in header or disable collapse functionality itself | `header` \| `icon` \| `disabled` | - | - | × |
| labelRender | Custom render label | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - | - | × |
| contentRender | Custom render content | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | CollapseClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | CollapseStylesType | - | - | ✓ |
| items | Collapse items content | CollapseItemType[] | - | - | × |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback function executed when active panel is changed | (key: string[]) =&gt; void | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| expandIcon | Allow to customize collapse icon | (panelProps: PanelProps) =&gt; any | - |
| labelRender | - | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - |
| contentRender | - | (params: &#123; item: CollapseItemType, index: number &#125;) =&gt; any | - |

### CollapsePanel 
#### Props 
Deprecated: when using items, prefer configuring panels with `items`.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| header | - | VueNode | - | - |
| showArrow | - | boolean | true | - |
| extra | - | VueNode | - | - |
| collapsible | Specify how to trigger Collapse. Either by clicking icon or by clicking any area in header or disable collapse functionality itself | `header` \| `icon` \| `disabled` | - | - |

## Types

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| collapsible | Specify whether the panel be collapsible or the trigger area of collapsible | `header` \| `icon` \| `disabled` | - | - |
| content | Body area content | VueNode | - | - |
| extra | The extra element in the corner | VueNode | - | - |
| forceRender | Forced render of content on panel, instead of lazy rendering after clicking on header | boolean | false | - |
| key | Unique key identifying the panel from among its siblings | string \| number | - | - |
| label | Title of the panel | VueNode | - | - |
| showArrow | If false, panel will not show arrow icon. If false, collapsible can't be set as icon | boolean | true | - |

## Semantic DOM

| _semantic | demo/_semantic.md |
