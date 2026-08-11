---
title: Tree
description: Multiple-level structure list.
---

## When To Use

Almost anything can be represented in a tree structure. Examples include directories, organization hierarchies, biological classifications, countries, etc. The `Tree` component is a way of representing the hierarchical relationship between these things. You can also expand, collapse, and select a treeNode within a `Tree`.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Controlled Tree | demo/basic-controlled.md |
| draggable | demo/draggable.md |
| load data asynchronously | demo/dynamic.md |
| Searchable | demo/search.md |
| Tree with line | demo/line.md |
| Customize Icon | demo/customized-icon.md |
| directory | demo/directory.md |
| Customize collapse/expand icon | demo/switcher-icon.md |
| Virtual scroll | demo/virtual-scroll.md |
| Block Node | demo/block-node.md |
| Big data | demo/big-data.md |
| Multiple lines | demo/multiple-line.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Tree

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| allowDrop | Whether to allow dropping on the node | (&#123; dropNode, dropPosition &#125;) =&gt; boolean | - | - | × |
| autoExpandParent | Whether to automatically expand a parent treeNode | boolean | false | - | × |
| blockNode | Whether treeNode fill remaining horizontal space | boolean | false | - | × |
| checkable | Add a Checkbox before the treeNodes | boolean | false | - | × |
| checkedKeys | (Controlled) Specifies the keys of the checked treeNodes (PS: When this specifies the key of a treeNode which is also a parent treeNode, all the children treeNodes of will be checked; and vice versa, when it specifies the key of a treeNode which is a child treeNode, its parent treeNode will also be checked. When `checkable` and `checkStrictly` is true, its object has `checked` and `halfChecked` property. Regardless of whether the child or parent treeNode is checked, they won't impact each other, support `v-model:checked-keys` | string[] \| &#123;checked: string[], halfChecked: string[]&#125; | [] | - | × |
| checkStrictly | Check treeNode precisely; parent treeNode and children treeNodes are not associated | boolean | false | - | × |
| defaultCheckedKeys | Specifies the keys of the default checked treeNodes | string[] | [] | - | × |
| defaultExpandAll | Whether to expand all treeNodes by default | boolean | false | - | × |
| defaultExpandedKeys | Specify the keys of the default expanded treeNodes | string[] | [] | - | × |
| defaultExpandParent | If auto expand parent treeNodes when init | boolean | true | - | × |
| defaultSelectedKeys | Specifies the keys of the default selected treeNodes | string[] | [] | - | × |
| disabled | Whether the tree is disabled | boolean | false | - | × |
| draggable | Specifies whether this Tree or the node is draggable. Use `icon: false` to disable drag handler icon | boolean \| ((node: DataNode) =&gt; boolean) \| &#123; icon?: VueNode \| false, nodeDraggable?: (node: DataNode) =&gt; boolean &#125; | false | - | × |
| expandedKeys | (Controlled) Specifies the keys of the expanded treeNodes, support `v-model:expanded-keys` | string[] | [] | - | × |
| fieldNames | Customize node title, key, children field name | object | &#123; title: `title`, key: `key`, children: `children` &#125; | - | × |
| filterAntTreeNode | Defines a function to filter (highlight) treeNodes. When the function returns `true`, the corresponding treeNode will be highlighted | function(node) | - | - | × |
| height | Config virtual scroll height. Will not support horizontal scroll when enabled | number | - | - | × |
| icon | Insert a custom icon before the title. Need to set `showIcon` to true | VueNode \| (props) =&gt; VueNode | - | - | × |
| loadData | Load data asynchronously | function(node) | - | - | × |
| loadedKeys | (Controlled) Set loaded tree nodes. Need to work with `loadData` | string[] | [] | - | × |
| multiple | Allows selecting multiple treeNodes | boolean | false | - | × |
| rootStyle | Style on the root element | CSSProperties | - | - | × |
| selectable | Whether it can be selected | boolean | true | - | × |
| selectedKeys | (Controlled) Specifies the keys of the selected treeNodes, multiple selection needs to set `multiple` to true, support `v-model:selected-keys` | string[] | - | - | × |
| showIcon | Controls whether to display the `icon` node (no default style) | boolean | false | - | × |
| showLine | Shows a connecting line | boolean \| &#123;showLeafIcon: VueNode \| ((props: AntTreeNodeProps) =&gt; VueNode)&#125; | false | - | × |
| switcherIcon | Customize expand/collapse icons for tree nodes (With default rotate angular style) | VueNode \| ((props: AntTreeNodeProps) =&gt; VueNode) | - | - | × |
| switcherLoadingIcon | Customize loading icons for tree nodes | VueNode | - | - | × |
| titleRender | Customize tree node title render | (nodeData) =&gt; VueNode | - | - | × |
| treeData | The treeNodes data Array, if set it then you need not to construct children TreeNode. (key should be unique across the whole array) | array&lt;&#123; key, title, children, [disabled, selectable] &#125;&gt; | - | - | × |
| virtual | Disable virtual scroll when set to false | boolean | true | - | × |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| check | Callback function for when the onCheck event occurs | function(checkedKeys, e:&#123;checked: boolean, checkedNodes, node, event, halfCheckedKeys&#125;) | - |
| dragEnd | Callback function for when the onDragEnd event occurs | function(&#123;event, node&#125;) | - |
| dragEnter | Callback function for when the onDragEnter event occurs | function(&#123;event, node, expandedKeys&#125;) | - |
| dragLeave | Callback function for when the onDragLeave event occurs | function(&#123;event, node&#125;) | - |
| dragOver | Callback function for when the onDragOver event occurs | function(&#123;event, node&#125;) | - |
| dragStart | Callback function for when the onDragStart event occurs | function(&#123;event, node&#125;) | - |
| drop | Callback function for when the onDrop event occurs | function(&#123;event, node, dragNode, dragNodesKeys&#125;) | - |
| expand | Callback function for when a treeNode is expanded or collapsed | function(expandedKeys, &#123;expanded: boolean, node&#125;) | - |
| load | Callback function for when a treeNode is loaded | function(loadedKeys, &#123;event, node&#125;) | - |
| rightClick | Callback function for when the user right clicks a treeNode | function(&#123;event, node&#125;) | - |
| select | Callback function for when the user clicks a treeNode | function(selectedKeys, e:&#123;selected: boolean, selectedNodes, node, event&#125;) | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| switcherLoadingIcon | Customize loading icons for tree nodes | () =&gt; any | - |
| switcherIcon | Customize expand/collapse icons for tree nodes | (props: AntTreeNodeProps) =&gt; any | - |
| draggableIcon | Custom draggable icon | () =&gt; any | - |
| icon | Insert a custom icon before the title | (props: AntdTreeNodeAttribute) =&gt; any | - |
| titleRender | Customize tree node title render | VcTreeProps['titleRender'] | - |

#### Methods 
| Name | Description |
| --- | --- |
| scrollTo(&#123; key: Key, align?: 'top' \| 'bottom' \| 'auto', offset?: number &#125;) | Scroll to key item in virtual scroll |

### TreeNode

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checkable | When Tree is checkable, set TreeNode display Checkbox or not | boolean | - | - |
| disableCheckbox | Disables the checkbox of the treeNode | boolean | false | - |
| disabled | Disables the treeNode | boolean | false | - |
| icon | Customize icon. When you pass component, whose render will receive full TreeNode props as component props | VueNode \| (props) =&gt; VueNode | - | - |
| isLeaf | Determines if this is a leaf node (effective when `loadData` is specified). `false` will force the TreeNode to be treated as a parent node | boolean | - | - |
| key | Used with (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys. P.S.: It must be unique in all of treeNodes of the tree | string | (internal calculated position of treeNode) | - |
| selectable | Set whether the treeNode can be selected | boolean | true | - |
| title | Title | VueNode | `---` | - |

### DirectoryTree

#### Props 
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| expandAction | Directory opening logic, options: false \| `click` \| `doubleClick` | string \| boolean | `click` |

## Semantic DOM 
| _semantic | demo/_semantic.md |

## FAQ

### Why defaultExpandAll not working on ajax data? 
`default` prefix props only work when initializing. So `defaultExpandAll` has already been executed when ajax loads data. You can control `expandedKeys` or render the Tree when data is loaded to realize expanding all nodes.

### Virtual scroll limitation 
Virtual scroll only render items in visible region. Thus not support auto width (like long `title` with horizontal scroll).

### What does `disabled` node work logic in the tree? 
Tree change its data by conduction. Includes checked or auto expanded, it will conduction state to parent / children node until current node is `disabled`. So if a controlled node is `disabled`, it will only modify self state and not affect other nodes. For example, a parent node contains 3 child nodes and one of them is `disabled`. When check the parent node, it will only check rest 2 child nodes. As the same, when check these 2 child node, parent will be checked whatever checked state the `disabled` one is.

This conduction logic prevents modifying `disabled` parent checked state by checking children nodes, and users cannot modify directly with click which avoids interactive conflicts. If you want to modify this conduction logic, you can customize it with the `checkStrictly` prop.
