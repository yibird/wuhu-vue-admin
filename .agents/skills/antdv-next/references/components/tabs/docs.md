---
title: Tabs
description: Tabs make it easy to explore and switch between different views.
---

## When To Use 
Antdv Next has 3 types of Tabs for different situations.

- Card Tabs: for managing too many closeable views.
- Normal Tabs: for functional aspects of a page.
- [Radio.Button](../radio/docs.md/#radio-demo-radiobutton): for secondary tabs.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Disabled | demo/disabled.md |
| Centered | demo/centered.md |
| Icon | demo/icon.md |
| Indicator | demo/custom-indicator.md |
| Slide | demo/slide.md |
| Extra content | demo/extra.md |
| Size | demo/size.md |
| Placement | demo/placement.md |
| Card type tab | demo/card.md |
| Add & close tab | demo/editable-card.md |
| Customized trigger of new tab | demo/custom-add-trigger.md |
| Customized bar of tab | demo/custom-tab-bar.md |
| Draggable Tabs | demo/custom-tab-bar-node.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Property 
Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| activeKey | Current TabPane's key, support `v-model:active-key` | string | - | - | × |
| addIcon | Customize add icon, only works with `type="editable-card"` | VueNode | `<PlusOutlined />` | - | ✓ |
| animated | Whether to change tabs with animation | boolean \| \{ inkBar: boolean, tabPane: boolean \} | \{ inkBar: true, tabPane: false \} | - | × |
| centered | Centers tabs | boolean | false | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function | TabsClassNamesType | - | - | ✓ |
| defaultActiveKey | Initial active TabPane's key, if `activeKey` is not set | string | `The key of first tab` | - | × |
| hideAdd | Hide plus icon or not. Only works while `type="editable-card"` | boolean | false | - | × |
| indicator | Customize `size` and `align` of indicator | \{ size?: number \| (origin: number) => number; align?: `start` \| `center` \| `end` \} | - | - | ✓ |
| items | Configure tab content | TabItemType[] | [] | - | × |
| more | Customize the collapse menu | MoreProps | \{ icon: `<EllipsisOutlined />`, trigger: 'hover' \} | - | ✓ |
| moreIcon | Custom icon of the collapse menu | VueNode | `<EllipsisOutlined />` | - | ✓ |
| removeIcon | The custom icon of remove, only works with `type="editable-card"` | VueNode | `<CloseOutlined />` | - | ✓ |
| renderTabBar | Replace the TabBar | (ctx: \{ props: any; TabNavListComponent: any \}) => VueNode | - | - | × |
| size | Preset tab bar size | `large` \| `middle` \| `small` | `middle` | - | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | TabsStylesType | - | - | ✓ |
| tabBarExtraContent | Extra content in tab bar | VueNode \| \{ left?: VueNode, right?: VueNode \} | - | - | × |
| tabBarGutter | The gap between tabs | number | - | - | × |
| tabBarStyle | Tab bar style object | CSSProperties | - | - | × |
| tabPlacement | Placement of tabs | `top` \| `end` \| `bottom` \| `start` | `top` | - | × |
| destroyOnHidden | Whether destroy inactive TabPane when change tab | boolean | false | - | × |
| type | Basic style of tabs | `line` \| `card` \| `editable-card` | `line` | - | × |

### TabItemType 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| closeIcon | Customize close icon in TabPane's head. Setting to `null` or `false` hides the close button | VueNode | - | - |
| destroyOnHidden | Whether destroy inactive TabPane when change tab | boolean | false | - |
| disabled | Set TabPane disabled | boolean | false | - |
| forceRender | Forced render of content in tabs, not lazy render after clicking on tabs | boolean | false | - |
| key | TabPane's key | string | - | - |
| label | Tab header text element | VueNode | - | - |
| icon | Tab header icon element | VueNode | - | - |
| content | Tab content element | VueNode | - | - |
| closable | Whether a close (x) button is visible, only works while `type="editable-card"` | boolean | true | - |

### MoreProps 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| icon | The custom icon | VueNode | - | - |
| DropdownProps | Dropdown props | DropdownProps | - | - |

### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback executed when active tab is changed | (activeKey: string) => void | - |
| edit | Callback executed when tab is added or removed. Only works while `type="editable-card"` | (e: MouseEvent \| KeyboardEvent \| string, action: 'add' \| 'remove') => void | - |
| tabClick | Callback executed when tab is clicked | (key: string, event: MouseEvent) => void | - |
| tabScroll | Trigger when tab scroll | (\{ direction: `left` \| `right` \| `top` \| `bottom` \}) => void | - |

### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| addIcon | Customize add icon, only works with `type="editable-card"` | () => any | - |
| moreIcon | Custom collapse menu icon | () => any | - |
| removeIcon | The custom icon of remove, only works with `type="editable-card"` | () => any | - |
| labelRender | Custom label render | (args: \{ item: TabItemType; index: number \}) => any | - |
| contentRender | Custom content render | (args: \{ item: TabItemType; index: number \}) => any | - |
| renderTabBar | Replace the TabBar | (args: \{ props: any; TabNavListComponent: any \}) => any | - |
| rightExtra | Extra content on the right | () => any | - |
| leftExtra | Extra content on the left | () => any | - |

### Methods 
| Method | Description | Type | Version |
| --- | --- | --- | --- |
| nativeElement | Root element | any | - |

## Semantic DOM

| _semantic | demo/_semantic.md |
