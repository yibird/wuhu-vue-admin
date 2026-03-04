export interface TreeConfig {
  // 节点 ID 字段名称
  idKey: string
  // 子节点字段名称
  childrenKey: string
  // 父节点字段名称
  parentIdKey?: string
}

/**
 * tree结构根据children属性扁平化为list
 * @param tree
 * @returns 扁平化的list
 */
export function treeToList<T extends { children?: T[] }>(tree: T[]): T[] {
  return tree.flatMap((item) => {
    return Array.isArray(item.children)
      ? [item].concat(treeToList(item.children))
      : [item]
  })
}

/**
 * Tree转Set
 * @param tree 属性结构
 * @returns 转换后的Set结构
 */
export function treeToSet<T extends { children?: T[] }>(tree: T[]): Set<T> {
  return new Set(treeToList(tree))
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
    key?: string | number | bigint
    id?: string | number | bigint
    children?: U[]
  } | null,
>(tree: T[], callback: (item: T) => U): U[] {
  let node: T | undefined
  const list = [...tree]
  const newTree: U[] = []
  while ((node = list.shift())) {
    const res = callback(node)
    // 如果是根节点则直接添加,如果有父节点则把node添加至对应的父节点的children下
    if (!node.parentId) {
      newTree.push({ ...res, children: [] })
    } else {
      if (node) {
        newTree.forEach((item) => {
          if (item && Number(item.id ?? item.key) === node!.parentId) {
            if (item.children) {
              item.children.push(res)
            }
          }
        })
      }
    }
    if (node.children) {
      list.push(...node.children)
    }
  }
  return newTree
}

/**
 * 返回某个目标节点的 所有祖先节点(从最近的父节点到根节点,顺序由下往上)
 * @param tree 树结构
 * @param targetId 目标节点id
 * @param config 树配置项
 * @returns 返回一个节点数组,包含了相关联的节点层级
 */
export function getParentNodes<T extends Record<string, any>>(
  tree: T[],
  targetId: string | number,
  config: TreeConfig = { idKey: 'id', childrenKey: 'children' }
): T[] | [] {
  const { idKey = 'id', childrenKey = 'children' } = config
  const stack: { node: T; path: T[] }[] = []
  for (const rootNode of tree) {
    stack.push({ node: rootNode, path: [rootNode] })
  }
  while (stack.length > 0) {
    const { node, path } = stack.pop()!
    if (String(node[idKey]) === String(targetId)) {
      return path
    }
    if (node[childrenKey]) {
      for (const child of node[childrenKey] as T[]) {
        stack.push({ node: child, path: [...path, child] })
      }
    }
  }
  return []
}

/**
 * 在一棵树形结构中,查找指定 id 的节点,并返回该节点对象
 * @param tree 树结构
 * @param targetId 目标节点id
 * @param config 树配置项
 * @returns 返回指定id节点的顶层节点,如果没有找到则返回null
 */
export function findNodeById<T extends Record<string, any>>(
  tree: T[],
  targetId: string | number,
  config: TreeConfig = { idKey: 'id', childrenKey: 'children' }
): T | null {
  const { idKey = 'id', childrenKey = 'children' } = config
  const stack: T[] = [...tree]
  while (stack.length > 0) {
    const node = stack.pop()!
    if (String(node[idKey]) === String(targetId)) {
      return node // 找到目标节点
    }
    if (node[childrenKey]) {
      stack.push(...(node[childrenKey] as T[]))
    }
  }
  return null
}

/**
 * 根据指定节点id获取该节点的父节点
 * @param tree 树结构
 * @param targetId 目标节点id
 * @param config 树配置
 * @returns 返回指定节点id获取顶层节点或null
 */
export function findParentNode<T extends Record<string, any>>(
  tree: T[],
  targetId: string | number,
  config: TreeConfig = { idKey: 'id', childrenKey: 'children' }
): T | null {
  const { idKey = 'id', childrenKey = 'children' } = config
  const stack: { node: T; parent: T | null }[] = tree.map((node) => ({
    node,
    parent: null,
  }))
  while (stack.length) {
    const { node, parent } = stack.pop()!
    if (String(node[idKey]) === String(targetId)) {
      return parent
    }
    const children = node[childrenKey] as T[] | undefined
    if (children?.length) {
      for (const child of children) {
        stack.push({ node: child, parent: node })
      }
    }
  }
  return null
}

/**
 * 获取树的第一个分支
 * @param tree 树结构数组
 * @param childrenKey 子节点键名
 * @returns 返回树的第一个分支(分支组成的数组)
 */
export function getFirstBranch<T extends Record<string, any>>(
  tree: T[],
  childrenKey: string = 'children'
): T[] {
  const path: T[] = []
  let currentList = tree
  while (currentList && currentList.length > 0) {
    const firstNode = currentList[0]
    if (firstNode) {
      path.push(firstNode)
      currentList = firstNode[childrenKey] || []
    }
  }
  return path
}

/**
 * 获取树的最后一个分支
 * @param tree 树结构数组
 * @param childrenKey 子节点键名
 * @returns 返回树的最后一个分支(分支组成的数组)
 */
export function getLastBranch<T extends Record<string, any>>(
  tree: T[],
  childrenKey: string = 'children'
): T[] {
  const path: T[] = []
  let currentList = tree
  while (currentList && currentList.length > 0) {
    const lastNode = currentList[currentList.length - 1]
    if (lastNode) {
      path.push(lastNode)
      currentList = lastNode[childrenKey] || []
    }
  }
  return path
}

/**
 * 基于深度优先获取所有叶子节点(没有子节点的节点)的函数
 * @param tree 树结构
 * @param config 树配置项
 * @returns 返回所有叶子节点的数组
 */
export function getLeafNodes<T extends Record<string, any>>(
  tree: T[],
  config: TreeConfig = { idKey: 'key', childrenKey: 'children' }
): T[] {
  const { childrenKey = 'children' } = config
  const result: T[] = []
  const stack: T[] = [...tree]
  while (stack.length) {
    const node = stack.pop()!
    const children = node[childrenKey] as T[] | undefined
    if (children && children.length > 0) {
      stack.push(...children)
    } else {
      result.push(node)
    }
  }
  return result
}

/**
 * 基于前序遍历树结构的函数
 * @param tree 树结构
 * @param visitor 访问器函数,用于处理每个节点
 * @param childrenKey 子节点键名
 */
export function eachPreOrder<T extends Record<string, any>>(
  tree: T[],
  visitor: (node: T, level: number, parent: T | null) => void,
  config: TreeConfig = { idKey: 'key', childrenKey: 'children' }
) {
  const { childrenKey = 'children' } = config
  const walk = (nodes: T[], level: number, parent: T | null) => {
    for (const node of nodes) {
      visitor(node, level, parent)
      const children = node[childrenKey] as T[] | undefined
      if (Array.isArray(children)) {
        walk(children, level + 1, node)
      }
    }
  }
  walk(tree, 0, null)
}

/**
 * 基于后序遍历树结构的函数
 * @param tree 树结构
 * @param visitor 访问器函数,用于处理每个节点
 * @param childrenKey 子节点键名
 */
export function eachPostOrder<T extends Record<string, any>>(
  tree: T[],
  visitor: (node: T, level: number, parent: T | null) => void,
  config: TreeConfig = { idKey: 'key', childrenKey: 'children' }
) {
  const { childrenKey = 'children' } = config
  const walk = (nodes: T[], level: number, parent: T | null) => {
    for (const node of nodes) {
      const children = node[childrenKey] as T[] | undefined // 不再报错
      if (Array.isArray(children)) {
        walk(children, level + 1, node)
      }
      visitor(node, level, parent)
    }
  }
  walk(tree, 0, null)
}
