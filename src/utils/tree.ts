/**
 * tree结构根据children属性扁平化为list
 * @param tree
 * @returns 扁平化的list
 */
export function toList<T extends { children?: T[] }>(tree: T[]): T[] {
  return tree.flatMap((item) => {
    return Array.isArray(item.children)
      ? [item].concat(toList(item.children))
      : [item];
  });
}

/**
 * 通过id从扁平化的list递归向上查找,并根据parentId转换成tree
 * @param list 扁平化的list
 * @param id
 * @returns 组装后的tree
 */
export function toTree<T extends { id: number; parentId?: number | null }>(
  list: T[],
  id: number
): T[] {
  return list.flatMap((item) => {
    return id === item.id ? toTree(list, item.parentId!).concat(item) : [];
  });
}

/**
 * 深度优先遍历树结构,并将树中的每个元素通过映射函数转换为目标元素,
 * 返回转换映射后的树结构。
 * @param tree 树结构
 * @param func 映射函数
 * @returns 转换映射后的树结构
 */
export function treeMap<
  T extends { id: number; children?: T[]; parentId?: number | null },
  U extends {
    key?: number | string;
    id?: number | string;
    children?: U[];
  } | null
>(tree: T[], callback: (item: T) => U): U[] {
  let node: T | undefined,
    list = [...tree];
  const newTree: U[] = [];
  while ((node = list.shift())) {
    const res = callback(node);
    // 如果是根节点则直接添加,如果有父节点则把node添加至对应的父节点的children下
    if (!node.parentId) {
      newTree.push({ ...res, children: [] });
    } else {
      if (node) {
        newTree.forEach((item) => {
          if (item && Number(item.id ?? item.key) === node!.parentId) {
            item.children && item.children.push(res);
          }
        });
      }
    }
    node.children && list.push(...node.children);
  }
  return newTree;
}
