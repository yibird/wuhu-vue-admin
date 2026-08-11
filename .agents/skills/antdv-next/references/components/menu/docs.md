---
title: Menu
description: A versatile menu for navigation.
---

## When To Use 
Navigation is an important part of any website, as a good navigation setup allows users to move around the site quickly and efficiently. Antdv Next offers two navigation options: top and side. Top navigation provides all the categories and functions of the website. Side navigation provides the multi-level structure of the website.

More layouts with navigation: [Layout](../layout/docs.md).

## Notes for developers 
- Menu is rendered as a `ul` element, so it only supports [`li` and `script-supporting` elements](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element) as children nodes. Your customized node should be wrapped by `Menu.Item`.
- Menu needs to collect its node structure, so its children should be `Menu.*` or encapsulated components.

## Demos

| Demo | Path |
| --- | --- |
| Top Navigation | demo/horizontal.md |
| Inline menu | demo/inline.md |
| Collapsed inline menu | demo/inline-collapsed.md |
| Open current submenu only | demo/sider-current.md |
| Vertical menu | demo/vertical.md |
| Menu Themes | demo/theme.md |
| Sub-menu theme | demo/submenu-theme.md |
| Switch the menu type | demo/switch-mode.md |
| SFC Mode (Nested) | demo/sfc.md |
| Slot Render (items mode) | demo/slot-render.md |
| Custom semantic dom styling | demo/style-class.md |
| Custom Submenu Render | demo/custom-popup-render.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | MenuClassNamesType | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | MenuStylesType | - | - | ✓ |
| rootClass | Root container class | string | - | - | × |
| defaultOpenKeys | Array with the keys of default opened sub menus | string[] | - | - | × |
| defaultSelectedKeys | Array with the keys of default selected menu items | string[] | - | - | × |
| expandIcon | Custom expand icon of submenu | VueNode \| ((props: SubMenuProps & { isSubMenu: boolean }) => VueNode) | - | - | ✓ |
| forceSubMenuRender | Render submenu into DOM before it becomes visible | boolean | false | - | × |
| inlineCollapsed | Specifies the collapsed status when menu is inline mode | boolean | - | - | × |
| inlineIndent | Indent (in pixels) of inline menu items on each level | number | 24 | - | × |
| items | Menu item content | ItemType[] | - | - | × |
| mode | Type of menu | `vertical` \| `horizontal` \| `inline` | `vertical` | - | × |
| multiple | Allows selection of multiple items | boolean | false | - | × |
| openKeys | Array with the keys of currently opened sub-menus | string[] | - | - | × |
| overflowedIndicator | Customized the ellipsis icon when menu is collapsed horizontally | VueNode | `<EllipsisOutlined />` | - | × |
| selectable | Allows selecting menu items | boolean | true | - | × |
| selectedKeys | Array with the keys of currently selected menu items | string[] | - | - | × |
| subMenuCloseDelay | Delay time to hide submenu when mouse leaves (in seconds) | number | 0.1 | - | × |
| subMenuOpenDelay | Delay time to show submenu when mouse enters, (in seconds) | number | 0 | - | × |
| theme | Color theme of the menu | `light` \| `dark` | `light` | - | × |
| triggerSubMenuAction | Which action can trigger submenu open/close | `hover` \| `click` | `hover` | - | × |
| getPopupContainer | To set the container of the submenu popup. The default is to create a div element in body, but you can reset it to the scrolling area and make a relative reposition | (triggerNode: HTMLElement) => HTMLElement | () => document.body | - | × |
| itemIcon | Custom menu item icon render | (props: MenuItemProps & RenderIconInfo) => any | - | - | × |
| labelRender | Custom label render | (item: RenderItem) => any | - | - | × |
| iconRender | Custom icon render (items mode) | (item: RenderItem) => any | - | - | × |
| extraRender | Custom extra render | (item: RenderItem) => any | - | - | × |
| popupRender | Custom popup renderer for submenu | (node: VueNode, info: { item: SubMenuProps; keys: string[] }) => VueNode | - | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| click | Called when a menu item is clicked | (info: MenuInfo) => void | - |
| select | Called when a menu item is selected | (info: SelectInfo) => void | - |
| deselect | Called when a menu item is deselected (multiple mode only) | (info: SelectInfo) => void | - |
| openChange | Called when sub-menus are opened or closed | (openKeys: string[]) => void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| expandIcon | Custom expand icon | () => any | - |
| labelRender | Customize label content | (item: RenderItem) => any | - |
| iconRender | Customize item icon (items mode) | (item: RenderItem) => any | - |
| extraRender | Customize extra content | (item: RenderItem) => any | - |
| itemIcon | Custom item icon | (props: MenuItemProps & RenderIconInfo) => any | - |

### Methods

| Method | Description | Type | Version |
| --- | --- | --- | --- |
| menu | Menu ref | VcMenuRef \| null | - |
| focus | Focus menu | (options?: FocusOptions) => void | - |

## Types

### ItemType

> type ItemType = MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType | null;

#### MenuItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| danger | Display the danger style | boolean | false | - |
| disabled | Whether menu item is disabled | boolean | false | - |
| extra | The extra of the menu item | VueNode | - | - |
| icon | The icon of the menu item | VueNode | - | - |
| key | Unique ID of the menu item | string | - | - |
| label | Menu label | VueNode | - | - |
| title | Set display title for collapsed item | string | - | - |

#### SubMenuType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Sub-menus or sub-menu items | ItemType[] | - | - |
| disabled | Whether sub-menu is disabled | boolean | false | - |
| icon | Icon of sub menu | VueNode | - | - |
| key | Unique ID of the sub-menu | string | - | - |
| label | Menu label | VueNode | - | - |
| popupClassName | Sub-menu class name, not working when `mode="inline"` | string | - | - |
| popupOffset | Sub-menu offset, not working when `mode="inline"` | [number, number] | - | - |
| theme | Color theme of the SubMenu (inherits from Menu by default) | `light` \| `dark` | - | - |
| onTitleClick | Callback executed when the sub-menu title is clicked | (info: { key: string; domEvent: MouseEvent }) => void | - | - |
| popupRender | Custom popup renderer for current sub-menu | (node: VueNode, info: { item: SubMenuProps; keys: string[] }) => VueNode | - | - |

#### MenuItemGroupType

Define `type` as `group` to make as group:

```ts
const groupItem = {
  type: 'group', // Must have
  label: 'My Group',
  children: [],
}
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Sub-menu items | MenuItemType[] | - | - |
| label | The title of the group | VueNode | - | - |

#### MenuDividerType

Divider line in between menu items, only used in vertical popup Menu or Dropdown Menu. Need define the `type` as `divider`:

```ts
const dividerItem = {
  type: 'divider', // Must have
}
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| dashed | Whether line is dashed | boolean | false | - |

## FAQ

### Why will Menu's children be rendered twice? 
Menu collects structure info with [twice-render](https://github.com/react-component/menu/blob/f4684514096d6b7123339cbe72e7b0f68db0bce2/src/Menu.tsx#L543) to support HOC usage. Merging into one render may cause the logic to become much more complex. Contributions to help improve the collection logic are welcomed.

### Why Menu do not responsive collapse in Flex layout? 
Menu will render fully item in flex layout and then collapse it. You need tell flex not consider Menu width to enable responsive ([online demo](https://codesandbox.io/s/ding-bu-dao-hang-antd-4-21-7-forked-5e3imy?file=/demo.js)):

```html
<div style="display: flex;">
  <div style="flex: none;">Some Content</div>
  <a-menu style="min-width: 0; flex: auto;" />
</div>
```

## Semantic DOM

| _semantic | demo/_semantic.md |
