import { useDictStore } from '@/store'

export function useDict() {
  const {
    dictMap,
    loadAllDict,
    loadDict,
    getDict,
    refreshDict,
    clearDict,
    clearAllDict,
  } = useDictStore()

  /**
   * 获取字典所有标签
   *
   * @param type 字典类型
   * @returns 字典标签数组
   */
  function getDictLabels(type: string) {
    return getDict(type).map((item) => item.label)
  }

  /**
   * 获取字典所有值
   *
   * @param type 字典类型
   * @returns 字典值数组
   */
  function getDictValues(type: string) {
    return getDict(type).map((item) => item.value)
  }

  /**
   * 获取所有字典类型
   *
   * @returns 所有字典类型数组
   */
  function getDictKeys() {
    return Object.keys(dictMap)
  }

  /**
   * 获取字典标签
   *
   * @param type 字典类型
   * @param value 字典值
   * @returns 字典标签
   */
  function getDictLabel(type: string, value: string) {
    return getDict(type).find((item) => item.value === value)?.label
  }

  /**
   * 获取字典选项
   *
   * @param type 字典类型
   * @param value 字典值
   * @returns 字典选项
   */
  function getDictOption(type: string, value: string | number) {
    return getDict(type).find((item) => item.value === value)
  }

  return {
    dictMap,
    loadAllDict,
    loadDict,
    getDict,
    refreshDict,
    clearDict,
    clearAllDict,
    getDictOptions: getDict,
    getDictLabels,
    getDictValues,
    getDictKeys,
    getDictLabel,
    getDictOption,
  }
}
