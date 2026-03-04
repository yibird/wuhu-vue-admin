/**
 * List结构转Map结构
 * @param list 转换的list
 * @param keyMapper key映射函数
 * @param valueMapper value映射函数
 * @returns 转换的map
 */
export function listToMap<T, K, V>(
  list: T[],
  keyMapper: (item: T, index: number) => K,
  valueMapper: (item: T, index: number) => V
) {
  return list.reduce((acc, item, index) => {
    return acc.set(keyMapper(item, index) as K, valueMapper(item, index))
  }, new Map<K, V>())
}

/**
 * 通过id从扁平化的list递归向上查找,并根据parentId转换成tree
 * @param list 扁平化的list
 * @param id
 * @returns 组装后的tree
 */
export function listToTree<T extends { id: number; parentId?: number | null }>(
  list: T[],
  id: number
): T[] {
  return list.flatMap((item) => {
    return id === item.id ? listToTree(list, item.parentId!).concat(item) : []
  })
}
