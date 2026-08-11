---
title: Dropdown
description: A dropdown list.
---

## When To Use

When there are more than a few options to choose from, you can wrap them in a `Dropdown`. By hovering or clicking on the trigger, a dropdown menu will appear, which allows you to choose an option and execute the relevant action.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Extra node | demo/extra.md |
| Placement | demo/placement.md |
| Arrow | demo/arrow.md |
| Other elements | demo/item.md |
| Arrow pointing at the center | demo/arrow-center.md |
| Trigger mode | demo/trigger.md |
| Click event | demo/event.md |
| Button with dropdown menu | demo/dropdown-button.md |
| Custom dropdown | demo/custom-dropdown.md |
| Cascading menu | demo/sub-menu.md |
| The way of hiding menu | demo/overlay-open.md |
| Context Menu | demo/context-menu.md |
| Loading | demo/loading.md |
| Selectable Menu | demo/selectable.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the Dropdown component. Supports object or function | DropdownClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the Dropdown component. Supports object or function | DropdownStylesType | - | - | ✓ |
| menu | The menu props | MenuProps & &#123; activeKey?: VcMenuProps['activeKey'], onClick?: MenuEmits['click'] &#125; | - | - | × |
| autoFocus | Focus the first menu item when opened | boolean | - | - | × |
| arrow | Whether the dropdown arrow should be visible. Supports `pointAtCenter` | boolean \| DropdownArrowOptions | false | - | × |
| trigger | The trigger mode which executes the dropdown action. Note that hover can't be used on touchscreens | ('click' \| 'hover' \| 'contextmenu')[] | ['hover'] | - | × |
| popupRender | Customize popup content | (menu: VueNode) =&gt; VueNode | - | - | × |
| open | Whether the dropdown menu is currently open | boolean | - | - | × |
| disabled | Whether the dropdown menu is disabled | boolean | - | - | × |
| destroyOnHidden | Whether destroy dropdown when hidden | boolean | false | - | × |
| align | Popup align config | AlignType | - | - | × |
| getPopupContainer | To set the container of the dropdown menu. The default is to create a div element in body, but you can reset it to the scrolling area and make a relative reposition. [Example on CodePen](https://codepen.io/afc163/pen/zEjNOy?editors=0010) | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | - | × |
| prefixCls | Customize prefix class name | string | - | - | × |
| transitionName | Motion name of dropdown | string | - | - | × |
| placement | Placement of popup menu: `bottom` `bottomLeft` `bottomRight` `top` `topLeft` `topRight` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` | Placement | `bottomLeft` | left/right: 1.4.0 | × |
| forceRender | Force render dropdown overlay | boolean | - | - | × |
| mouseEnterDelay | Delay in seconds before showing dropdown | number | 0.15 | - | × |
| mouseLeaveDelay | Delay in seconds before hiding dropdown | number | 0.1 | - | × |
| openClassName | Class added to trigger when dropdown is open | string | - | - | × |
| autoAdjustOverflow | Whether to adjust dropdown placement automatically when dropdown is off screen | boolean \| AdjustOverflow | true | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Called when the open state is changed. Not trigger when hidden by click item | (open: boolean, info: &#123; source: 'trigger' \| 'menu' &#125;) =&gt; void | - |
| menuClick | Callback when menu item clicked | MenuEmits['click'] | - |

### Slots

| Slot        | Description             | Type                      | Version |
|-------------|-------------------------|---------------------------| ---     |
| popupRender | Customize popup content | (menu: VueNode) =&gt; any | -       |
| labelRender | Customize label content | (item: Item) =&gt; any    | -       |

Dropdown also supports Menu slots (such as `labelRender`) via the Dropdown slots.

## Note

Please ensure that the child node of `Dropdown` accepts `mouseenter`, `mouseleave`, `focus`, `click` events.

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

### How to prevent Dropdown from being squeezed when it exceeds the screen horizontally? 
You can use `width: max-content` style to handle this. ref [#43025](https://github.com/ant-design/ant-design/issues/43025#issuecomment-1594394135).
